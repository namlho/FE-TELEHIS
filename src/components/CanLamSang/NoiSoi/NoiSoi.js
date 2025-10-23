import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './NoiSoi.css';
import { Button, Input, Select, DatePicker, Tabs, Table, Modal, Image, Spin, message, Form, Upload, Popover, Tooltip } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

const { TabPane } = Tabs;

const BASE_URL = 'https://telehis.hoangphucthanh.vn:4001/telemed';
const DISEASE_CODE = 'ENDO'; // Nội soi

// Debounce helper
const useDebounce = (fn, delay = 400) => {
    const t = useRef();
    return useCallback((...args) => {
        clearTimeout(t.current);
        t.current = setTimeout(() => fn(...args), delay);
    }, [fn, delay]);
};

export default function NoiSoi() {
    const [rows, setRows] = useState([]);              // dữ liệu bảng bệnh nhân (đã unique theo id_patient)
    const [rawImages, setRawImages] = useState([]);    // dữ liệu ảnh ENDO (để tính toán nhanh)
    const [loading, setLoading] = useState(false);

    const [imageModal, setImageModal] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Edit/Delete
    const [editModal, setEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);

    // Add patient modal
    const [addPatientModal, setAddPatientModal] = useState(false);
    const [addPatientLoading, setAddPatientLoading] = useState(false);
    const [form] = Form.useForm();
    // Diseases list for primary_disease_code select
    const [diseases, setDiseases] = useState([]);
    const [diseasesLoading, setDiseasesLoading] = useState(false);

    // Filters
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [searchId, setSearchId] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [clinic, setClinic] = useState(undefined);   // placeholder, nếu sau này cần lọc theo phòng khám

    // Columns cần closure để dùng được handleViewImages
    const columns = useMemo(() => ([
        { title: 'Mã bệnh nhân', dataIndex: 'id_patient', key: 'id_patient', width: 140 },
        { title: 'Họ tên', dataIndex: 'full_name', key: 'full_name' },
        {
            title: 'Ngày sinh',
            dataIndex: 'dob',
            key: 'dob',
            width: 140,
            render: dob => dob ? dayjs(dob).format('DD/MM/YYYY') : ''
        },
        { title: 'Giới tính', dataIndex: 'gender', key: 'gender', width: 100 },
        { title: 'SĐT', dataIndex: 'phone_number', key: 'phone_number', width: 140 },
        { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
        {
            title: 'Thao tác',
            key: 'thaoTac',
            fixed: 'right',
            width: 220,
            render: (_, record) => (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Tooltip title="Xem ảnh">
                        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewImages(record.id_patient)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
                    </Tooltip>
                    <Popover
                        content={
                            <div style={{ width: 260 }}>
                                <Upload.Dragger
                                    accept="image/*"
                                    customRequest={(opt) => handleUploadForPatient(opt, record.id_patient)}
                                    showUploadList={false}
                                    multiple
                                >
                                    <p className="ant-upload-drag-icon">📤</p>
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
    ]), []);

    // Build params cho API /images
    const buildQueryParams = useCallback(() => {
        const params = {
            disease_code: DISEASE_CODE,      // chỉ lấy ảnh Nội soi
            page: 1,
            page_size: 500,                  // đủ lớn cho danh sách hiện tại; có thể thêm phân trang nếu dữ liệu rất lớn
        };
        if (searchId) params.id_patient = searchId.trim();
        if (fromDate) params.from = dayjs(fromDate).toISOString();
        if (toDate) params.to = dayjs(toDate).endOf('day').toISOString();
        // nếu mai sau BE hỗ trợ phòng khám thì thêm params.clinic = clinic
        return params;
    }, [searchId, fromDate, toDate /*, clinic*/]);

    // Lấy danh sách ảnh ENDO và rút gọn thành danh sách bệnh nhân duy nhất
    const fetchPatients = useCallback(async () => {
        setLoading(true);
        try {
            const params = buildQueryParams();
            const res = await axios.get(`${BASE_URL}/images`, { params });
            // res.data: { page, page_size, total, data: [...] }
            const data = Array.isArray(res.data?.data) ? res.data.data : [];

            // Lưu raw ảnh (đã là ENDO)
            setRawImages(data);

            // Rút gọn ra danh sách bệnh nhân duy nhất
            const map = new Map();
            for (const row of data) {
                const p = row.patients; // đã có nhờ select trong images.controller
                if (!p) continue;
                if (!map.has(p.id_patient)) {
                    map.set(p.id_patient, {
                        key: p.id_patient,
                        id_patient: p.id_patient,
                        full_name: p.full_name,
                        dob: p.dob,
                        gender: p.gender,
                        phone_number: p.phone_number,
                        address: p.address, // nếu muốn hiện address, cần BE trả thêm; tạm lấy từ patients endpoint nếu cần
                    });
                }
            }

            // ALSO fetch patients from /patients and merge — some patients may exist in DB without images matching the /images filter
            try {
                const pRes = await axios.get(`${BASE_URL}/patients`, { params: { page: 1, page_size: 500 } });
                const pList = Array.isArray(pRes.data?.data) ? pRes.data.data : (Array.isArray(pRes.data) ? pRes.data : []);
                for (const p of pList) {
                    if (!p || !p.id_patient) continue;
                    // Only add patients relevant to ENDO: either primary_disease_code === ENDO or their image_storage contains ENDO
                    const hasEndoPrimary = p.primary_disease_code === DISEASE_CODE;
                    const hasEndoInStorage = Array.isArray(p.image_storage) && p.image_storage.some(s => s.disease_code === DISEASE_CODE || s.diseases?.code === DISEASE_CODE);
                    if (!map.has(p.id_patient) && (hasEndoPrimary || hasEndoInStorage)) {
                        map.set(p.id_patient, {
                            key: p.id_patient,
                            id_patient: p.id_patient,
                            full_name: p.full_name,
                            dob: p.dob,
                            gender: p.gender,
                            phone_number: p.phone_number,
                            address: p.address || '',
                            primary_disease_code: p.primary_disease_code || null,
                        });
                    }
                }
            } catch (errP) {
                // non-fatal: if patients endpoint fails, we still show results from images
                console.warn('Fetch patients fallback error:', errP);
            }

            // Lọc tiếp client theo keyword (nếu có)
            let tableData = Array.from(map.values());
            if (searchKeyword) {
                const kw = searchKeyword.toLowerCase();
                tableData = tableData.filter(item =>
                    (item.full_name && item.full_name.toLowerCase().includes(kw)) ||
                    (item.address && item.address.toLowerCase().includes(kw)) ||
                    (item.phone_number && String(item.phone_number).includes(kw)) ||
                    (item.id_patient && String(item.id_patient).includes(kw))
                );
            }

            setRows(tableData);
        } catch (err) {
            console.error('Fetch ENDO patients error:', err);
            message.error('Không tải được danh sách bệnh nhân nội soi');
            setRows([]);
            setRawImages([]);
        } finally {
            setLoading(false);
        }
    }, [buildQueryParams, searchKeyword]);

    useEffect(() => {
        fetchPatients();
        fetchDiseases();
    }, []); // mount 1 lần

    // Fetch diseases to populate "Loại bệnh" select in the add-patient form
    const fetchDiseases = useCallback(async () => {
        setDiseasesLoading(true);
        try {
            // Try to read from /diseases; backend may return { data: [...] } or an array
            const res = await axios.get(`${BASE_URL}/diseases`);
            const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
            setDiseases(list || []);
        } catch (err) {
            console.error('Fetch diseases error:', err);
            setDiseases([]);
        } finally {
            setDiseasesLoading(false);
        }
    }, []);

    // Debounce tìm kiếm
    const debouncedSearch = useDebounce(() => fetchPatients(), 400);

    // Khi thay đổi filter → gọi lại API
    useEffect(() => {
        debouncedSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchId, fromDate, toDate, searchKeyword /*, clinic*/]);

    // Xem ảnh ENDO của 1 bệnh nhân
    const handleViewImages = async (id_patient) => {
        setSelectedPatient(id_patient);
        setImageLoading(true);
        try {
            // Lấy trực tiếp từ API hình ảnh đã filter: /images?disease_code=ENDO&id_patient=...
            const params = {
                disease_code: DISEASE_CODE,
                id_patient,
                include_base64: 1, // để hiển thị ngay
                // Có thể thêm from/to nếu muốn áp cùng khoảng thời gian
                ...(fromDate ? { from: dayjs(fromDate).toISOString() } : {}),
                ...(toDate ? { to: dayjs(toDate).endOf('day').toISOString() } : {}),
            };
            const res = await axios.get(`${BASE_URL}/images`, { params });
            const list = Array.isArray(res.data?.data) ? res.data.data : res.data;
            let arr = Array.isArray(list) ? list : [];

            // If filtered /images returns empty, try the patient-specific endpoint as a fallback
            if (!arr || arr.length === 0) {
                try {
                    const res2 = await axios.get(`${BASE_URL}/images/patient/${id_patient}`, { params: { include_base64: 1 } });
                    const list2 = Array.isArray(res2.data?.data) ? res2.data.data : (Array.isArray(res2.data) ? res2.data : []);
                    arr = Array.isArray(list2) ? list2 : [];
                } catch (err2) {
                    // ignore; keep arr as empty
                    console.warn('Fallback fetch /images/patient failed', err2);
                }
            }

            // Final fallback: request patient record and read its image_storage if present
            if ((!arr || arr.length === 0)) {
                try {
                    const pRes = await axios.get(`${BASE_URL}/patients/${id_patient}`);
                    const p = pRes.data;
                    const storage = Array.isArray(p?.image_storage) ? p.image_storage : [];
                    // Normalize shape so UI can read base64 when available
                    arr = storage.map(s => ({ ...s, base64: s.base64 || s.base64_image || '' }));
                } catch (err3) {
                    console.warn('Fallback fetch /patients/{id} failed', err3);
                }
            }

            setImages(arr);
            setImageModal(true);
        } catch (err) {
            console.error('Fetch images by patient error:', err);
            message.error('Không tải được ảnh nội soi của bệnh nhân');
            setImages([]);
            setImageModal(true);
        } finally {
            setImageLoading(false);
        }
    };

    // Upload handler: customRequest for Upload.Dragger
    // Helper: read File/Blob as base64 (without the data: prefix)
    const readFileAsBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (e) => reject(e);
        reader.onload = () => {
            const result = reader.result || '';
            // result is like 'data:<mime>;base64,AAAA..' -> strip prefix
            const idx = result.indexOf(',');
            const base64 = idx >= 0 ? result.slice(idx + 1) : result;
            resolve(base64);
        };
        reader.readAsDataURL(file);
    });

    const handleUpload = async ({ file, onSuccess, onError }) => {
        if (!selectedPatient) {
            onError && onError(new Error('Không có bệnh nhân được chọn'));
            return;
        }

        try {
            const fileData = await readFileAsBase64(file);
            const payload = {
                id_patient: selectedPatient,
                filename: file.name,
                file_data: fileData,
                disease_code: DISEASE_CODE,
            };

            // send JSON body (server error indicates it expects base64 JSON)
            await axios.post(`${BASE_URL}/images`, payload);
            message.success('Tải ảnh lên thành công');
            onSuccess && onSuccess(null);
            // refresh images for current patient
            handleViewImages(selectedPatient);
        } catch (err) {
            console.error('Upload image error:', err);
            if (err?.response) {
                console.error('Server response:', err.response.status, err.response.data);
                message.error(`Tải ảnh thất bại: ${err.response.status} ${err.response.data?.error || err.response.data?.message || ''}`);
            } else {
                message.error('Tải ảnh thất bại');
            }
            onError && onError(err);
        }
    };

    // Upload handler for a specific patient (used in table row popover)
    const handleUploadForPatient = async (options, id_patient) => {
        const { file, onSuccess, onError } = options;
        if (!id_patient) {
            onError && onError(new Error('No patient id'));
            return;
        }

        try {
            const fileData = await readFileAsBase64(file);
            const payload = {
                id_patient,
                filename: file.name,
                file_data: fileData,
                disease_code: DISEASE_CODE,
            };

            await axios.post(`${BASE_URL}/images`, payload);
            message.success(`Tải ảnh cho ${id_patient} thành công`);
            onSuccess && onSuccess(null);
            // refresh list and current images if modal open
            fetchPatients();
            if (imageModal && selectedPatient === id_patient) {
                handleViewImages(id_patient);
            }
        } catch (err) {
            console.error('Upload for patient error:', err);
            if (err?.response) {
                console.error('Server response:', err.response.status, err.response.data);
                message.error(`Tải ảnh thất bại: ${err.response.status} ${err.response.data?.error || err.response.data?.message || ''}`);
            } else {
                message.error('Tải ảnh thất bại');
            }
            onError && onError(err);
        }
    };

    // Delete an image: try multiple backend contracts (by id, or by filename + id_patient)
    const handleDeleteImage = (img) => {
        const filename = img.filename || img.name || '';
        const idp = selectedPatient || img.id_patient || img.patient_id || '';
        Modal.confirm({
            title: 'Xác nhận xóa ảnh',
            content: `Bạn có chắc muốn xóa ảnh "${filename}" của bệnh nhân ${idp || ''}?`,
            onOk: async () => {
                try {
                    // 1) If image has an id, try DELETE /images/{id}
                    if (img.id) {
                        await axios.delete(`${BASE_URL}/images/${img.id}`);
                    } else {
                        // 2) Try DELETE /images with body { id_patient, filename }
                        const payload = { id_patient: idp, filename };
                        try {
                            await axios.delete(`${BASE_URL}/images`, { data: payload });
                        } catch (e1) {
                            // 3) Fallback: POST /images/delete { id_patient, filename }
                            try {
                                await axios.post(`${BASE_URL}/images/delete`, payload);
                            } catch (e2) {
                                // rethrow last error
                                throw e2 || e1;
                            }
                        }
                    }

                    message.success('Xóa ảnh thành công');
                    // Refresh list and modal images
                    fetchPatients();
                    if (selectedPatient) handleViewImages(selectedPatient);
                } catch (err) {
                    console.error('Delete image error:', err);
                    if (err?.response) {
                        console.error('Server response:', err.response.status, err.response.data);
                        message.error(`Không thể xóa ảnh: ${err.response.status} ${err.response.data?.error || err.response.data?.message || ''}`);
                    } else {
                        message.error('Không thể xóa ảnh');
                    }
                }
            }
        });
    };

    // Edit handlers
    const handleEdit = (record) => {
        setEditingPatient(record);
        // populate form for edit (reuse same form instance)
        form.setFieldsValue({
            id_patient: record.id_patient,
            full_name: record.full_name,
            dob: record.dob ? dayjs(record.dob) : null,
            gender: record.gender,
            phone_number: record.phone_number,
            address: record.address,
            primary_disease_code: record.primary_disease_code || null,
        });
        setEditModal(true);
    };

    const handleUpdatePatient = async (values) => {
        if (!editingPatient) return;
        setEditLoading(true);
        try {
            const data = {
                ...values,
                dob: values.dob ? dayjs(values.dob).toISOString() : null,
                primary_disease_code: values.primary_disease_code || null,
            };
            await axios.put(`${BASE_URL}/patients/${editingPatient.id_patient}`, data);
            message.success('Cập nhật bệnh nhân thành công');
            setEditModal(false);
            setEditingPatient(null);
            form.resetFields();
            fetchPatients();
        } catch (err) {
            console.error('Update patient error:', err);
            message.error('Không thể cập nhật bệnh nhân');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: `Bạn có chắc muốn xóa bệnh nhân ${record.id_patient} - ${record.full_name}?`,
            onOk: async () => {
                try {
                    await axios.delete(`${BASE_URL}/patients/${record.id_patient}`);
                    message.success('Xóa bệnh nhân thành công');
                    fetchPatients();
                } catch (err) {
                    console.error('Delete patient error:', err);
                    message.error('Không thể xóa bệnh nhân');
                }
            }
        });
    };

    // Handlers UI
    const onChangeFrom = (d) => setFromDate(d);
    const onChangeTo = (d) => setToDate(d);
    const onChangeKeyword = (e) => setSearchKeyword(e.target.value);
    const onChangePatientId = (e) => setSearchId(e.target.value);

    // Add patient
    const handleAddPatient = async (values) => {
        setAddPatientLoading(true);
        try {
            const data = {
                ...values,
                dob: values.dob ? dayjs(values.dob).toISOString() : null,
                primary_disease_code: DISEASE_CODE,
            };
            await axios.post(`${BASE_URL}/patients`, data);
            message.success('Thêm bệnh nhân thành công');
            setAddPatientModal(false);
            form.resetFields();
            fetchPatients(); // Refresh list
        } catch (err) {
            console.error('Add patient error:', err);
            message.error('Không thể thêm bệnh nhân');
        } finally {
            setAddPatientLoading(false);
        }
    };

    return (
        <div style={{ background: '#f5f6fa', padding: 24 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>NỘI SOI (ENDO)</h2>

            <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                <div>
                    <span>Từ ngày&nbsp;</span>
                    <DatePicker style={{ width: 140 }} value={fromDate} onChange={onChangeFrom} />
                </div>
                <div>
                    <span>Đến ngày&nbsp;</span>
                    <DatePicker style={{ width: 140 }} value={toDate} onChange={onChangeTo} />
                </div>
                <div>
                    <span>Phòng khám&nbsp;</span>
                    <Select
                        placeholder="Chọn..."
                        style={{ width: 160 }}
                        value={clinic}
                        onChange={setClinic}
                        options={[
                            // Tuỳ backend: thêm options thật nếu có
                            // { value: 'A', label: 'Phòng khám A' },
                        ]}
                    />
                </div>
                <div>
                    <span>Từ khóa (F3)&nbsp;</span>
                    <Input
                        placeholder="Tên / SĐT / Địa chỉ / Mã BN"
                        style={{ width: 220 }}
                        value={searchKeyword}
                        onChange={onChangeKeyword}
                        onPressEnter={fetchPatients}
                        allowClear
                    />
                </div>
                <div>
                    <span>Mã bệnh nhân&nbsp;</span>
                    <Input
                        placeholder="Nhập mã bệnh nhân"
                        style={{ width: 160 }}
                        value={searchId}
                        onChange={onChangePatientId}
                        onPressEnter={fetchPatients}
                        allowClear
                    />
                </div>
                <Button
                    type="primary"
                    style={{ background: '#43b02a', border: 'none' }}
                    onClick={fetchPatients}
                >
                    Tìm kiếm
                </Button>
                <Button
                    type="primary"
                    style={{ background: '#4caf50', border: 'none' }}
                    onClick={() => {
                        const randomId = Math.floor(10000 + Math.random() * 90000).toString();
                        form.setFieldsValue({ id_patient: randomId });
                        setAddPatientModal(true);
                    }}
                >
                    Thêm bệnh nhân
                </Button>
                <Button onClick={fetchPatients} title="Tải lại">
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
                dataSource={rows}
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
                <Button type="default" style={{ background: '#ff9800', color: '#fff', border: 'none' }}>
                    Màn hình chờ
                </Button>
                <Button type="primary" style={{ background: '#2196f3', border: 'none' }}>
                    Xuất Excel
                </Button>
            </div>

            <Modal
                title={`Ảnh nội soi của bệnh nhân ${selectedPatient || ''}`}
                open={imageModal}
                onCancel={() => setImageModal(false)}
                footer={null}
                width={900}
            >
                {imageLoading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <Spin />
                    </div>
                ) : images.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="empty" width={60} />
                        <div style={{ marginTop: 8 }}>Không có ảnh nội soi</div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                        {images.map((img, idx) => (
                            <div key={idx} style={{ textAlign: 'center', width: 200 }}>
                                <Image
                                    src={`data:image/jpeg;base64,${img.base64 || ''}`}
                                    alt={img.description || img.filename}
                                    width={180}
                                    style={{ marginBottom: 8 }}
                                />
                                <div style={{ fontWeight: 600 }}>{img.diseases?.name || 'Nội soi'}</div>
                                <div style={{ color: '#666' }}>{img.filename}</div>
                                <div style={{ color: '#666' }}>
                                    {img.taken_at ? dayjs(img.taken_at).format('HH:mm DD/MM/YYYY') : ''}
                                </div>
                                <div style={{ marginTop: 8 }}>
                                    <Tooltip title="Xóa ảnh">
                                        <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => handleDeleteImage(img)} />
                                    </Tooltip>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div style={{ marginTop: 16 }}>
                    <Upload.Dragger
                        accept="image/*"
                        customRequest={handleUpload}
                        showUploadList={false}
                        multiple
                    >
                        <p className="ant-upload-drag-icon">📤</p>
                        <p className="ant-upload-text">Kéo thả ảnh vào đây hoặc nhấn để chọn</p>
                        <p className="ant-upload-hint">Ảnh sẽ được gán tự động cho bệnh nhân đang chọn với loại bệnh Nội soi</p>
                    </Upload.Dragger>
                </div>
            </Modal>

            <Modal
                title="Thêm bệnh nhân mới"
                open={addPatientModal}
                onCancel={() => setAddPatientModal(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddPatient}
                >
                    <Form.Item
                        label="Mã bệnh nhân"
                        name="id_patient"
                        rules={[{ required: true, message: 'Vui lòng nhập mã bệnh nhân' }]}
                    >
                        <Input placeholder="Nhập mã bệnh nhân" />
                    </Form.Item>
                    <Form.Item
                        label="Họ tên"
                        name="full_name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input placeholder="Nhập họ tên" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày sinh"
                        name="dob"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={(current) => {
                                const currentYear = dayjs().year();
                                return current && (current.year() < 1950 || current.year() > currentYear);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                    >
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="Nam">Nam</Select.Option>
                            <Select.Option value="Nữ">Nữ</Select.Option>
                        </Select>
                    </Form.Item>
                    {/* primary_disease_code is auto-set to ENDO for Nội soi - no selection needed */}
                    <Form.Item
                        label="Số điện thoại"
                        name="phone_number"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button onClick={() => setAddPatientModal(false)} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={addPatientLoading}>
                            Thêm
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Sửa bệnh nhân"
                open={editModal}
                onCancel={() => { setEditModal(false); setEditingPatient(null); form.resetFields(); }}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleUpdatePatient}
                >
                    {/* reuse same fields as add form */}
                    <Form.Item
                        label="Mã bệnh nhân"
                        name="id_patient"
                        rules={[{ required: true, message: 'Vui lòng nhập mã bệnh nhân' }]}
                    >
                        <Input placeholder="Nhập mã bệnh nhân" disabled />
                    </Form.Item>
                    <Form.Item
                        label="Họ tên"
                        name="full_name"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input placeholder="Nhập họ tên" />
                    </Form.Item>
                    <Form.Item
                        label="Ngày sinh"
                        name="dob"
                        rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            disabledDate={(current) => {
                                const currentYear = dayjs().year();
                                return current && (current.year() < 1950 || current.year() > currentYear);
                            }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Giới tính"
                        name="gender"
                        rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                    >
                        <Select placeholder="Chọn giới tính">
                            <Select.Option value="Nam">Nam</Select.Option>
                            <Select.Option value="Nữ">Nữ</Select.Option>
                        </Select>
                    </Form.Item>
                    {/* primary_disease_code is auto-set to ENDO for Nội soi - no selection needed */}
                    <Form.Item
                        label="Số điện thoại"
                        name="phone_number"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item
                        label="Địa chỉ"
                        name="address"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                    >
                        <Input placeholder="Nhập địa chỉ" />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right' }}>
                        <Button onClick={() => { setEditModal(false); setEditingPatient(null); form.resetFields(); }} style={{ marginRight: 8 }}>
                            Hủy
                        </Button>
                        <Button type="primary" htmlType="submit" loading={editLoading}>
                            Lưu
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}
