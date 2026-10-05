export const generateOrderId = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  
  return `PED-${year}${month}${day}-${randomStr}`;
};