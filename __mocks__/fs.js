export const readFileSync = jest.fn(() => []);
export const existsSync = jest.fn(() => false);
export const writeFileSync = jest.fn();
export const mkdirSync = jest.fn();

export default {
  readFileSync,
  existsSync,
  writeFileSync,
  mkdirSync
};
