const path = require('path')

function resolve (dir) {
  return path.join(__dirname, dir)
}
// 修改配置需重启项目
module.exports = {
  assetsDir: 'static',
  productionSourceMap: false,
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '继续教育处综合办理平台'
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  }
}
