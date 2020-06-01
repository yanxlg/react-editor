/**
 * 待 optimize
 *  - @ant-design/icons
 */
import { defineConfig } from 'umi';

const shajs = require('sha.js');

const dev = process.env.NODE_ENV !== 'production';

const config = defineConfig({
    hash: true,
    devtool: dev ? 'source-map' : false,
    antd: {},
    cssModulesTypescriptLoader: {
        mode: 'emit',
    },
    dva: {
        hmr: true,
    },
    title: '@editor+',
    ignoreMomentLocale: true, // 简化moment.js locale
    locale: {
        antd: true, // 需要设置为true，否则antd会使用默认语言en-US
        title: false,
        default: 'zh-CN',
        baseNavigator: false,
    },
    extraBabelPlugins: [
        'babel-plugin-lodash',
        [
            'babel-plugin-import',
            {
                libraryName: 'lodash',
                libraryDirectory: '',
                camel2DashComponentName: false,
            },
            'lodash',
        ],
        [
            'babel-plugin-import',
            {
                libraryName: 'react-components',
                camel2DashComponentName: false,
                customName: (name: string) => {
                    if (/^use/.test(name)) {
                        return `react-components/es/hooks/${name}`;
                    }
                    return `react-components/es/${name}`;
                },
            },
            'react-components',
        ],
    ],
    cssLoader: {
        localsConvention: 'camelCaseOnly',
        modules: {
            auto: /[a-zA-Z\.\-_0-9]+\.module\.less$/, // 仅符合要求的文件生成module，减少code体积
            getLocalIdent: (
                context: {
                    resourcePath: string;
                },
                _: string,
                localName: string,
            ) => {
                const { resourcePath } = context;

                if (/[a-zA-Z\.\-_0-9]+\.module\.less$/.test(resourcePath)) {
                    const match =
                        resourcePath.match(/src(.*)/) || resourcePath.match(/node_modules(.*)/);
                    if (match && match[1]) {
                        const hash = shajs('sha256')
                            .update(resourcePath)
                            .digest('hex')
                            .substr(0, 8); //最大长度

                        return `${localName.replace(/([A-Z])/g, '-$1').toLowerCase()}_${hash}`;
                    }
                    // support node_modules
                }
                return localName;
            },
        },
    },
    proxy: {
        '/api': {
            target: 'https://scm-api-t2.vova.com.hk/',
            // target: 'http://192.168.120.17:3026',
            changeOrigin: true,
            pathRewrite: { '^/api': '' },
        },
    },
});

export default config;
