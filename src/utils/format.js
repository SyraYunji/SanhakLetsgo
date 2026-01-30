export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const week = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
  return `${month}/${day} (${week})`;
}
