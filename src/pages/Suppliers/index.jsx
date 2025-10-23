import React, { useState } from 'react';
import { Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import SuppliersTable from '../../components/Suppliers/SuppliersTable';
import AddSupplier from '../../components/Suppliers/AddSupplier';

const Suppliers = () => {
  const [selectedKey, setSelectedKey] = useState('supplier_list');

  const menuItems = [
    {
      key: 'supplier',
      label: 'Nhà Cung Cấp',
      icon: <DownOutlined />,
      children: [
        {
          key: 'supplier_list',
          label: 'Danh sách nhà cung cấp'
        },
        {
          key: 'add_supplier',
          label: 'Thêm nhà cung cấp mới'
        }
      ]
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      {/* Top menu */}
      <div style={{ 
        backgroundColor: '#fff',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <Menu
          mode="horizontal"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
          style={{ 
            borderRadius: '8px',
            fontSize: '16px'
          }}
          triggerSubMenuAction="hover"
        />
      </div>

      {/* Content area */}
      <div style={{ backgroundColor: '#f5f5f5' }}>
        {selectedKey === 'supplier_list' && <SuppliersTable isNewSuppliers={false} />}
        {selectedKey === 'add_supplier' && <AddSupplier />}
      </div>
    </div>
  );
};

export default Suppliers; 