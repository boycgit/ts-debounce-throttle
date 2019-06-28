# ts-debounce-throttle

[![Build Status](https://travis-ci.org/boycgit/ts-debounce-throttle.svg?branch=master)](https://travis-ci.org/boycgit/ts-debounce-throttle) [![Coverage Status](https://coveralls.io/repos/github/boycgit/ts-debounce-throttle/badge.svg?branch=master)](https://coveralls.io/github/boycgit/ts-debounce-throttle?branch=master) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php) [![npm version](https://badge.fury.io/js/ts-debounce-throttle.svg)](https://badge.fury.io/js/ts-debounce-throttle)

Typescript Version of debounce and throttle
 - fully migrate from [lodash v4.17.5 - debounce & throttle](https://lodash.com/docs/4.17.11#debounce)
 - rewritten with Typescript
 - fully tested

为了仅仅使用 [lodash](https://lodash.com/docs/4.17.11#debounce) 中的 `debounce` 和 `throttle` 这两个函数的 TS 版本，在社区库库找了半天没有找到，于是只能自己动手将其迁移成 Typescript 版本；

这两个函数的功能完全对齐 [lodash](https://lodash.com/docs/4.17.11#debounce) 中的 `debounce` 和 `throttle` 中的功能，也就是说其 API 和 lodash 中保持一致，可以直接参考官方文档的使用：
 - [lodash - debounce](https://lodash.com/docs/4.17.11#debounce) 
 - [lodash - throttle](https://lodash.com/docs/4.17.11#throttle) 

> 迁移的时候，使用的是 lodash v 4.17.5 版本源码，不过考虑到这两个函数已经很稳定，所以 lodash 的版本升级对这个两个函数的影响很有限；


## Installation

### Node.js / Browserify

```bash
npm install ts-debounce-throttle --save
```

```javascript
const {debounce, throttle} = require('ts-debounce-throttle');

// Avoid costly calculations while the window size is in flux.
jQuery(window).on('resize', _.debounce(calculateLayout, 150));

// Avoid excessively updating the position while scrolling.
jQuery(window).on('scroll', _.throttle(updatePosition, 100));

```

### Global object

Include the pre-built script.

```html
<script src="./dist/index.umd.min.js"></script>

<script>
const {debounce, throttle} = window.debounceThrottle;

// Avoid costly calculations while the window size is in flux.
jQuery(window).on('resize', _.debounce(calculateLayout, 150));
// Avoid excessively updating the position while scrolling.
jQuery(window).on('scroll', _.throttle(updatePosition, 100));

</script>
```

## Build & test

```bash
npm run build
```

```bash
npm test
```

## License

[MIT](LICENSE).
