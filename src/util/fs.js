const {createWriteStream} = require('fs');
const {dirname, normalize} = require('path');
const mkdir = require('mkdirplz');

exports.writer = async function(file) {
  file = normalize(file.replace(/^\//, ''));
  await mkdir(dirname(file));
  return createWriteStream(file);
};
