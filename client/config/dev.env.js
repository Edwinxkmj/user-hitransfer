'use strict'
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');

/*开发环境*/
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // API_HOST:'"http://user.skycar-ride.com"' // 测试
  API_HOST:'"https://user.hi-transfer.com/"' //正式
});
