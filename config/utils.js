const path = require('path');
const fs = require('fs');

// 执行node命令时候的文件绝对路径
const root = process.cwd();

/**
 * 从根目录开始获取文件绝对地址路径
 * @param filePath 文件参数
 * @returns {string} 返回绝对路径
 */
function getProjectPath(...filePath) {
  return path.join(root, ...filePath);
}

const appDirectory = fs.realpathSync(root);

const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment() {
  const raw = Object.keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        BABEL_ENV: process.env.BABEL_ENV || 'development'
      }
    );
  // DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {})
  };
  return { raw, stringified };
}

module.exports = {
  getProjectPath,
  resolve: relativePath => path.resolve(appDirectory, relativePath),
  getClientEnvironment
};
