const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const { getProjectPath, getClientEnvironment } = require('./utils');

const pkg = require(getProjectPath('package.json'));

const happyThreadPool = HappyPack.ThreadPool({ size: 5 });

const env = getClientEnvironment();

function getStyleLoaders({ isProd, isServer, isHotServer, isSass }) {
  const result = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
              grid: true
            },
            stage: 3
          })
        ],
        sourceMap: false
      }
    }
  ];

  if (isSass) {
    result.push({
      loader: 'sass-loader'
    });
  }

  if ((isProd || isHotServer) && !isServer) {
    result.unshift({
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: !isProd
      }
    });
  }

  if (!isProd && !isHotServer) {
    result.unshift({
      loader: 'style-loader'
    });
  }

  return result;
}

module.exports = (isServer, isHotServer) => {
  const isProd = process.env.NODE_ENV === 'production';

  const result = {
    // 原始源代码（仅限行）定位到原始代码问题，比source-map 快，但是没有列映射(column mapping)的 source-map
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    // 会将 process.env.NODE_ENV 的值设为 development, 告知 webpack 使用相应模式的内置优化
    mode: isProd ? 'production' : 'development',
    // 配置各种loader
    module: {
      // 警告替换为Error
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|ts|tsx)$/,
          exclude: /node_modules/,
          enforce: 'pre',
          use: [
            {
              options: {
                // eslint-disable-next-line import/no-extraneous-dependencies
                formatter: require('eslint-friendly-formatter'),
                eslintPath: require.resolve('eslint'),
                emitWarning: true,
                emitError: false,
                quiet: true
              },
              loader: 'eslint-loader'
            }
          ]
        },
        {
          oneOf: [
            {
              test: /\.(js|ts|tsx)$/,
              exclude: /node_modules/,
              use: 'happypack/loader?id=jsbabel'
            },
            {
              test: /\.(scss|sass)$/,
              use: getStyleLoaders({ isProd, isServer, isHotServer, isSass: true })
            },
            {
              test: /\.(css)$/,
              use: getStyleLoaders({ isProd, isServer, isHotServer })
            },
            {
              test: [/\.jpe?g$/, /\.png$/, /\.bmp$/, /\.gif$/],
              loader: 'url-loader',
              options: {
                limit: 1024,
                name: 'static/[name].[chunkhash].[ext]'
              }
            }
          ]
        }
      ]
    },
    resolve: {
      // 设置路径别名
      alias: {
        src: getProjectPath('src')
      },
      // 文件后缀自动补全
      extensions: ['.tsx', '.ts', '.js', 'scss', 'css']
    },
    plugins: [
      new webpack.DefinePlugin(env.stringified),
      new HappyPack({
        id: 'jsbabel',
        verbose: false,
        threadPool: happyThreadPool,
        loaders: ['babel-loader?cacheDirectory=true']
      }),
      new ProgressBarPlugin({
        // eslint-disable-next-line no-useless-concat
        format: 'build [:bar] ' + ':percent' + ' (:elapsed seconds)',
        clear: false
      }),
      // 为每个打包的文件头部添加 banner（版权和版本信息等）
      new webpack.BannerPlugin(`${pkg.name} v${pkg.version}`)
    ]
  };

  if ((isProd || isHotServer) && !isServer) {
    result.plugins.push(
      new MiniCssExtractPlugin({
        filename: isHotServer ? 'css/[name].css' : 'css/[name].[contenthash].css',
        allChunks: !isHotServer,
        ignoreOrder: true
      })
    );
  }

  if (isProd && !isServer) {
    result.optimization = {
      minimize: true
    };
  }

  return result;
};
