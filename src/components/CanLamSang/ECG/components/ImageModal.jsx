import { Button, Image, Modal, Spin, Tooltip, Upload } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function ImageModal({
  open, onClose, selectedPatient,
  images, imageLoading,
  onDeleteImage,
  onUpload
}) {
  return (
    <Modal
      title={`Ảnh Điện tim (ECG) của bệnh nhân ${selectedPatient || ""}`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={900}
    >
      {imageLoading ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <Spin />
        </div>
      ) : images.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40 }}>
          <img src="https://cdn-icons-png.flaticon.com/512/2748/2748558.png" alt="empty" width={60} />
          <div style={{ marginTop: 8 }}>Không có ảnh Điện tim</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ textAlign: "center", width: 200 }}>
              <Image
                src={`data:image/jpeg;base64,${img.base64 || ""}`}
                alt={img.description || img.filename}
                width={180}
                style={{ marginBottom: 8 }}
              />
              <div style={{ fontWeight: 600 }}>{img?.diseases?.name || "ECG"}</div>
              <div style={{ color: "#666" }}>{img.filename}</div>
              <div style={{ color: "#666" }}>
                {img.taken_at ? dayjs(img.taken_at).format("HH:mm DD/MM/YYYY") : ""}
              </div>
              <div style={{ marginTop: 8 }}>
                <Tooltip title="Xóa ảnh">
                  <Button type="text" danger size="small" icon={<DeleteOutlined />} onClick={() => onDeleteImage(img)} />
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Upload.Dragger accept="image/*" customRequest={onUpload} showUploadList={false} multiple>
          <p className="ant-upload-drag-icon"></p>
          <p className="ant-upload-text">Kéo thả ảnh vào đây hoặc nhấn để chọn</p>
          <p className="ant-upload-hint">Ảnh sẽ được gán tự động cho BN đang chọn với loại bệnh Điện tim</p>
        </Upload.Dragger>
      </div>
    </Modal>
  );
}
