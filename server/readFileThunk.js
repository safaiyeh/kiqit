const fs = require('fs');

/**
 * Read file.
 * @constructor
 * @param {string} src - path to file.
 * @return {Promise} promise
 */
 exports.readFile = function readFileThunk(src) {
  const options = {
    'encoding': 'utf8',
  };

  return new Promise((resolve, reject) => {
    fs.readFile(src, options, (err, data) => {
      if (err) {
        return reject(err);
      }
      return resolve(data);
    });
  });
};
