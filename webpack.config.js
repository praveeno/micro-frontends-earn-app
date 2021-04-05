process.env.NODE_ENV = process.env.APPMODE;

const config = require('config');
const _ = require('lodash');
const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
const autoprefixer = require('autoprefixer');
const path = require('path')
const webpack = require('webpack');

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "topcoder",
    projectName: "micro-frontends-earn-app",
    webpackConfigEnv,
    disableHtmlGeneration: true,
  });

  let cssLocalIdent;
  if (process.env.APPMODE == 'development') {
    cssLocalIdent = 'earn_[path][name]___[local]___[hash:base64:6]';
  } else {
    cssLocalIdent = '[hash:base64:6]';
  }

  // modify the webpack config however you'd like to by adding to this object
  return webpackMerge.smart(defaultConfig, {
    // we have to list here all the microapps which we would like to use in imports
    // so webpack doesn't tries to import them
    externals: {
      "@topcoder/micro-frontends-navbar-app": "@topcoder/micro-frontends-navbar-app",
    },
    module: {
      rules: [
        {
          /* Loads jsx */
          test: /\.(jsx?|svg)$/,
          exclude: [
            /node_modules/,
            /[/\\]assets[/\\]fonts/,
            /[/\\]assets[/\\]images/,
          ],
          loader: 'babel-loader',
        },
        {
          /* Loads images */
          test: /\.(svg|gif|jpe?g|png)$/,
          exclude: [
            /[/\\]assets[/\\]fonts/
          ],
          loader: 'file-loader',
          options: {
            outputPath: 'images',
          }
        },
        {
          /* Loads fonts */
          test: /\.(eot|otf|svg|ttf|woff2?)$/,
          exclude: [
            /[/\\]assets[/\\]images/
          ],
          loader: 'file-loader',
          options: {
            outputPath: 'fonts',
          }
        },
        {
          /* Loads scss stylesheets. */
          test: /\.scss/,
          use:  [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: cssLocalIdent,
                    mode: 'local',
                  }
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [autoprefixer],
                  }
                },
              },
              'resolve-url-loader',
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true,
                },
              }
            ]
        },
        {
          /* Loads css stylesheets */
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        }
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          ..._.mapValues(config, (value) => JSON.stringify(value)),
          APPENV: JSON.stringify(process.env.APPENV),
          APPMODE: JSON.stringify(process.env.APPMODE),
        },
      }),
    ],
    resolve: {
      alias: {
        styles: path.resolve(__dirname, "src/styles"),
        assets: path.resolve(__dirname, "src/assets"),
      }
    },
    devServer: {
      port: 8008,
      host: '0.0.0.0'
    }
  });
};