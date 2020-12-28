export const readFileSync = jest.fn(() => []);
export const existsSync = jest.fn(() => false);
export const writeFileSync = jest.fn();
export const mkdirSync = jest.fn();
export const readFile = jest.fn((path, opts, cb) => {
  cb(null, Buffer.alloc(1));
});
export const readdirSync = jest.fn(() => []);

export default {
  readFileSync,
  existsSync,
  writeFileSync,
  mkdirSync,
  readFile,
  readdirSync
};
