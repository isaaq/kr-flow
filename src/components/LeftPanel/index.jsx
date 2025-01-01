import React, { useEffect, useRef } from 'react';
import { Graph, Shape } from '@antv/x6';
import { Stencil } from '@antv/x6-plugin-stencil';
import { ports } from './ports';
import shapesData from './shapesData.json';
import './styles.css';

const LeftPanel = ({ graph }) => {
  const stencilRef = useRef(null);

  useEffect(() => {
    if (!stencilRef.current || !graph) return;

    const stencil = new Stencil({
      title: '流程图',
      target: graph,
      stencilGraphWidth: 200,
      stencilGraphHeight: 180,
      collapsable: true,
      groups: [
        {
          title: '基础流程图',
          name: 'group1',
        },
        {
          title: '系统设计图',
          name: 'group2',
          graphHeight: 250,
          layoutOptions: {
            rowHeight: 70,
          },
        },
      ],
      layoutOptions: {
        columns: 2,
        columnWidth: 80,
        rowHeight: 55,
      },
    });

    stencilRef.current.appendChild(stencil.container);

    // 注册自定义事件处理
    const stencilContainer = stencilRef.current;
    const graphContainer = graph.container;

    let isDragging = false;

    stencilContainer.addEventListener('mousedown', () => {
      isDragging = true;
    });

    graphContainer.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        // 强制结束拖拽
        stencil.container.dispatchEvent(new MouseEvent('mouseup'));
        graph.container.dispatchEvent(new MouseEvent('mouseup'));
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        // 强制结束拖拽
        stencil.container.dispatchEvent(new MouseEvent('mouseup'));
        graph.container.dispatchEvent(new MouseEvent('mouseup'));
      }
    });

    // Register custom nodes
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

    // Load basic shapes
    const nodes = shapesData.basicShapes.map(item => {
      const node = graph.createNode({
        ...item,
        attrs: {
          ...item.attrs,
          image: item.image ? {
            'xlink:href': item.image,
          } : undefined,
        },
      });
      return node;
    });
    stencil.load(nodes, 'group1');

    // Load image shapes
    const imageNodes = shapesData.imageShapes.map(item => {
      const node = graph.createNode({
        shape: item.shape,
        label: item.label,
        attrs: {
          image: {
            'xlink:href': item.image,
          },
        },
      });
      return node;
    });
    stencil.load(imageNodes, 'group2');

    return () => {
      stencilContainer.removeEventListener('mousedown', () => {});
      graphContainer.removeEventListener('mouseup', () => {});
      document.removeEventListener('mouseup', () => {});
      stencil.dispose();
    };
  }, [graph]);

  return <div className="stencil" ref={stencilRef}></div>;
};

export default LeftPanel;
