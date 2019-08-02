import canPromise from './can-promise';
import * as QRCode from './core/qrcode';
import * as SvgRenderer from './renderer/svg';
import * as Utf8Renderer from './renderer/utf8';
import * as PngRenderer from './renderer/png';

function checkParams(text, opts, cb) {
  if (typeof text === 'undefined') {
    throw new Error('String required as first argument');
  }

  if (typeof cb === 'undefined') {
    cb = opts;
    opts = {};
  }

  if (typeof cb !== 'function') {
    if (!canPromise()) {
      throw new Error('Callback required as last argument');
    } else {
      opts = cb || {};
      cb = null;
    }
  }

  return {
    opts,
    cb,
  };
}

function getRendererFromType(type) {
  switch (type) {
  case 'svg':
    return SvgRenderer;

  case 'txt':
  case 'utf8':
    return Utf8Renderer;

  case 'png':
  case 'image/png':
  default:
    return PngRenderer;
  }
}

function getStringRendererFromType(type) {
  switch (type) {
  case 'svg':
    return SvgRenderer;

  case 'utf8':
  default:
    return Utf8Renderer;
  }
}

function render(renderFunc, text, params) {
  if (!params.cb) {
    return new Promise(((resolve, reject) => {
      try {
        const data = QRCode.create(text, params.opts);
        return renderFunc(data, params.opts, (err, data) => (err ? reject(err) : resolve(data)));
      } catch (e) {
        reject(e);
      }
    }));
  }

  try {
    const data = QRCode.create(text, params.opts);
    return renderFunc(data, params.opts, params.cb);
  } catch (e) {
    params.cb(e);
  }
}

export const { create } = QRCode;

export function toString(text, opts, cb) {
  const params = checkParams(text, opts, cb);
  const renderer = getStringRendererFromType(params.opts.type);
  return render(renderer.render, text, params);
}

export function toDataURL(text, opts, cb) {
  const params = checkParams(text, opts, cb);
  const renderer = getRendererFromType(params.opts.type);
  return render(renderer.renderToDataURL, text, params);
}

export function toBuffer(text, opts, cb) {
  const params = checkParams(text, opts, cb);
  const renderer = getRendererFromType(params.opts.type);
  return render(renderer.renderToBuffer, text, params);
}

export function getSvgDataURL(text, opts, cb) {
  const params = checkParams(text, opts, (err, url) => {
    cb(err, `data:image/svg+xml;utf8,${encodeURIComponent(url)}`);
  });
  const renderer = getRendererFromType('svg');
  return render(renderer.render, text, params);
}

export function getSvg(text, opts, cb) {
  const params = checkParams(text, opts, cb);
  const renderer = getRendererFromType('svg');
  return render(renderer.render, text, params);
}
