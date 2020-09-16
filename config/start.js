const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const path = require('path');
const open = require('open');

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const PORT = process.env.PORT || 6061;
const HOST = process.env.HOST || '0.0.0.0';

const config = require('./webpack.dev.js');

const options = {
  contentBase: path.resolve(__dirname, 'dist'),
  hot: true,
  host: HOST,
  quiet: true,
  publicPath: '/',
  compress: true,
  overlay: false,
  historyApiFallback: {
    // https://github.com/facebook/create-react-app/issues/387.
    disableDotRule: true
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: /node_modules/
  },
  disableHostCheck: true
};

WebpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new WebpackDevServer(compiler, options);

server.listen(PORT, HOST, err => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);
    return;
  }
  open(`http://localhost:${PORT}`);
});
