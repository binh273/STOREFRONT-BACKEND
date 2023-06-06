export const totalIncrease = async (
  total_amount: number,
  quantity: number,
  price: number,
): Promise<number> => {
  const _total_amount = +total_amount + +quantity * +price;
  return _total_amount;
};
export const totalReduced = async (
  total_amount: number,
  quantity: number,
  price: number,
): Promise<number> => {
  const _total_amount = +total_amount - +quantity * +price;
  return _total_amount;
};
