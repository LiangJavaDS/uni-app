module.exports = {
    // 解决uni-transition不能用的问题，原因是cli项目下node_modules下的组件不会自动编译，所以有些条件编译失效，按如下配置可以让组件加入uni-app编译，见issues链接：https://github.com/dcloudio/uni-ui/issues/329
    transpileDependencies: ['@dcloudio/uni-ui']
}