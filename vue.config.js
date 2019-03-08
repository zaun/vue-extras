module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-extras/' : '/',
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.txt$/i,
          use: 'raw-loader',
        }
      ]
    }
  }
}