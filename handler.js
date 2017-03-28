'use strict';

const zlib = require('zlib'),
      readline = require('readline'),
      querystring = require('querystring'),
      AWS = require('aws-sdk');


module.exports.logFileReceived = (event, context, callback) => {
  const s3 = new AWS.S3();

  for (let record of event.Records) {
    if (record.eventName.startsWith('ObjectCreated')) {
      const params = { Bucket: record.s3.bucket.name, Key: record.s3.object.key };
      const s3InputStream = s3.getObject(params).createReadStream();
      const rl = readline.createInterface({
        input: s3InputStream.pipe(zlib.createGunzip())
      });

      rl.on('line', function(line) {
        if (line.startsWith('#'))
          return;

        const pieces = line.split("\t");
        if (pieces.length !== 24 || pieces[11] === '-')
          return;

        console.log(JSON.stringify({
          id: pieces[14],
          timestamp: `${pieces[0]} ${pieces[1]}`,
          ip: pieces[4],
          params: querystring.parse(pieces[11])
        }));
      });
    }
  }

  callback(null, { message: 'Done', event });
};
