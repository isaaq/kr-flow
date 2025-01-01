import React, { useRef, useEffect } from 'react';
import { Drawer } from 'antd';
import { Graph } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Stencil } from '@antv/x6-plugin-stencil';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { History } from '@antv/x6-plugin-history';
import { ReactShape } from '@antv/x6-react-shape';

const FunctionConfigDrawer = ({ visible, onClose, setIsDrawerVisible }) => {
  const containerRef = useRef(null);
  const stencilContainerRef = useRef(null);
  const graphRef = useRef(null);
  const stencilRef = useRef(null);

  // 创建功能节点的函数
  const createFunctionNode = (pos, type) => {
    const isCondition = type === 'condition';
    const baseConfig = {
      shape: 'rect',
      width: 180,
      height: isCondition ? 100 : 80,
      position: pos,
      attrs: {
        body: {
          fill: '#fff',
          stroke: isCondition ? '#FF9966' : '#5F95FF',
          strokeWidth: 1,
          rx: 4,
          ry: 4,
        },
        label: {
          text: isCondition ? '条件节点' : '功能节点',
          fill: '#333',
          fontSize: 14,
          fontWeight: 'bold',
          refX: 0.5,
          refY: 20,
          textAnchor: 'middle',
        },
      },
      ports: {
        groups: {
          in: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                fill: '#fff',
                strokeWidth: 1,
              },
            },
          },
          out: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#5F95FF',
                fill: '#fff',
                strokeWidth: 1,
              },
            },
            label: {position: 'outside'}
          },
        },
        items: isCondition ? [
          { group: 'out', id: 'out', attrs: { text: { text: '输出' } } },
        ] : [
          { group: 'in', id: 'condition', attrs: { text: { text: '条件' } } },
          { group: 'in', id: 'logic', attrs: { text: { text: '逻辑' } } },
          { group: 'in', id: 'format', attrs: { text: { text: '输出格式' } } },
          { group: 'out', id: 'out', attrs: { text: { text: '输出' } } },
        ],
      },
    };

    if (type === 'function') {
      baseConfig.attrs.button = {
        text: '配置',
        fill: '#333',
        fontSize: 12,
        refX: 0.5,
        refY: 45,
        textAnchor: 'middle',
        cursor: 'pointer',
      };
    }

    return baseConfig;
  };

  useEffect(() => {
    if (!visible || !containerRef.current || !stencilContainerRef.current) {
      return;
    }

    // 定义基类节点
    const BaseNode = {
      inherit: 'rect',
      width: 180,
      markup: [
        {
          tagName: 'rect',
          selector: 'body',
        },
        {
          tagName: 'foreignObject',
          selector: 'fo',
        }
      ],
      attrs: {
        body: {
          fill: '#fff',
          strokeWidth: 1,
          rx: 4,
          ry: 4,
        },
      },
      ports: {
        groups: {
          in: {
            position: 'left',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                fill: '#fff',
                strokeWidth: 1,
              },
            },
            label: { position: 'outside' }
          },
          out: {
            position: 'right',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                fill: '#fff',
                strokeWidth: 1,
              },
            },
            label: { position: 'outside' }
          },
        },
      },
    };

    // 定义逻辑节点
    const LogicNode = {
      ...BaseNode,
      height: 130,
      attrs: {
        body: {
          ...BaseNode.attrs.body,
          stroke: '#5F95FF',
        },
        fo: {
          refWidth: '100%',
          refHeight: '100%',
          html: `
            <div style="width: 100%; height: 100%; padding: 8px; box-sizing: border-box;">
              <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 8px; text-align: center;">
                逻辑节点
              </div>
              <input type="text" style="width: 100%; margin-bottom: 8px; padding: 4px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" />
              <button style="width: 100%; background: #5F95FF; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">
                打开全屏
              </button>
            </div>
          `
        }
      },
      ports: {
        groups: {
          in: {
            ...BaseNode.ports.groups.in,
            attrs: {
              circle: {
                ...BaseNode.ports.groups.in.attrs.circle,
                stroke: '#5F95FF',
              },
            },
          },
          out: {
            ...BaseNode.ports.groups.out,
            attrs: {
              circle: {
                ...BaseNode.ports.groups.out.attrs.circle,
                stroke: '#5F95FF',
              },
            },
          },
        },
        items: [
          { group: 'in', id: 'in', attrs: { text: { text: '输入' } } },
          { group: 'out', id: 'out', attrs: { text: { text: '输出' } } },
        ],
      },
    };

    // 定义条件节点
    const ConditionNode = {
      ...BaseNode,
      height: 100,
      attrs: {
        body: {
          ...BaseNode.attrs.body,
          stroke: '#FF9966',
        },
      },
      ports: {
        groups: {
          in: {
            ...BaseNode.ports.groups.in,
            attrs: {
              circle: {
                ...BaseNode.ports.groups.in.attrs.circle,
                stroke: '#FF9966',
              },
            },
          },
          out: {
            ...BaseNode.ports.groups.out,
            attrs: {
              circle: {
                ...BaseNode.ports.groups.out.attrs.circle,
                stroke: '#FF9966',
              },
            },
          },
        },
        items: [
          { group: 'in', id: 'in', attrs: { text: { text: '输入' } } },
          { group: 'out', id: 'out1', attrs: { text: { text: '输出1' } } },
          { group: 'out', id: 'out2', attrs: { text: { text: '输出2' } } },
        ],
      },
    };

    // 注册节点
    Graph.registerNode('logic-node', LogicNode, true);
    Graph.registerNode('condition-node', ConditionNode, true);

    // 创建图形实例
    const graph = new Graph({
      container: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      grid: true,
      history: true,
      snapline: true,
      keyboard: true,
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        highlight: true,
        connector: 'smooth',
        connectionPoint: 'boundary',
        router: 'normal',
      },
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
      },
      scaling: {
        min: 0.5,
        max: 2,
      },
      panning: true,
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      interacting: {
        nodeMovable: true,
        edgeMovable: true,
        edgeLabelMovable: false,
        magnetConnectable: true,
        stopDelegateOnDragging: false,
      },
    });

    graphRef.current = graph;

    // 注册插件
    graph.use(new Dnd());
    graph.use(new History());
    graph.use(new Snapline());
    graph.use(new Keyboard());
    graph.use(new ReactShape());

    // 确保setIsDrawerVisible可以在全局访问
    window.setLogicDrawerVisible = setIsDrawerVisible;

    // 加载基础节点到 Stencil
    const basicNodes = [
      {
        shape: 'rect',
        width: 160,
        height: 32,
        attrs: {
          body: {
            fill: '#fafafa',
            stroke: '#d9d9d9',
            strokeWidth: 1,
            rx: 4,
            ry: 4,
          },
          label: {
            text: '⚡ 功能节点',
            fill: '#666',
            fontSize: 12,
            fontWeight: 400,
            refX: 52,
            refY: 16,
          },
        },
      },
      {
        shape: 'rect',
        width: 160,
        height: 32,
        attrs: {
          body: {
            fill: '#fafafa',
            stroke: '#d9d9d9',
            strokeWidth: 1,
            rx: 4,
            ry: 4,
          },
          label: {
            text: '🔶 条件节点',
            fill: '#666',
            fontSize: 12,
            fontWeight: 400,
            refX: 52,
            refY: 16,
          },
        },
      },
      {
        shape: 'rect',
        width: 160,
        height: 32,
        attrs: {
          body: {
            fill: '#fafafa',
            stroke: '#d9d9d9',
            strokeWidth: 1,
            rx: 4,
            ry: 4,
          },
          label: {
            text: '🔷 逻辑节点',
            fill: '#666',
            fontSize: 12,
            fontWeight: 400,
            refX: 52,
            refY: 16,
          },
        },
      },
    ];

    // 初始化 Stencil
    const stencil = new Stencil({
      title: '节点类型',
      target: graph,
      search: true,
      collapsable: true,
      stencilGraphWidth: 200,
      stencilGraphHeight: 300,
      groups: [
        {
          name: 'basic',
          title: '基础节点',
          collapsable: false,
          layoutOptions: {
            columns: 1,
            marginX: 30,
            marginY: 0,
          },
        },
      ],
      layoutOptions: {
        columns: 1,
        marginX: 30,
        marginY: 2,
        rowHeight: 50,
      },
    });

    stencilRef.current = stencil;
    stencilContainerRef.current.appendChild(stencil.container);

    // 加载所有节点到 Stencil
    stencil.load(basicNodes, 'basic');

    // 创建默认功能节点
    const defaultNode = createFunctionNode({ x: 100, y: 100 }, 'function');
    graph.addNode(defaultNode);

    // 注册节点拖拽事件
    graph.on('node:added', ({ node }) => {
      // 检查节点是否来自工具栏
      if (node.attr('body/fill') === '#fafafa') {
        // 如果是从工具栏拖入的节点，替换为完整的功能节点
        const pos = node.getPosition();
        const nodeType = node.attr('label/text').includes('条件') ? 'condition' : 
                        node.attr('label/text').includes('逻辑') ? 'logic' : 'function';
        graph.removeNode(node);
        if (nodeType === 'logic') {
          const newNode = graph.createNode({
            shape: 'logic-node',
            width: 180,
            height: 130, // 修改高度
            ports: {
              groups: {
                in: {
                  position: 'left',
                  attrs: {
                    circle: {
                      r: 4,
                      magnet: true,
                      stroke: '#5F95FF',
                      fill: '#fff',
                      strokeWidth: 1,
                    },
                  },
                },
                out: {
                  position: 'right',
                  attrs: {
                    circle: {
                      r: 4,
                      magnet: true,
                      stroke: '#5F95FF',
                      fill: '#fff',
                      strokeWidth: 1,
                    },
                  },
                },
              },
              items: [
                { group: 'in', id: 'in', attrs: { text: { text: '输入' } } },
                { group: 'out', id: 'out', attrs: { text: { text: '输出' } } },
              ],
            },
          });
          newNode.position(pos.x, pos.y);
          graph.addNode(newNode);
        } else {
          const config = createFunctionNode(pos, nodeType);
          if (config) {
            graph.addNode(config);
          }
        }
      }
    });

    // 监听节点点击事件
    graph.on('node:click', ({ node, view }) => {
      const button = view.findOne('foreignObject').querySelector('button');
      if (button) {
        const nodeId = button.getAttribute('data-node-id');
        if (nodeId === node.id) {
          setIsDrawerVisible(true);
        }
      }
    });

    // 添加右键菜单
    graph.on('node:contextmenu', ({ cell, e }) => {
      e.preventDefault();
      const menu = document.createElement('div');
      menu.className = 'context-menu';
      menu.style.position = 'fixed';
      menu.style.left = `${e.clientX}px`;
      menu.style.top = `${e.clientY}px`;
      menu.style.backgroundColor = '#fff';
      menu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
      menu.style.padding = '8px 0';
      menu.style.borderRadius = '4px';
      menu.style.zIndex = '1000';

      const menuItems = [
        { text: '复制', action: () => graph.copy([cell]) },
        { text: '删除', action: () => cell.remove() },
        { text: '清空连线', action: () => {
          const edges = graph.getConnectedEdges(cell);
          edges.forEach(edge => edge.remove());
        }},
      ];

      menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.innerText = item.text;
        menuItem.style.padding = '4px 16px';
        menuItem.style.cursor = 'pointer';
        menuItem.style.fontSize = '14px';
        menuItem.style.color = '#595959';
        menuItem.onmouseover = () => {
          menuItem.style.backgroundColor = '#f5f5f5';
        };
        menuItem.onmouseout = () => {
          menuItem.style.backgroundColor = 'transparent';
        };
        menuItem.onclick = () => {
          item.action();
          document.body.removeChild(menu);
        };
        menu.appendChild(menuItem);
      });

      document.body.appendChild(menu);

      const removeMenu = (e) => {
        if (!menu.contains(e.target)) {
          document.body.removeChild(menu);
          document.removeEventListener('click', removeMenu);
        }
      };

      document.addEventListener('click', removeMenu);
    });

    // 添加工具栏
    const toolbar = document.createElement('div');
    toolbar.style.position = 'absolute';
    toolbar.style.top = '20px';
    toolbar.style.left = '50%';
    toolbar.style.transform = 'translateX(-50%)';
    toolbar.style.display = 'flex';
    toolbar.style.gap = '8px';
    toolbar.style.padding = '8px';
    toolbar.style.backgroundColor = '#fff';
    toolbar.style.borderRadius = '4px';
    toolbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    toolbar.style.zIndex = '999';

    const tools = [
      { icon: '⟲', title: '撤销', action: () => graph.undo() },
      { icon: '⟳', title: '重做', action: () => graph.redo() },
      { icon: '📋', title: '复制', action: () => graph.copy(graph.getSelectedCells()) },
      { icon: '📄', title: '粘贴', action: () => graph.paste() },
      { icon: '🗑', title: '删除', action: () => graph.removeCells(graph.getSelectedCells()) },
    ];

    tools.forEach(tool => {
      const button = document.createElement('button');
      button.innerHTML = tool.icon;
      button.title = tool.title;
      button.style.width = '32px';
      button.style.height = '32px';
      button.style.border = '1px solid #d9d9d9';
      button.style.borderRadius = '4px';
      button.style.backgroundColor = '#fff';
      button.style.cursor = 'pointer';
      button.style.fontSize = '16px';
      button.style.display = 'flex';
      button.style.alignItems = 'center';
      button.style.justifyContent = 'center';
      button.onmouseover = () => {
        button.style.borderColor = '#40a9ff';
        button.style.color = '#40a9ff';
      };
      button.onmouseout = () => {
        button.style.borderColor = '#d9d9d9';
        button.style.color = '#000';
      };
      button.onclick = tool.action;
      toolbar.appendChild(button);
    });

    containerRef.current.appendChild(toolbar);

    // 快捷键
    graph.bindKey(['meta+c', 'ctrl+c'], () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.copy(cells);
      }
      return false;
    });

    graph.bindKey(['meta+v', 'ctrl+v'], () => {
      if (!graph.isClipboardEmpty()) {
        const cells = graph.paste({ offset: 32 });
        graph.cleanSelection();
        graph.select(cells);
      }
      return false;
    });

    graph.bindKey(['meta+z', 'ctrl+z'], () => {
      if (graph.canUndo()) {
        graph.undo();
      }
      return false;
    });

    graph.bindKey(['meta+shift+z', 'ctrl+shift+z'], () => {
      if (graph.canRedo()) {
        graph.redo();
      }
      return false;
    });

    graph.bindKey(['backspace', 'delete'], () => {
      const cells = graph.getSelectedCells();
      if (cells.length) {
        graph.removeCells(cells);
      }
    });

    return () => {
      if (stencilRef.current && stencilRef.current.container && stencilRef.current.container.parentNode) {
        stencilRef.current.container.parentNode.removeChild(stencilRef.current.container);
      }
      if (graphRef.current) {
        graphRef.current.dispose();
      }
    };
  }, [visible, setIsDrawerVisible]);

  return (
    <Drawer
      title="功能配置"
      placement="right"
      width="100%"
      onClose={onClose}
      open={visible}
    >
      <div style={{ 
        display: 'flex', 
        width: '100%', 
        height: 'calc(100vh - 110px)',
      }}>
        <div
          ref={stencilContainerRef}
          style={{
            width: '200px',
            height: '100%',
            borderRight: '1px solid #d9d9d9',
            background: '#fafafa',
          }}
        />
        <div 
          ref={containerRef} 
          style={{ 
            flex: 1,
            height: '100%',
            background: '#fff',
            border: '1px solid #d9d9d9',
            borderRadius: '4px',
          }}
        />
      </div>
    </Drawer>
  );
};

export default FunctionConfigDrawer;
