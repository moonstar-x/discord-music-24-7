/* eslint-disable no-unused-vars */
const { Readable } = require('stream');

const infoMock = {
  videoDetails: {
    title: 'video title'
  }
};

module.exports = {
  getInfo: jest.fn((url, options) => Promise.resolve(infoMock)),
  downloadFromInfo: jest.fn((url, options) => new Readable())
};
