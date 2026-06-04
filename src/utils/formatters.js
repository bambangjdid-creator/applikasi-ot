const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const formatFriendlyDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatCleanTime = (timeString) => {
  if (!timeString) return '';
  const cleaned = timeString.replace(/Z|([+-]\d{2}:\d{2})/g, '');
  const [hours = '00', minutes = '00'] = cleaned.split(':');
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

export const calculateOvertimePay = (startTimeStr, endTimeStr) => {
  if (!startTimeStr || !endTimeStr) {
    return { duration: 0, roundedDuration: 0, pay: 0, steps: [] };
  }

  const cleanStart = formatCleanTime(startTimeStr);
  const cleanEnd = formatCleanTime(endTimeStr);
  const [startH, startM] = cleanStart.split(':').map(Number);
  const [endH, endM] = cleanEnd.split(':').map(Number);

  let diffMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  if (diffMinutes < 0) {
    diffMinutes += 24 * 60;
  }

  if (diffMinutes < 60) {
    return {
      duration: Number((diffMinutes / 60).toFixed(2)),
      roundedDuration: 0,
      pay: 0,
      steps: ['Durasi di bawah 1 jam tidak dihitung (Rp. 0)']
    };
  }

  const rawHours = diffMinutes / 60;
  const wholeHours = Math.floor(rawHours);
  const remainingMins = diffMinutes % 60;
  const roundedHours = remainingMins <= 30 ? wholeHours : wholeHours + 0.5;

  let totalPay = 0;
  const steps = [];

  if (roundedHours >= 1) {
    totalPay += 20000;
    steps.push('1 Jam Pertama = Rp. 20.000');

    const extraHours = roundedHours - 1;
    if (extraHours > 0) {
      const extraPay = extraHours * 15000;
      totalPay += extraPay;
      steps.push(`Jam Berikutnya (${extraHours} Jam x Rp. 15.000) = Rp. ${extraPay.toLocaleString('id-ID')}`);
    }
  }

  return {
    duration: Number(rawHours.toFixed(2)),
    roundedDuration: roundedHours,
    pay: totalPay,
    steps
  };
};
