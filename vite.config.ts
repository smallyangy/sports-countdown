import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoprefixer from 'autoprefixer';
import postcsspxtoviewport from 'cnjm-postcss-px-to-viewport';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    server: {
        host: '0.0.0.0',
        port: 8808,
    },
    css: {
        postcss: {
            plugins: [
                autoprefixer({
                    overrideBrowserslist: [
                        'Android 4.1',
                        'iOS 7.1',
                        'Chrome > 31',
                        'ff > 31',
                        'ie >= 8',
                    ],
                }),
                // 修改插件名称
                postcsspxtoviewport({
                    unitToConvert: 'px', // 要转化的单位
                    viewportWidth: 750, // UI设计稿的宽度
                    unitPrecision: 6, // 转换后的精度，即小数点位数
                    propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
                    viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
                    fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
                    selectorBlackList: ['ignore'], // 指定不转换为视窗单位的类名，
                    minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
                    mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
                    replace: true, // 是否转换后直接更换属性值
                    exclude: [], // 设置忽略文件，用正则做目录名匹配
                    landscape: false, // 是否处理横屏情况
                    // 如果没有使用其他的尺寸来设计，下面这个方法可以不需要，比如vant是375的
                    customFun: ({ file }) => {
                        // 这个自定义的方法是针对处理vant组件下的设计稿为375问题
                        const designWidth = path
                            .join(file)
                            .includes(path.join('node_modules', 'vant'))
                            ? 375
                            : 750;
                        return designWidth;
                    },
                }),
            ],
        },
    },
});
