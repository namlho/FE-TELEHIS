import moment from 'moment';

/**
 * formatDate
 * Hàm định dạng chuỗi ngày (ISO hoặc timestamp) sang định dạng DD/MM/YYYY.
 * Trả về '—' nếu định dạng không hợp lệ.
 * @param {string|Date} dateString - Chuỗi ngày cần định dạng.
 * @returns {string} - Chuỗi ngày đã định dạng hoặc '—'.
 */
export const formatDate = (dateString) => {
  try {
    return moment(dateString).format('DD/MM/YYYY');
  } catch (error) {
    return '—';
  }
};