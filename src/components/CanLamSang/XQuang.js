import React, { useEffect, useState } from 'react';
import { Button, Input, Select, DatePicker, Tabs, Table, Modal, Image, Spin } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
const { TabPane } = Tabs;

const columns = [
    { title: 'Mã bệnh nhân', dataIndex: 'id_patient', key: 'id_patient' },
    { title: 'Họ tên', dataIndex: 'full_name', key: 'full_name' },
    {
        title: 'Ngày sinh',
        dataIndex: 'dob',
        key: 'dob',
        render: dob => dob ? dayjs(dob).format('DD/MM/YYYY') : ''
    },
    { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
    { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    {
        title: 'Thao tác',
        key: 'thaoTac',
        render: (_, record) => (
            <Button onClick={() => record.onViewImages(record.id_patient)}>Xem ảnh</Button>
        ),
    },
];

export default function NoiSoi() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [images, setImages] = useState([]);
    const [imageLoading, setImageLoading] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchId, setSearchId] = useState('');
    // Lấy danh sách bệnh nhân
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = () => {
        setLoading(true);
        axios.get('https://telehis.hoangphucthanh.vn:4001/telemed/patients')
            .then(res => {
                const tableData = res.data.map((item, idx) => ({
                    ...item,
                    key: idx,
                    onViewImages: handleViewImages,
                }));
                setData(tableData);
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    };

    // Tìm kiếm theo mã bệnh nhân
    const handleSearch = () => {
        setLoading(true);
        axios.get('https://telehis.hoangphucthanh.vn:4001/telemed/patients')
            .then(res => {
                let tableData = res.data.map((item, idx) => ({
                    ...item,
                    key: idx,
                    onViewImages: handleViewImages,
                }));
                if (searchId) {
                    tableData = tableData.filter(item => item.id_patient === searchId);
                }
                setData(tableData);
            })
            .catch(() => setData([]))
            .finally(() => setLoading(false));
    };

    // Xem ảnh của bệnh nhân
    const handleViewImages = (id_patient) => {
        setImageLoading(true);
        setSelectedPatient(id_patient);
        axios.get(`https://telehis.hoangphucthanh.vn:4001/telemed/images/patient/${id_patient}`)
            .then(res => {
                const arr = Array.isArray(res.data) ? res.data : [];
                setImages(arr);
                setImageModal(true);
            })
            .catch(() => setImages([]))
            .finally(() => setImageLoading(false));
    };

    return (
        <div style={{ background: '#f5f6fa', padding: 24 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>NỘI SOI</h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                <div>
                    <span>Từ ngày&nbsp;</span>
                    <DatePicker style={{ width: 120 }} />
                </div>
                <div>
                    <span>Đến ngày&nbsp;</span>
                    <DatePicker style={{ width: 120 }} />
                </div>
                <div>
                    <span>Phòng khám&nbsp;</span>
                    <Select placeholder="Chọn..." style={{ width: 120 }} />
                </div>
                <div>
                    <span>Từ khóa tìm kiếm (F3)&nbsp;</span>
                    <Input placeholder="Nhập từ khóa tìm kiếm ..." style={{ width: 180 }} />
                </div>
                <div>
                    <span>Mã bệnh nhân&nbsp;</span>
                    <Input
                        placeholder="Nhập mã bệnh nhân"
                        style={{ width: 120 }}
                        value={searchId}
                        onChange={e => setSearchId(e.target.value)}
                    />
                </div>
                <Button
                    type="primary"
                    style={{ background: '#43b02a', border: 'none' }}
                    onClick={handleSearch}
                >
                    Tìm kiếm
                </Button>
                <Button onClick={fetchPatients}>
                    <span role="img" aria-label="reload">🔄</span>
                </Button>
            </div>
            <Tabs defaultActiveKey="1" style={{ marginBottom: 0 }}>
                <TabPane tab="Danh sách" key="1" />
                <TabPane tab="Chờ thực hiện" key="2" />
                <TabPane tab="Đang thực hiện" key="3" />
                <TabPane tab="Đã thực hiện" key="4" />
                <TabPane tab="Đã hủy" key="5" />
            </Tabs>
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
                style={{ marginTop: 0 }}
                locale={{
                    emptyText: (
                        <div style={{ textAlign: 'center', padding: 40 }}>
                            <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="empty" width={60} />
                            <div style={{ marginTop: 8 }}>Không có dữ liệu</div>
                        </div>
                    ),
                }}
                scroll={{ x: true }}
            />
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button type="default" style={{ background: '#ff9800', color: '#fff', border: 'none' }}>Màn hình chờ</Button>
                <Button type="primary" style={{ background: '#2196f3', border: 'none' }}>Xuất Excel</Button>
            </div>
            <Modal
                title={`Ảnh y tế bệnh nhân ${selectedPatient}`}
                open={imageModal}
                onCancel={() => setImageModal(false)}
                footer={null}
                width={800}
            >
                {imageLoading ? (
                    <Spin />
                ) : images.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="empty" width={60} />
                        <div style={{ marginTop: 8 }}>Không có ảnh y tế</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        {images.map((img, idx) => (
                            <div key={idx} style={{ textAlign: 'center' }}>
                                <Image
                                    src={`data:image/jpeg;base64,${img.base64}`}
                                    alt={img.description || img.filename}
                                    width={180}
                                    style={{ marginBottom: 8 }}
                                />
                                <div>{img.image_type}</div>
                                <div>{img.description}</div>
                                <div>{img.taken_at}</div>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </div>
    );
}