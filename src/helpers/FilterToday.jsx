export const filterToday = (data) => {
  const today = new Date();
  return data.filter((item) => {
    const createdAt = new Date(item.created_at);
    return (
      createdAt.getFullYear() === today.getFullYear() &&
      createdAt.getMonth() === today.getMonth() &&
      createdAt.getDate() === today.getDate()
    );
  });
};
