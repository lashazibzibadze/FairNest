export const getRandomDealType = () => {
  const types = ["Fraud", "Fair", "Good"];
  return types[Math.floor(Math.random() * types.length)];
};
