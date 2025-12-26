import { Button, Popover, Table, Tooltip, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

export default function PatientsTable({
  rows, loading, page, pageSize, total,
  onChangePage, onViewImages, onEdit, onDelete,
  onUploadForPatient
}) {
  const columns = [
    { title: "Mã bệnh nhân", dataIndex: "id_patient", key: "id_patient", width: 140 },
    { title: "Họ tên", dataIndex: "full_name", key: "full_name" },
    {
      title: "Ngày sinh", dataIndex: "dob", key: "dob", width: 140,
      render: dob => dob ? dayjs(dob).format("DD/MM/YYYY") : ""
    },  
    { title: "Giới tính", dataIndex: "gender", key: "gender", width: 100 },
    { title: "SĐT", dataIndex: "phone_number", key: "phone_number", width: 140 },
    { title: "Địa chỉ", dataIndex: "address", key: "address" },
    {
      title: "Ngày tạo", dataIndex: "created_at", key: "created_at", width: 180,
      render: d => d ? dayjs(d).format("HH:mm DD/MM/YYYY") : ""
    },
    {
      title: "Thao tác", key: "thaoTac", fixed: "right", width: 220,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Tooltip title="Xem ảnh">
            <Button type="text" icon={<EyeOutlined />} onClick={() => onViewImages(record.id_patient)} />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record)} />
          </Tooltip>
          <Popover
            content={
              <div style={{ width: 260 }}>
                <Upload.Dragger
                  accept="image/*"
                  customRequest={(opt) => onUploadForPatient(opt, record.id_patient)}
                  showUploadList={false}
                  multiple
                >
                  <p className="ant-upload-drag-icon"></p>
                  <p className="ant-upload-text">Kéo thả ảnh để tải lên cho BN {record.id_patient}</p>
                </Upload.Dragger>
              </div>
            }
            title={`Tải ảnh cho ${record.id_patient}`}
            trigger="click"
          >
            <Tooltip title="Tải ảnh">
              <Button type="text" icon={<UploadOutlined />} />
            </Tooltip>
          </Popover>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rows}
      loading={loading}
      pagination={{
        current: page,
        pageSize,
        total,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
      }}
      onChange={onChangePage}
      style={{ marginTop: 0 }}
      locale={{
        emptyText: (
          <div style={{ textAlign: "center", padding: 40 }}>
            <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="empty" width={60} />
            <div style={{ marginTop: 8 }}>Không có dữ liệu</div>
          </div>
        ),
      }}
      scroll={{ x: true }}
    />
  );
}
