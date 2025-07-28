//Hàm getEnv lấy giá trị của biến môi trường theo key.
// Nếu biến không được đặt, nó sẽ trả về giá trị mặc định nếu có, hoặc
// ném ra lỗi nếu không có giá trị mặc định.
export const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return defaultValue;
  }
  return value;
};
