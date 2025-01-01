import React, { useState } from 'react';
import { Button, Space, Tooltip, Upload, message, Modal, Row, Col, Tree } from 'antd';
import {
  SaveOutlined,
  UploadOutlined,
  UndoOutlined,
  RedoOutlined,
  DeleteOutlined,
  CopyOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import './styles.css';

const Toolbar = ({ graph }) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (!graph) return;
    const data = graph.toJSON();
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUri;
    downloadLink.download = 'flowchart.json';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    message.success('保存成功');
  };

  const handleLoad = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        graph.fromJSON(data);
        message.success('加载成功');
      } catch (error) {
        message.error('文件格式错误');
      }
    };
    reader.readAsText(file);
    return false;
  };

  const handleUndo = () => {
    if (graph && graph.canUndo()) {
      graph.undo();
    }
  };

  const handleRedo = () => {
    if (graph && graph.canRedo()) {
      graph.redo();
    }
  };

  const handleDelete = () => {
    if (!graph) return;
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.removeCells(cells);
    }
  };

  const handleCopy = () => {
    if (!graph) return;
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.copy(cells);
    }
  };

  const handleCut = () => {
    if (!graph) return;
    const cells = graph.getSelectedCells();
    if (cells.length) {
      graph.cut(cells);
    }
  };

  const handlePaste = () => {
    if (!graph || graph.isClipboardEmpty()) return;
    const cells = graph.paste({ offset: 32 });
    graph.cleanSelection();
    graph.select(cells);
  };

  const handleZoomIn = () => {
    if (!graph) return;
    const zoom = graph.zoom();
    if (zoom < 1.5) {
      graph.zoom(0.1);
    }
  };

  const handleZoomOut = () => {
    if (!graph) return;
    const zoom = graph.zoom();
    if (zoom > 0.5) {
      graph.zoom(-0.1);
    }
  };

  const handleLoadFromSystem = () => {
    setOpen(true);
    setLoading(true);
    fetch('/api/files')
      .then(response => response.json())
      .then(data => {
        setLoading(false);
        setFiles(data);
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  };

  const handleSelectFile = (file) => {
    setSelectedFile(file);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    if (selectedFile) {
      fetch(`/api/files/${selectedFile.id}`)
        .then(response => response.json())
        .then(data => {
          setOpen(false);
          handleLoad(data);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  return (
    <div className="toolbar">
      <Space size="small">
        <Tooltip title="保存">
          <Button icon={<SaveOutlined />} onClick={handleSave} />
        </Tooltip>
        <Tooltip title="加载">
          <Upload
            accept=".json"
            showUploadList={false}
            beforeUpload={handleLoad}
          >
            <Button icon={<UploadOutlined />} />
          </Upload>
        </Tooltip>
        <Tooltip title="从系统加载">
          <Button icon={<CloudDownloadOutlined />} onClick={handleLoadFromSystem} />
        </Tooltip>
        <Tooltip title="撤销">
          <Button icon={<UndoOutlined />} onClick={handleUndo} />
        </Tooltip>
        <Tooltip title="重做">
          <Button icon={<RedoOutlined />} onClick={handleRedo} />
        </Tooltip>
        <Tooltip title="删除">
          <Button icon={<DeleteOutlined />} onClick={handleDelete} />
        </Tooltip>
        <Tooltip title="复制">
          <Button icon={<CopyOutlined />} onClick={handleCopy} />
        </Tooltip>
        <Tooltip title="剪切">
          <Button icon={<ScissorOutlined />} onClick={handleCut} />
        </Tooltip>
        <Tooltip title="粘贴">
          <Button icon={<SnippetsOutlined />} onClick={handlePaste} />
        </Tooltip>
        <Tooltip title="放大">
          <Button icon={<ZoomInOutlined />} onClick={handleZoomIn} />
        </Tooltip>
        <Tooltip title="缩小">
          <Button icon={<ZoomOutOutlined />} onClick={handleZoomOut} />
        </Tooltip>
      </Space>
      <Modal
        open={open}
        onCancel={handleCancel}
        onOk={handleOk}
        title="从系统加载"
        width={600}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Tree
              loadData={(node) => {
                const { key, children } = node;
                if (children) {
                  return Promise.resolve(children);
                }
                return fetch(`/api/files/tree/${key}`)
                  .then(response => response.json())
                  .then(data => {
                    return data.map(item => ({
                      key: item.id,
                      title: item.name,
                      isLeaf: item.children.length === 0,
                    }));
                  });
              }}
              onSelect={handleSelectFile}
              treeData={files}
            />
          </Col>
          <Col span={16}>
            {selectedFile && (
              <div>
                <h3>{selectedFile.name}</h3>
                <p>{selectedFile.description}</p>
              </div>
            )}
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default Toolbar;
