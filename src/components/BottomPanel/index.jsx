import React, { useState } from 'react';
import { Drawer, Button, Space } from 'antd';
import { UpOutlined } from '@ant-design/icons';
import './styles.css';

const BottomPanel = () => {
  const [visible, setVisible] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const showDrawer = (menu) => {
    setActiveMenu(menu);
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
    setActiveMenu(null);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'A':
        return <div>菜单 A 的内容</div>;
      case 'B':
        return <div>菜单 B 的内容</div>;
      case 'C':
        return <div>菜单 C 的内容</div>;
      case 'D':
        return <div>菜单 D 的内容</div>;
      default:
        return null;
    }
  };

  return (
    <div className="bottom-panel">
      <div className="bottom-buttons">
        <Space size="large">
          <Button 
            type={activeMenu === 'A' ? 'primary' : 'default'}
            onClick={() => showDrawer('A')}
            icon={<UpOutlined />}
          >
            菜单 A
          </Button>
          <Button 
            type={activeMenu === 'B' ? 'primary' : 'default'}
            onClick={() => showDrawer('B')}
            icon={<UpOutlined />}
          >
            菜单 B
          </Button>
          <Button 
            type={activeMenu === 'C' ? 'primary' : 'default'}
            onClick={() => showDrawer('C')}
            icon={<UpOutlined />}
          >
            菜单 C
          </Button>
          <Button 
            type={activeMenu === 'D' ? 'primary' : 'default'}
            onClick={() => showDrawer('D')}
            icon={<UpOutlined />}
          >
            菜单 D
          </Button>
        </Space>
      </div>
      <Drawer
        title={activeMenu ? `菜单 ${activeMenu}` : ''}
        placement="bottom"
        height={300}
        onClose={onClose}
        open={visible}
        className="bottom-drawer"
      >
        {renderContent()}
      </Drawer>
    </div>
  );
};

export default BottomPanel;
