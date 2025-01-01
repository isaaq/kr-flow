import React, { useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil';
import { ports } from './ports';
import shapesData from './shapesData.json';
import './styles.css';

const LeftPanel = ({ graph }) => {
  const stencilRef = useRef(null);

  useEffect(() => {
    if (!graph || !stencilRef.current) return;

    // 注册自定义节点
    Graph.registerNode(
      'custom-rect',
      {
        inherit: 'rect',
        width: 66,
        height: 36,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
          },
          text: {
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: { ...ports },
      },
      true,
    );

    Graph.registerNode(
      'custom-polygon',
      {
        inherit: 'polygon',
        width: 66,
        height: 36,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
          },
          text: {
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: { ...ports },
      },
      true,
    );

    Graph.registerNode(
      'custom-circle',
      {
        inherit: 'circle',
        width: 45,
        height: 45,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
          },
          text: {
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: { ...ports },
      },
      true,
    );

    Graph.registerNode(
      'custom-image',
      {
        inherit: 'rect',
        width: 52,
        height: 52,
        markup: [
          {
            tagName: 'rect',
            selector: 'body',
          },
          {
            tagName: 'image',
          },
          {
            tagName: 'text',
            selector: 'label',
          },
        ],
        attrs: {
          body: {
            stroke: '#5F95FF',
            fill: '#5F95FF',
          },
          image: {
            width: 26,
            height: 26,
            refX: 13,
            refY: 16,
          },
          label: {
            refX: 3,
            refY: 2,
            textAnchor: 'left',
            textVerticalAnchor: 'top',
            fontSize: 12,
            fill: '#fff',
          },
        },
        ports: { ...ports },
      },
      true,
    );

    const stencil = new Stencil({
      title: '流程图',
      target: graph,
      search: false,
      collapsable: false,
      stencilGraphWidth: 200,
      stencilGraphHeight: 280,
      groups: [
        {
          name: 'group1',
          title: '基础流程图',
          collapsable: false,
          graphHeight: 250,
        },
        {
          name: 'group2',
          title: '系统设计图',
          collapsable: false,
          graphHeight: 250,
        },
      ],
      layoutOptions: {
        columns: 2,
        columnWidth: 80,
        rowHeight: 55,
      },
    });

    stencilRef.current.appendChild(stencil.container);

    // 创建基础图形
    const nodes = shapesData.basicShapes.map(nodeData => {
      const node = graph.createNode({
        shape: nodeData.shape,
        width: 66,
        height: nodeData.shape === 'custom-circle' ? 45 : 36,
        attrs: {
          body: {
            strokeWidth: 1,
            stroke: '#5F95FF',
            fill: '#EFF4FF',
            ...nodeData.attrs?.body,
          },
          text: {
            text: nodeData.label,
            fontSize: 12,
            fill: '#262626',
          },
        },
        ports: { ...ports },
      });
      return node;
    });

    // 创建图片节点
    const imageNodes = shapesData.imageShapes.map(nodeData => {
      const node = graph.createNode({
        shape: nodeData.shape,
        label: nodeData.label,
        attrs: {
          image: {
            'xlink:href': nodeData.image,
          },
        },
        ports: { ...ports },
      });
      return node;
    });

    // 加载节点到 stencil
    stencil.load(nodes, 'group1');
    stencil.load(imageNodes, 'group2');

    return () => {
      stencil.destroy();
    };
  }, [graph]);

  return <div className="left-panel" ref={stencilRef} />;
};

export default LeftPanel;
