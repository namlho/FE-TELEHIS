import React, { useCallback, useEffect, useState } from "react";
import "./ECG.css";
import { Button, Form, Tabs, message, Modal } from "antd";
import dayjs from "dayjs";
import useDebounce from "./hooks/useDebounce";
import { DISEASE_CODE } from "./constants";
import { imagesAPI, patientsAPI } from "./services/api";
import FiltersBar from "./components/FiltersBar";
import PatientsTable from "./components/PatientsTable";
import ImageModal from "./components/ImageModal";
import AddPatientModal from "./components/AddPatientModal";
import EditPatientModal from "./components/EditPatientModal";
import { readFileAsBase64, inferMimeFromBase64, sanitizeFilename } from "./utils/fileUtils";

const { TabPane } = Tabs;

export default function ECG() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);

  const [imageModal, setImageModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [editModal, setEditModal] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [addPatientModal, setAddPatientModal] = useState(false);
  const [addPatientLoading, setAddPatientLoading] = useState(false);
  const [form] = Form.useForm();

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const buildQueryParams = useCallback((p = page, ps = pageSize) => {
    const params = { disease_code: DISEASE_CODE, page: p || 1, page_size: ps || 20 };
    if (searchId) params.id_patient = searchId.trim();
    if (fromDate) {
      params.from = dayjs(fromDate).toISOString();
      params.from_date = dayjs(fromDate).format("YYYY-MM-DD");
      params.from_ts = dayjs(fromDate).startOf("day").valueOf();
    }
    if (toDate) {
      params.to = dayjs(toDate).endOf("day").toISOString();
      params.to_date = dayjs(toDate).format("YYYY-MM-DD");
      params.to_ts = dayjs(toDate).endOf("day").valueOf();
    }
    return params;
  }, [searchId, fromDate, toDate, page, pageSize]);

  const fetchPatients = useCallback(async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const params = buildQueryParams(p, ps);
      const res = await imagesAPI.list(params);
      const data = imagesAPI.normalize(res);

      const totalFromBody = res.data?.total || res.data?.meta?.total;
      const totalHeader = parseInt(res.headers?.["x-total-count"] || "", 10) || undefined;
      const finalTotal = typeof totalFromBody === "number" && !Number.isNaN(totalFromBody)
        ? totalFromBody
        : (typeof totalHeader === "number" ? totalHeader : (Array.isArray(data) ? data.length : 0));
      setTotal(finalTotal || 0);
      setPage(p || 1);
      setPageSize(ps || pageSize);

      const map = new Map();
      for (const row of data) {
        const pt = row.patients || row;
        if (!pt || !pt.id_patient) continue;
        if (!map.has(pt.id_patient)) {
          const fallbackCreated = pt.created_at || pt.createdAt || pt.uploaded_at_vn || (Array.isArray(pt.image_storage) && (pt.image_storage[0]?.uploaded_at_vn || pt.image_storage[0]?.uploaded_at)) || pt.uploaded_at || null;
          map.set(pt.id_patient, {
            key: pt.id_patient,
            id_patient: pt.id_patient,
            full_name: pt.full_name,
            dob: pt.dob,
            gender: pt.gender,
            phone_number: pt.phone_number,
            address: pt.address,
            created_at: fallbackCreated,
          });
        }
      }

      try {
        const pRes = await patientsAPI.list({ page: 1, page_size: 500 });
        const pList = patientsAPI.normalize(pRes);
        for (const pItem of pList) {
          if (!pItem?.id_patient) continue;
          const hasPrimary = pItem.primary_disease_code === DISEASE_CODE;
          const hasInStorage = Array.isArray(pItem.image_storage)
            && pItem.image_storage.some(s => s.disease_code === DISEASE_CODE || s.diseases?.code === DISEASE_CODE);
          if (hasPrimary || hasInStorage) {
            const fallbackCreated = pItem.created_at || pItem.createdAt || pItem.uploaded_at_vn || (Array.isArray(pItem.image_storage) && (pItem.image_storage[0]?.uploaded_at_vn || pItem.image_storage[0]?.uploaded_at)) || pItem.uploaded_at || null;
            if (!map.has(pItem.id_patient)) {
              // not in map yet -> add
              map.set(pItem.id_patient, {
                key: pItem.id_patient,
                id_patient: pItem.id_patient,
                full_name: pItem.full_name,
                dob: pItem.dob,
                gender: pItem.gender,
                phone_number: pItem.phone_number,
                address: pItem.address || "",
                created_at: fallbackCreated,
                primary_disease_code: pItem.primary_disease_code || null,
              });
            } else {
              // already present (likely added from image rows) -> merge missing fields like created_at
              const existing = map.get(pItem.id_patient) || {};
              const updated = { ...existing };
              if (!updated.created_at && fallbackCreated) updated.created_at = fallbackCreated;
              if ((!updated.address || updated.address === "") && pItem.address) updated.address = pItem.address;
              if ((!updated.full_name || updated.full_name === "") && pItem.full_name) updated.full_name = pItem.full_name;
              if ((!updated.dob || updated.dob === "") && pItem.dob) updated.dob = pItem.dob;
              if ((!updated.gender || updated.gender === "") && pItem.gender) updated.gender = pItem.gender;
              if ((!updated.phone_number || updated.phone_number === "") && pItem.phone_number) updated.phone_number = pItem.phone_number;
              updated.primary_disease_code = updated.primary_disease_code || pItem.primary_disease_code || null;
              map.set(pItem.id_patient, updated);
            }
          }
        }
      } catch (errP) {
        console.warn("Fetch patients fallback error:", errP);
      }

      let tableData = Array.from(map.values());
      // debug: small sample to inspect created_at values (remove after verifying)
      // eslint-disable-next-line no-console
      console.log('[ECG] tableData sample for created_at check:', tableData.slice(0, 20).map(t => ({ id: t.id_patient, created_at: t.created_at })));
      if (searchId) {
        const sid = String(searchId).trim();
        tableData = tableData.filter(item => String(item.id_patient) === sid);
      }
      if (searchKeyword) {
        const kw = searchKeyword.toLowerCase();
        tableData = tableData.filter(item =>
          (item.full_name && item.full_name.toLowerCase().includes(kw)) ||
          (item.address && item.address.toLowerCase().includes(kw)) ||
          (item.phone_number && String(item.phone_number).includes(kw)) ||
          (item.id_patient && String(item.id_patient).includes(kw))
        );
      }

      // Ensure pagination total matches the number of unique patient rows we display.
      // The API `imagesAPI.list` may return image-level rows where `total` counts images,
      // but here we deduplicate per patient (map) so the number of rows can be lower.
      // Use the tableData length as the total so the UI shows the correct page size/rows.
      setTotal(Array.isArray(tableData) ? tableData.length : 0);
      setRows(tableData);
    } catch (err) {
      console.error("Fetch ECG patients error:", err);
      message.error("Không tải được danh sách bệnh nhân Điện tim");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [buildQueryParams, searchKeyword, page, pageSize]);

  useEffect(() => { fetchPatients(); }, []); // mount

  const debouncedSearch = useDebounce(() => fetchPatients(), 400);
  useEffect(() => { debouncedSearch(); }, [searchId, fromDate, toDate, searchKeyword]); // eslint-disable-line

  const handleViewImages = async (id_patient) => {
    setSelectedPatient(id_patient);
    setImageLoading(true);
    try {
      const params = {
        disease_code: DISEASE_CODE,
        id_patient,
        include_base64: 1,
        ...(fromDate ? { from: dayjs(fromDate).toISOString() } : {}),
        ...(toDate ? { to: dayjs(toDate).endOf("day").toISOString() } : {}),
      };
      let list = [];
      const r1 = await imagesAPI.list(params);
      list = imagesAPI.normalize(r1);
      if (!list || list.length === 0) {
        try {
          const r2 = await imagesAPI.byPatient(id_patient, { include_base64: 1 });
          list = imagesAPI.normalize(r2);
        } catch { }
      }
      if (!list || list.length === 0) {
        try {
          const pr = await patientsAPI.get(id_patient);
          const p = pr.data;
          const storage = Array.isArray(p?.image_storage) ? p.image_storage : [];
          list = storage.map(s => ({ ...s, base64: s.base64 || s.base64_image || "" }));
        } catch { }
      }
      setImages(Array.isArray(list) ? list : []);
      setImageModal(true);
    } catch (err) {
      console.error("Fetch images by patient error:", err);
      message.error("Không tải được ảnh Điện tim của bệnh nhân");
      setImages([]);
      setImageModal(true);
    } finally {
      setImageLoading(false);
    }
  };

  const handleUpload = async ({ file, onSuccess, onError }) => {
    if (!selectedPatient) {
      onError?.(new Error("Không có bệnh nhân được chọn"));
      return;
    }
    try {
      const fileData = await readFileAsBase64(file);
      const mime = inferMimeFromBase64(fileData, file.type || "application/octet-stream");
      const safeName = sanitizeFilename(file.name, mime, fileData);
      const payload = {
        id_patient: selectedPatient,
        filename: safeName,
        original_filename: file.name,
        file_mime: mime,
        file_data: fileData,
        file_data_uri: `data:${mime};base64,${fileData}`,
        disease_code: DISEASE_CODE,
      };
      await imagesAPI.upload(payload);
      message.success("Tải ảnh lên thành công");
      onSuccess?.(null);
      handleViewImages(selectedPatient);
    } catch (err) {
      console.error("Upload image error:", err);
      const msg = err?.response
        ? `Tải ảnh thất bại: ${err.response.status} ${err.response.data?.error || err.response.data?.message || ""}`
        : "Tải ảnh thất bại";
      message.error(msg);
      onError?.(err);
    }
  };

  const handleUploadForPatient = async (options, id_patient) => {
    const { file, onSuccess, onError } = options;
    if (!id_patient) {
      onError?.(new Error("No patient id"));
      return;
    }
    try {
      const fileData = await readFileAsBase64(file);
      const mime = inferMimeFromBase64(fileData, file.type || "application/octet-stream");
      const safeName = sanitizeFilename(file.name, mime, fileData);
      const payload = {
        id_patient,
        filename: safeName,
        original_filename: file.name,
        file_mime: mime,
        file_data: fileData,
        file_data_uri: `data:${mime};base64,${fileData}`,
        disease_code: DISEASE_CODE,
      };
      await imagesAPI.upload(payload);
      message.success(`Tải ảnh cho ${id_patient} thành công`);
      onSuccess?.(null);
      fetchPatients(page, pageSize);
      if (imageModal && selectedPatient === id_patient) handleViewImages(id_patient);
    } catch (err) {
      console.error("Upload for patient error:", err);
      const msg = err?.response
        ? `Tải ảnh thất bại: ${err.response.status} ${err.response.data?.error || err.response.data?.message || ""}`
        : "Tải ảnh thất bại";
      message.error(msg);
      onError?.(err);
    }
  };

  const handleDeleteImage = (img) => {
    const filename = img.filename || img.name || "";
    const idp = selectedPatient || img.id_patient || img.patient_id || "";
    Modal.confirm({
      title: "Xác nhận xóa ảnh",
      content: `Bạn có chắc muốn xóa ảnh "${filename}" của bệnh nhân ${idp || ""}?`,
      onOk: async () => {
        try {
          if (img.id) {
            await imagesAPI.deleteById(img.id);
          } else {
            const payload = { id_patient: idp, filename };
            try {
              await imagesAPI.deleteByBody(payload);
            } catch {
              await imagesAPI.deleteByPost(payload);
            }
          }
          message.success("Xóa ảnh thành công");
          fetchPatients();
          if (selectedPatient) handleViewImages(selectedPatient);
        } catch (err) {
          console.error("Delete image error:", err);
          const msg = err?.response
            ? `Không thể xóa ảnh: ${err.response.status} ${err.response.data?.error || err.response.data?.message || ""}`
            : "Không thể xóa ảnh";
          message.error(msg);
        }
      }
    });
  };

  const handleEdit = (record) => {
    setEditingPatient(record);
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
      await patientsAPI.update(editingPatient.id_patient, data);
      message.success("Cập nhật bệnh nhân thành công");
      setEditModal(false);
      setEditingPatient(null);
      form.resetFields();
      fetchPatients();
    } catch (err) {
      console.error("Update patient error:", err);
      message.error("Không thể cập nhật bệnh nhân");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      content: `Bạn có chắc muốn xóa bệnh nhân ${record.id_patient} - ${record.full_name}?`,
      onOk: async () => {
        try {
          await patientsAPI.remove(record.id_patient);
          message.success("Xóa bệnh nhân thành công");
          fetchPatients();
        } catch (err) {
          console.error("Delete patient error:", err);
          message.error("Không thể xóa bệnh nhân");
        }
      }
    });
  };

  const handleAddPatient = async (values) => {
    setAddPatientLoading(true);
    try {
      const data = {
        ...values,
        dob: values.dob ? dayjs(values.dob).toISOString() : null,
        primary_disease_code: DISEASE_CODE,
      };
      await patientsAPI.add(data);
      message.success("Thêm bệnh nhân thành công");
      setAddPatientModal(false);
      form.resetFields();
      fetchPatients();
    } catch (err) {
      console.error("Add patient error:", err);
      message.error("Không thể thêm bệnh nhân");
    } finally {
      setAddPatientLoading(false);
    }
  };

  const onChangeFrom = (d) => setFromDate(d);
  const onChangeTo = (d) => setToDate(d);
  const onChangeKeyword = (e) => setSearchKeyword(e.target.value);
  const onChangePatientId = (e) => setSearchId(e.target.value);

  return (
    <div style={{ background: "#f5f6fa", padding: 24 }}>
      <h2 style={{ fontWeight: 700, marginBottom: 16 }}>ĐIỆN TIM (ECG)</h2>

      <FiltersBar
        fromDate={fromDate}
        toDate={toDate}
        searchKeyword={searchKeyword}
        searchId={searchId}
        onChangeFrom={onChangeFrom}
        onChangeTo={onChangeTo}
        onChangeKeyword={onChangeKeyword}
        onChangePatientId={onChangePatientId}
        onSearch={fetchPatients}
        onOpenAddPatient={() => {
          const randomId = Math.floor(10000 + Math.random() * 90000).toString();
          form.setFieldsValue({ id_patient: randomId });
          setAddPatientModal(true);
        }}
        onReload={fetchPatients}
      />

      <Tabs defaultActiveKey="1" style={{ marginBottom: 0 }}>
        <TabPane tab="Danh sách" key="1" />
        <TabPane tab="Chờ thực hiện" key="2" />
        <TabPane tab="Đang thực hiện" key="3" />
        <TabPane tab="Đã thực hiện" key="4" />
        <TabPane tab="Đã hủy" key="5" />
      </Tabs>

      <PatientsTable
        rows={rows}
        loading={loading}
        page={page}
        pageSize={pageSize}
        total={total}
        onChangePage={(pagination) => {
          const current = pagination?.current || 1;
          const ps = pagination?.pageSize || pageSize;
          setPage(current);
          setPageSize(ps);
          fetchPatients(current, ps);
        }}
        onViewImages={handleViewImages}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUploadForPatient={handleUploadForPatient}
      />

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <Button type="default" style={{ background: "#ff9800", color: "#fff", border: "none" }}>
          Màn hình chờ
        </Button>
        <Button type="primary" style={{ background: "#2196f3", border: "none" }}>
          Xuất Excel
        </Button>
      </div>

      <ImageModal
        open={imageModal}
        onClose={() => setImageModal(false)}
        selectedPatient={selectedPatient}
        images={images}
        imageLoading={imageLoading}
        onDeleteImage={handleDeleteImage}
        onUpload={handleUpload}
      />

      <AddPatientModal
        open={addPatientModal}
        onCancel={() => setAddPatientModal(false)}
        onSubmit={handleAddPatient}
        form={form}
        loading={addPatientLoading}
      />

      <EditPatientModal
        open={editModal}
        onCancel={() => { setEditModal(false); setEditingPatient(null); form.resetFields(); }}
        onSubmit={handleUpdatePatient}
        form={form}
        loading={editLoading}
      />
    </div>
  );
}
