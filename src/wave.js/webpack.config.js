const path  = require('path')

module.exports = {
  mode: "production",
  entry: "./src",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js',
  },
  target: 'node'
}