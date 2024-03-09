const { defineConfig } = require('@vue/cli-service');
const BundleTracker = require("webpack-bundle-tracker");
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },
  // that’s where django-webpack-loader will redirect the path to the bundle, 
  // so we end up with a final url that’s plain weird (“http://0.0.0.0:8288/http://0.0.0.0:8288). 
  // That’s the workaround, we set the devServer public url back to http://0.0.0.0:8288
  publicPath: "http://0.0.0.0:8288/",
  outputDir: './dist/',
  

  chainWebpack: config => {
    config.optimization.splitChunks(false); // So that webpack generate only one javascript file.
    config
      .plugin('BundleTracker')
      // Generate the webpack-stats.json in the project frontend folder. 
      // This is where the WEBPACK_LOADER config in settings.py should point to.
      .use(BundleTracker, [{ filename: 'webpack-stats.json', path: '../frontend/' }]);
    config.resolve.alias.set('__STATIC__', 'static');
    config.devServer
      .host('0.0.0.0')
      .port(8288)
      .hot(true)
      .https(false)
      .open(true)
      .headers({ "Access-Control-Allow-Origin": ["*"] });
  }
});
