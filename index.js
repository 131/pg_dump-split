"use strict";

const fs = require('fs');
const path = require('path');


const StreamSearch = require('streamsearch');
const mkdirpSync   = require('nyks/fs/mkdirpSync');
const trace        = require('debug')('pg_dump-split');

const end_needle   = new Buffer("\n\\.\n");
const start_needle = new Buffer("--\n-- Data for Name: ");
const search       = new RegExp("(.*?);");


class Splitter {

  static split(file_path, target_dir) /**
  * @param {number} [target_dir=out]
  */ {
    if(!target_dir)
      target_dir = 'out';
    mkdirpSync(target_dir);

    var src = fs.createReadStream(file_path);

    var start_splitter = new StreamSearch(start_needle);
    var end_splitter;
    var capture = false;

    //if match, find data AFTER end
    start_splitter.on('info', function(isMatch, data1, start, end) {
      if(capture) {
        capture = false;
        var [, name] =  search.exec(data1.slice(start, start + 256).toString());
        trace("Opening", name);
        end_splitter = new StreamSearch(end_needle, {maxMatches : 1});
        end_splitter.file = fs.createWriteStream(path.join(target_dir, `${name}.sql`));
        end_splitter.name = name;
        end_splitter.file.write(start_needle);
        end_splitter.on('info', function(isMatch2, data2, start, end) {
          if(this.file) {
            src.pause(); //backpressure
            this.file.write(data2.slice(start, end), src.resume.bind(src));
          }

          if(isMatch2 && this.file) {
            this.file.on('finish', () => trace("Closing", this.name));
            this.file.end(end_needle);
            this.file = null;//release file
          }
        });
      }

      if(end_splitter)
        end_splitter.push(data1.slice(start, end));

      //next hit will be a match
      //everything before is discareded
      if(isMatch)
        capture = true;

    });

    src.on('data', start_splitter.push.bind(start_splitter));

    return new Promise((resolve) => {
      src.on('end', resolve);
    });
  }

}

module.exports = Splitter;
