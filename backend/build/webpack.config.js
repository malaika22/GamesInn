"use strict";
const CopyPlugin = require("copy-webpack-plugin");
const { env } = require("process");
let source = "";
let dest = process.cwd() + `/build/environments/environment.json`;
console.log(env.NODE_ENV);
console.log(env.NODE_ENV);
switch (env.NODE_ENV) {
    case 'staging':
        source = process.cwd() + `/environments/environment.${env.NODE_ENV}.json`;
        break;
    case 'prod':
        source = process.cwd() + `/environments/environment.${env.NODE_ENV}.json`;
        break;
    case 'uat':
        source = process.cwd() + `/environments/environment.${env.NODE_ENV}.json`;
        break;
    case 'local':
        source = process.cwd() + `/environments/environment.json`;
        break;
}
console.log(source);
module.exports = {
    entry: source,
    mode: "production",
    module: {
        rules: [{
                test: /\.json$/i,
                loader: 'file-loader',
                type: 'javascript/auto'
            }],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: source, to: dest }
            ],
        }),
    ],
};
//# sourceMappingURL=webpack.config.js.map