export const FormatCurrencyIDR = (amount) => {
  if (typeof amount !== "number") {
    amount = parseInt(amount, 10);
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
