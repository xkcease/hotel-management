const path = require('path');

module.exports = {
    devServer: {
        port: 9090,
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'scss',
            patterns: [path.resolve(__dirname, './src/assets/scss/index.scss')],
        },
    },
    chainWebpack(config) {
        config.module
            .rule('svg')
            .exclude.add(path.join(__dirname, 'src/icons'))
            .end();
        //     .uses.clear()
        // config.module.rules.delete('svg');

        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(path.join(__dirname, 'src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]',
            })
            .end();
    },
};
