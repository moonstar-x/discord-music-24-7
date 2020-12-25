export const readFileSync = jest.fn(() => []);
export const existsSync = jest.fn(() => false);

export default {
  readFileSync,
  existsSync
};
