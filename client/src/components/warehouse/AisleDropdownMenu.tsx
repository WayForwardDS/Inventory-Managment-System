import React from 'react';
import { Dropdown, Menu, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Aisle } from '../../types/warehouse.type';

interface AisleDropdownMenuProps {
  aisles: Aisle[];
  visible: boolean;
  onVisibleChange: (visible: boolean) => void;
  onSelect: (aisleId: string) => void;
}

export const AisleDropdownMenu: React.FC<AisleDropdownMenuProps> = ({ 
  aisles, 
  visible, 
  onVisibleChange, 
  onSelect 
}) => {
  const menu = (
    <Menu>
      {aisles.map(aisle => (
        <Menu.Item 
          key={aisle.id} 
          onClick={() => {
            onSelect(aisle.id);
            onVisibleChange(false);
          }}
        >
          {aisle.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={['click']}
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <Button type="text" className="ml-2">
        More <DownOutlined />
      </Button>
    </Dropdown>
  );
};