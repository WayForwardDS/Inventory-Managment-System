import {
  AntDesignOutlined,
  DatabaseOutlined,
  InboxOutlined,
  MoneyCollectFilled,
  ProfileFilled,
  UserOutlined,
} from '@ant-design/icons';
import React from 'react';
import { NavLink } from 'react-router-dom';

export const sidebarItems = [
  {
    key: 'Dashboard',
    label: <NavLink to='/'>DASHBOARD</NavLink>,
    icon: React.createElement(ProfileFilled),
    restriction: ['SuperAdmin','Manager', 'Stock-Manager', 'Mixture']
  },
  {
    key: 'Create New Order',
    label: <NavLink to='/create-order'>CREATE NEW ORDER</NavLink>,
    icon: React.createElement(AntDesignOutlined),
    restriction: ['SuperAdmin','Manager']
  },
  {
    key: 'Orders Request',
    label: <NavLink to='/orders-request'>ORDERS REQUEST</NavLink>,
    icon: React.createElement(AntDesignOutlined),
    restriction: ['SuperAdmin', 'Manager','Stock-Manager', 'Mixture']
  },
  {
    key: 'Orders History',
    label: <NavLink to='/orders-history'>ORDERS HISTORY</NavLink>,
    icon: React.createElement(AntDesignOutlined),
    restriction: ['SuperAdmin', 'Manager' ,'Stock-Manager', 'Mixture']
  },

  {
    key: 'Manage Products',
    label: <NavLink to='/products'>MANAGE PRODUCTS</NavLink>,
    icon: React.createElement(MoneyCollectFilled),
    restriction: ['SuperAdmin','Manager']
  },
  {
    key: 'Manage Chemicals',
    label: <NavLink to='/manage-chemicals'>MANAGE CHEMICALS</NavLink>,
    icon: React.createElement(MoneyCollectFilled),
    restriction: ['SuperAdmin','Manager', 'Stock-Manager']
  },
  {
    key: 'Warehouse Management',
    label: 'WAREHOUSE MANAGEMENT',
    icon: React.createElement(AntDesignOutlined),
    restriction: ['SuperAdmin', 'Manager', 'Stock-Manager'],
    children: [
      {
        key: 'RackView',
        label: <NavLink to='/warehouse-management'>Rack View</NavLink>,
        icon: <InboxOutlined />,
      },
      {
        key: 'StockTable',
        label: <NavLink to='/warehouse-management/stock-table'>Stock Table</NavLink>,
        icon: <DatabaseOutlined />,
      },
      {
        key: 'WarehouseInventory',
        label: <NavLink to="/warehouse-management/inventory">Complete Inventory</NavLink>,
        icon: <DatabaseOutlined />,
      }
    ],
  },
  
  {
    key: 'Create New User',
    label: <NavLink to='/register'>Create New User</NavLink>,
    icon: React.createElement(UserOutlined),
    restriction: ['SuperAdmin']
  },
  {
    key: 'Profile',
    label: <NavLink to='/profile'>PROFILE</NavLink>,
    icon: React.createElement(UserOutlined),
  },

];
