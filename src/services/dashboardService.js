const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export const formatFriendlyDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? dateString : `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const formatCleanTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

export const normalizeUser = (user) => ({
  ...user,
  aksesMenu: user.aksesMenu.split(',').map((item) => item.trim())
});

export const normalizeKaryawan = (employee) => ({
  ...employee,
  namaKaryawan: employee.namaKaryawan.trim()
});

export const normalizeOvertime = (overtime) => ({
  ...overtime,
  jenisLembur: overtime.jenisLembur.trim(),
  statusDocument: overtime.statusDocument.trim().toLowerCase()
});

export const normalizeAuditLog = (log) => ({
  ...log,
  timestamp: log.timestamp.trim()
});

export const getAvailableYears = (overtimeList) => {
  const years = new Set();
  overtimeList.forEach((item) => {
    if (item.tanggalLembur) {
      const year = new Date(item.tanggalLembur).getFullYear();
      if (!Number.isNaN(year)) years.add(year);
    }
  });
  return Array.from(years).sort((a, b) => b - a);
};

export const getDashboardStats = (overtimeList, month, year) => {
  const selectedMonth = month === 'ALL' ? null : Number(month);
  const selectedYear = year === 'ALL' ? null : Number(year);

  const filtered = overtimeList.filter((item) => {
    const date = new Date(item.tanggalLembur);
    if (Number.isNaN(date.getTime())) return false;
    if (selectedYear && date.getFullYear() !== selectedYear) return false;
    if (selectedMonth && date.getMonth() + 1 !== selectedMonth) return false;
    return true;
  });

  const totalDurasi = filtered.reduce((sum, item) => sum + Number(item.durasiLembur || 0), 0);
  const totalNominal = filtered.reduce((sum, item) => sum + Number(item.nominal || 0), 0);
  const approvedCount = filtered.filter((item) => item.statusDocument === 'approved').length;
  const pendingCount = filtered.filter((item) => item.statusDocument === 'pending').length;
  const paidCount = filtered.filter((item) => item.statusDocument === 'paid').length;
  const averageDurationPerDoc = filtered.length ? totalDurasi / filtered.length : 0;

  const typeMap = filtered.reduce((map, item) => {
    const typeName = item.jenisLembur.split(' (')[0];
    map[typeName] = map[typeName] || { name: typeName, value: 0 };
    map[typeName].value += Number(item.durasiLembur || 0);
    return map;
  }, {});

  const topTypes = Object.values(typeMap).sort((a, b) => b.value - a.value).slice(0, 5);

  const uniqueDates = Array.from(new Set(filtered.map((item) => item.tanggalLembur)))
    .filter(Boolean)
    .sort((a, b) => new Date(a) - new Date(b));

  let lastDates = [];
  if (uniqueDates.length >= 5) {
    lastDates = uniqueDates.slice(-5);
  } else {
    const earliestDateStr = uniqueDates[0] || new Date().toISOString().substring(0, 10);
    const earliestDate = new Date(earliestDateStr);
    const datesNeeded = 5 - uniqueDates.length;
    const paddedDates = [];
    for (let i = datesNeeded; i > 0; i--) {
      const padDate = new Date(earliestDate);
      padDate.setDate(earliestDate.getDate() - i);
      paddedDates.push(padDate.toISOString().substring(0, 10));
    }
    lastDates = [...paddedDates, ...uniqueDates];
  }

  const dailyChartData = lastDates.map((dateStr) => {
    const dateObj = new Date(dateStr);
    const label = !Number.isNaN(dateObj.getTime())
      ? `${dateObj.getDate()}/${dateObj.getMonth() + 1}`
      : dateStr;
    return {
      name: label,
      durasi: filtered.filter((item) => item.tanggalLembur === dateStr).reduce((sum, item) => sum + Number(item.durasiLembur || 0), 0)
    };
  });

  return {
    totalDurasi,
    totalNominal,
    approvedCount,
    pendingCount,
    paidCount,
    averageDurationPerDoc,
    topTypes,
    recentActivities: filtered.slice(-5).reverse(),
    dailyChartData,
    pieChartData: topTypes.map((type, index) => ({ ...type, fill: COLORS[index % COLORS.length] }))
  };
};
