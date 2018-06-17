

[![Build Status](https://travis-ci.org/131/pg_dump-split.svg?branch=master)](https://travis-ci.org/131/pg_dump-split)
[![Coverage Status](https://coveralls.io/repos/github/131/pg_dump-split/badge.svg?branch=master)](https://coveralls.io/github/131/pg_dump-split?branch=master)
[![Version](https://img.shields.io/npm/v/pg_dump-split.svg)](https://www.npmjs.com/package/pg_dump-split)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](http://opensource.org/licenses/MIT)
[![Code style](https://img.shields.io/badge/code%2fstyle-ivs-green.svg)](https://www.npmjs.com/package/eslint-plugin-ivs)


# Motivation

**pg_dump-split** helps your split a pg_dump (e.g. *databse.sql*) file into smaller chunk.
As for today, only data queries (COPY XXX ) are extracted, with each table data in a dedicated file.


# API/example

```
var splitter = require('pg_dump-split');
await splitter.split("database.sql");

/** you can now find 
* out/sometable.sql
* out/some_othertable.sql
* ...
*/


you can also use [cnyks](https://github.com/131/cnyks)

```
cnyks pg_dump-split --ir://run=split --file_path=database.sql
```






# Credits 
* [131](https://github.com/131)
