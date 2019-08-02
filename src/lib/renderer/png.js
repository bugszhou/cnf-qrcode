import pngjs from 'pngjs';
import * as Utils from './utils';

const { PNG } = pngjs;

export function render(qrData, options) {
  const opts = Utils.getOptions(options);
  const pngOpts = opts.rendererOpts;
  const size = Utils.getImageWidth(qrData.modules.size, opts);

  pngOpts.width = size;
  pngOpts.height = size;

  const pngImage = new PNG(pngOpts);
  Utils.qrToImageData(pngImage.data, qrData, opts);

  return pngImage;
}

export function renderToDataURL(qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options;
    options = undefined;
  }

  renderToBuffer(qrData, options, (err, output) => {
    if (err) cb(err);
    let url = 'data:image/png;base64,';
    url += output.toString('base64');
    cb(null, url);
  });
}

export function renderToBuffer(qrData, options, cb) {
  if (typeof cb === 'undefined') {
    cb = options;
    options = undefined;
  }

  const png = render(qrData, options);
  const buffer = [];

  png.on('error', cb);

  png.on('data', (data) => {
    buffer.push(data);
  });

  png.on('end', () => {
    cb(null, Buffer.concat(buffer));
  });

  png.pack();
}

export function renderToFileStream(stream, qrData, options) {
  const png = render(qrData, options);
  png.pack().pipe(stream);
}
