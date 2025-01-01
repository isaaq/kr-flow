import React, { useState, useEffect } from 'react';
import { Form, Input, Card, Select, InputNumber, ColorPicker } from 'antd';
import './styles.css';

const { Option } = Select;

const PropertyPanel = ({ graph }) => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [form] = Form.useForm();

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

    // 立即更新选中状态
    updateSelection();
    
    // 监听选择变化
    graph.on('selection:changed', updateSelection);
    graph.on('cell:change:*', updateSelection);

    return () => {
      graph.off('selection:changed', updateSelection);
      graph.off('cell:change:*', updateSelection);
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
      <Card title="属性面板" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          onValuesChange={handleValuesChange}
        >
          <Form.Item label="标签" name="label">
            <Input />
          </Form.Item>
          <Form.Item label="边框颜色" name="stroke">
            <ColorPicker />
          </Form.Item>
          <Form.Item label="填充颜色" name="fill">
            <ColorPicker />
          </Form.Item>
          <Form.Item label="字体大小" name="fontSize">
            <InputNumber min={8} max={72} />
          </Form.Item>
          <Form.Item label="宽度" name="width">
            <InputNumber min={20} max={500} />
          </Form.Item>
          <Form.Item label="高度" name="height">
            <InputNumber min={20} max={500} />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PropertyPanel;
