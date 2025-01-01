import React, { useEffect, useRef, useState } from 'react';
import { Graph } from '@antv/x6';
import { Transform } from '@antv/x6-plugin-transform';
import { Selection } from '@antv/x6-plugin-selection';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Keyboard } from '@antv/x6-plugin-keyboard';
import { Clipboard } from '@antv/x6-plugin-clipboard';
import { History } from '@antv/x6-plugin-history';
import insertCss from 'insert-css';
import Toolbar from './components/Toolbar';
import PropertyPanel from './components/PropertyPanel';
import BottomPanel from './components/BottomPanel';
import LeftPanel from './components/LeftPanel';
import 'antd/dist/reset.css';

// Add styles
const styles = `
  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
  }
  .content {
    flex: 1;
    display: flex;
    height: calc(100% - 40px);
    position: relative;
    overflow: hidden;
  }
  .graph-container {
    flex: 1;
    height: 100%;
    margin: 0;
    overflow: hidden;
    position: relative;
  }
  .x6-widget-transform {
    margin: -1px 0 0 -1px;
    padding: 0px;
    border: 1px solid #239edd;
  }
  .x6-widget-transform > div {
    border: 1px solid #239edd;
  }
  .x6-widget-transform > div:hover {
    background-color: #3dafe4;
  }
  .x6-widget-transform-active-handle {
    background-color: #3dafe4;
  }
  .x6-widget-transform-resize {
    border-radius: 0;
  }
  .x6-widget-selection-inner {
    border: 1px solid #239edd;
  }
  .x6-widget-selection-box {
    border: 1px solid #239edd;
  }
`;

const App = () => {
  const graphRef = useRef(null);
  const [graph, setGraph] = useState(null);

  useEffect(() => {
    // Insert styles
    insertCss(styles);

    if (!graphRef.current) return;

    // Initialize graph
    const graph = new Graph({
      container: graphRef.current,
      grid: true,
      mousewheel: {
        enabled: true,
        zoomAtMousePosition: true,
        modifiers: 'ctrl',
        minScale: 0.5,
        maxScale: 3,
      },
      connecting: {
        router: 'manhattan',
        connector: {
          name: 'rounded',
          args: {
            radius: 8,
          },
        },
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        snap: {
          radius: 20,
        },
        createEdge() {
          return graph.createEdge({
            attrs: {
              line: {
                stroke: '#A2B1C3',
                strokeWidth: 2,
                targetMarker: {
                  name: 'block',
                  width: 12,
                  height: 8,
                },
              },
            },
            zIndex: 0,
          });
        },
        validateConnection({ targetMagnet }) {
          return !!targetMagnet;
        },
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#5F95FF',
              stroke: '#5F95FF',
            },
          },
        },
      },
    });

    // Use plugins
    graph
      .use(
        new Transform({
          resizing: true,
          rotating: true,
        }),
      )
      .use(
        new Selection({
          rubberband: true,
          showNodeSelectionBox: true,
        }),
      )
      .use(new Snapline())
      .use(new Keyboard())
      .use(new Clipboard())
      .use(new History());

    // Port visibility control
    const showPorts = (ports, show) => {
      for (let i = 0, len = ports.length; i < len; i += 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden';
      }
    };

    graph.on('node:mouseenter', () => {
      const ports = graphRef.current.querySelectorAll('.x6-port-body');
      showPorts(ports, true);
    });

    graph.on('node:mouseleave', () => {
      const ports = graphRef.current.querySelectorAll('.x6-port-body');
      showPorts(ports, false);
    });

    setGraph(graph);

    return () => {
      graph.dispose();
    };
  }, []);

  return (
    <div className="app">
      <Toolbar graph={graph} />
      <div className="content">
        <LeftPanel graph={graph} />
        <div className="graph-container" ref={graphRef}></div>
        <PropertyPanel graph={graph} />
      </div>
      <BottomPanel />
    </div>
  );
};

export default App;
