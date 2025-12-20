export const convertCurrency = (amount: string | number) => {
  return Number(amount).toLocaleString("en-GH", {
    style: "currency",
    currency: "GHS",
  });
};

export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
