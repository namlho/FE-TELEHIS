import React from 'react';
import { Pagination } from 'antd';
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import './css/PaginationControl.css';

const PaginationControl = ({
  currentPage,
  pageSize,
  total,
  onPageChange,
  onSizeChange,
}) => {
  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <LeftOutlined />;
    }
    if (type === 'next') {
      return <RightOutlined />;
    }
    if (type === 'jump-prev') {
      return <DoubleLeftOutlined />;
    }
    if (type === 'jump-next') {
      return <DoubleRightOutlined />;
    }
    return originalElement;
  };

  return (
    <div className="pagination-container">
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={total}
        onChange={onPageChange}
        onShowSizeChange={onSizeChange}
        showSizeChanger
        pageSizeOptions={['10', '20', '50', '100', '500', '1000']}
        showTotal={(total) => `Tổng ${total} dòng`}
        itemRender={itemRender}
      />
    </div>
  );
};

export default PaginationControl;
