/* eslint-disable no-unused-vars */
import { Readable } from 'stream';

const infoMock = {
  videoDetails: {
    title: 'video title'
  }
};

export default {
  getInfo: jest.fn((url, options) => Promise.resolve(infoMock)),
  downloadFromInfo: jest.fn((url, options) => new Readable())
};
