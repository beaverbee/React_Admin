const {override,fixBabelImports}=require('customize-cra')


// 根据antd实现按需打包 根据import指令打包(babel-plugin-import)
module.exports=override(
    fixBabelImports('import',{
        libraryName:'antd',
        libraryDirectory:'es',
        style:'css',
    }),
);