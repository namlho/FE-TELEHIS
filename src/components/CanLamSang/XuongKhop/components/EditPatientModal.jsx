import { Button, DatePicker, Form, Input, Modal, Select } from 'antd';
import dayjs from 'dayjs';

export default function EditPatientModal({
  open, onCancel, onSubmit, form, loading
}) {
  return (
    <Modal title="Sửa bệnh nhân" open={open} onCancel={onCancel} footer={null} width={600}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Mã bệnh nhân" name="id_patient" rules={[{ required: true, message: 'Vui lòng nhập mã bệnh nhân' }]}>
          <Input placeholder="Nhập mã bệnh nhân" disabled />
        </Form.Item>
        <Form.Item label="Họ tên" name="full_name" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}>
          <Input placeholder="Nhập họ tên" />
        </Form.Item>
        <Form.Item label="Ngày sinh" name="dob" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}>
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(current) => {
              const currentYear = dayjs().year();
              return current && (current.year() < 1950 || current.year() > currentYear);
            }}
          />
        </Form.Item>
        <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}>
          <Select placeholder="Chọn giới tính">
            <Select.Option value="Nam">Nam</Select.Option>
            <Select.Option value="Nữ">Nữ</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Số điện thoại" name="phone_number" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item label="Địa chỉ" name="address" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>Lưu</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
