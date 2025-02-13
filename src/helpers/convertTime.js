export const convertTime = (timestamp) => {
  // Buat objek Date dari timestamp
  const date = new Date(timestamp);

  // Array nama hari dan nama bulan dalam bahasa Indonesia
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Ambil data waktu sesuai zona waktu Jakarta (UTC+7)
  const options = {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const formatter = new Intl.DateTimeFormat("id-ID", options);
  const formattedDate = formatter.formatToParts(date);

  // Ekstrak bagian-bagian tanggal yang diperlukan
  const day = date.getUTCDay(); // Hari dalam format angka (0-6)
  const dateNumber = formattedDate.find((part) => part.type === "day").value;
  const month = formattedDate.find((part) => part.type === "month").value - 1; // Sesuaikan index bulan
  const year = formattedDate.find((part) => part.type === "year").value;
  const hour = formattedDate.find((part) => part.type === "hour").value;
  const minute = formattedDate.find((part) => part.type === "minute").value;
  // const second = formattedDate.find((part) => part.type === "second").value;

  // Gabungkan ke dalam format yang diinginkan
  return `${days[day]}, ${dateNumber} ${months[month]} ${year}, ${hour}.${minute} WIB`;
};
