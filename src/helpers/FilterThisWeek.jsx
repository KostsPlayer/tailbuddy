export const filterThisWeek = (data) => {
    const today = new Date();
    const startOfWeek = new Date(today);
  
    // Atur awal minggu (0 = Minggu, 1 = Senin, ..., 6 = Sabtu)
    startOfWeek.setDate(today.getDate() - today.getDay()); // Jika minggu dimulai dari Minggu
    // startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Jika minggu dimulai dari Senin
  
    startOfWeek.setHours(0, 0, 0, 0); // Reset ke awal hari
  
    return data.filter((item) => {
      const createdAt = new Date(item.created_at);
      return createdAt >= startOfWeek && createdAt <= today;
    });
  };
  