import React, { useState, useEffect } from 'react';
import { Form, Input, Card, Select, InputNumber, ColorPicker, Button } from 'antd';
import FunctionConfigDrawer from './FunctionConfigDrawer';
import './styles.css';

const { Option } = Select;

const PropertyPanel = ({ graph }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [form] = Form.useForm();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    if (!graph) return;

    const updateSelection = () => {
      const cells = graph.getSelectedCells();
      if (cells.length === 1) {
        const cell = cells[0];
        setSelectedCell(cell);
        // 获取节点的当前属性
        const label = cell.prop('attrs').text?.text || '';
        const stroke = cell.prop('attrs').body?.stroke || '#5F95FF';
        const fill = cell.prop('attrs').body?.fill || '#EFF4FF';
        const fontSize = cell.prop('attrs').text?.fontSize || 12;
        const { width, height } = cell.size();

        form.setFieldsValue({
          label,
          stroke,
          fill,
          fontSize,
          width,
          height,
        });
      } else {
        setSelectedCell(null);
        form.resetFields();
      }
    };

    graph.on('cell:selected', updateSelection);

    return () => {
      graph.off('cell:selected', updateSelection);
    };
  }, [graph, form]);

  const handleValuesChange = (changedValues) => {
    if (!selectedCell) return;

    const updates = {};
    if ('label' in changedValues) {
      updates['text'] = { text: changedValues.label };
    }
    if ('stroke' in changedValues) {
      updates['body'] = { ...updates['body'], stroke: changedValues.stroke };
    }
    if ('fill' in changedValues) {
      updates['body'] = { ...updates['body'], fill: changedValues.fill };
    }
    if ('fontSize' in changedValues) {
      updates['text'] = { ...updates['text'], fontSize: changedValues.fontSize };
    }

    // 更新大小
    if ('width' in changedValues || 'height' in changedValues) {
      const { width, height } = form.getFieldsValue(['width', 'height']);
      selectedCell.resize(width, height);
    }

    // 更新属性
    if (Object.keys(updates).length > 0) {
      selectedCell.prop('attrs', {
        ...selectedCell.prop('attrs'),
        ...updates
      });
    }
  };

  const handleUpdate = () => {
    // Add your update logic here
  };

  if (!selectedCell) {
    return (
      <div className="property-panel">
        <Card title="属性面板" bordered={false}>
          <p>请选择一个节点</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="property-panel">
      <Card title="属性面板" style={{ marginBottom: 16 }}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
        >
          <Form.Item label="节点名称" name="label">
            <Input placeholder="请输入节点名称" />
          </Form.Item>
          <Form.Item label="边框颜色" name="stroke">
            <ColorPicker placeholder="选择边框颜色" />
          </Form.Item>
          <Form.Item label="填充颜色" name="fill">
            <ColorPicker placeholder="选择填充颜色" />
          </Form.Item>
          <Form.Item label="字体大小" name="fontSize">
            <InputNumber min={8} max={24} placeholder="选择字体大小" />
          </Form.Item>
          <Form.Item label="宽度" name="width">
            <InputNumber min={0} placeholder="输入宽度" />
          </Form.Item>
          <Form.Item label="高度" name="height">
            <InputNumber min={0} placeholder="输入高度" />
          </Form.Item>
          {selectedCell && selectedCell.prop('attrs').text?.text === '功能' && (
            <Form.Item>
              <Button type="primary" onClick={showDrawer}>配置功能</Button>
            </Form.Item>
          )}
        </Form>
      </Card>
      <FunctionConfigDrawer visible={drawerVisible} onClose={onClose} nodeData={form.getFieldsValue()} onUpdate={handleUpdate} />
    </div>
  );
};

export default PropertyPanel;
