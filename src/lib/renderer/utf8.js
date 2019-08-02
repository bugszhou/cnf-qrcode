const Utils = require('./utils');

const BLOCK_CHAR = {
  WW: ' ',
  WB: '▄',
  BB: '█',
  BW: '▀',
};

const INVERTED_BLOCK_CHAR = {
  BB: ' ',
  BW: '▄',
  WW: '█',
  WB: '▀',
};

function getBlockChar(top, bottom, blocks) {
  if (top && bottom) return blocks.BB;
  if (top && !bottom) return blocks.BW;
  if (!top && bottom) return blocks.WB;
  return blocks.WW;
}

exports.render = function(qrData, options, cb) {
  const opts = Utils.getOptions(options);
  let blocks = BLOCK_CHAR;
  if (opts.color.dark.hex === '#ffffff' || opts.color.light.hex === '#000000') {
    blocks = INVERTED_BLOCK_CHAR;
  }

  const { size } = qrData.modules;
  const { data } = qrData.modules;

  let output = '';
  let hMargin = Array(size + (opts.margin * 2) + 1).join(blocks.WW);
  hMargin = Array((opts.margin / 2) + 1).join(`${hMargin}\n`);

  const vMargin = Array(opts.margin + 1).join(blocks.WW);

  output += hMargin;
  for (let i = 0; i < size; i += 2) {
    output += vMargin;
    for (let j = 0; j < size; j++) {
      const topModule = data[i * size + j];
      const bottomModule = data[(i + 1) * size + j];

      output += getBlockChar(topModule, bottomModule, blocks);
    }

    output += `${vMargin}\n`;
  }

  output += hMargin.slice(0, -1);

  if (typeof cb === 'function') {
    cb(null, output);
  }

  return output;
};
