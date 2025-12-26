import { Button, DatePicker, Input } from 'antd';

export default function FiltersBar({
  fromDate, toDate, searchKeyword, searchId,
  onChangeFrom, onChangeTo, onChangeKeyword, onChangePatientId,
  onSearch, onOpenAddPatient, onReload
}) {
  return (
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
        <span>Từ khóa (F3)&nbsp;</span>
        <Input
          placeholder="Tên / SĐT / Địa chỉ / Mã BN"
          style={{ width: 220 }}
          value={searchKeyword}
          onChange={onChangeKeyword}
          onPressEnter={onSearch}
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
          onPressEnter={onSearch}
          allowClear
        />
      </div>
      <Button type="primary" style={{ background: '#43b02a', border: 'none' }} onClick={onSearch}>
        Tìm kiếm
      </Button>
      <Button
        type="primary"
        style={{ background: '#4caf50', border: 'none' }}
        onClick={onOpenAddPatient}
      >
        Thêm bệnh nhân
      </Button>
      <Button onClick={onReload} title="Tải lại"></Button>
    </div>
  );
}
