![dscopy.js](https://raw.github.com/ashwinrayaprolu1984/dscopyjs/master/img/dscopyjs.png)

[http://dscopyjs.org](http://dscopyjs.org)

dscopy.js is an Datasource copy library for JavaScript and Node.js. 
It features any datasource to any datasource copier. This take take any datasource as input and create insert/delete/update statements that can be run on any target datasource

## Features

- Support reading various datasources ,  RDBMS, NoSQL, FTP, FILES
- Contains a flexible expression parser.
- Supports chained operations.
- Comes with a large set of built-in functions and constants.
- Has no dependencies. Runs on any JavaScript engine.
- Can be used as a command line application as well.
- Is easily extensible.


## Usage

dscopy.js can be installed using npm or bower, or by [downloading](http://dscopyjs.org/download.html) the library.
The library can be used in both node.js and in the browser.
See the [Getting Started](http://dscopyjs.org/docs/getting_started.html) for a more detailed tutorial. To install dscopy.js using npm:

    npm install dscopyjs

dscopy.js can be used similar to JavaScript's built-in dscopy library. Besides that,
dscopy.js can evaluate
[expressions](http://dscopyjs.org/docs/expressions.html)
and supports
[chained operations](http://dscopyjs.org/docs/chained_operations.html).

```js
// load dscopy.js
var dscopy = require('dscopyjs');

// functions and constants

// chaining
dscopy.from("datasource1")
    .includeTables("test")
    .copy("test")
    .done(); //
```


## Documentation

- [Getting Started](http://dscopyjs.org/docs/getting_started.html)
- [Examples](http://dscopyjs.org/examples/index.html)
- [Overview](http://dscopyjs.org/docs/index.html)
- [History](http://dscopyjs.org/history.html)


## Build

First clone the project from github:

    git clone git://github.com/ashwinrayaprolu1984/dscopyjs.git
    cd dscopyjs

Install the project dependencies:

    npm install

Then, the project can be build by executing the build script via npm:

    npm run build

This will build the library dscopy.js and dscopy.min.js from the source files and
put them in the folder dist.


## Test

To execute tests for the library, install the project dependencies once:

    npm install

Then, the tests can be executed:

    npm test

To test code coverage of the tests:

    npm run coverage

To see the coverage results, open the generated report in your browser:

    ./coverage/lcov-report/index.html




## License

Copyright (C) 2013-2015 Ashwin Rayaprolu <ashwinrayaprolu1984@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
