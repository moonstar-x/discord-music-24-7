const readFileSync = jest.fn(() => []);
const existsSync = jest.fn(() => true);
const writeFileSync = jest.fn();
const mkdirSync = jest.fn();
const readFile = jest.fn((path, opts, cb) => {
  cb(null, Buffer.alloc(1));
});
const readdirSync = jest.fn(() => []);

module.exports = {
  readFileSync,
  existsSync,
  writeFileSync,
  mkdirSync,
  readFile,
  readdirSync
};
