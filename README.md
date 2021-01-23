```bash
  npm i --save-dev @tms/swagger2ts-plugin
```

```bash
  yarn add --dev @tms/swagger2ts-plugin
```

### `Plugins`

### Usage

该插件根据 swagger 提供的 api-doc 返回的接口数据，生成前端写 ts 所需的接口定义。

**webpack.config.js**

```js
const Swapper2TsPlugin = require("@tms/swagger2ts-plugin");

module.exports = {
    entry: "index.js",
    output: {
        path: __dirname + "/dist",
        filename: "index_bundle.js",
    },
    plugins: [
        new Swapper2TsPlugin({
            outputPath: path.resolve(__dirname, "../"),
            serverList: ["trialpartner-web", "sms-service"],
        }),
    ],
};
```

|         Name          |                               Type                                |                  Default                   | Description                                                                                                                 |
| :-------------------: | :---------------------------------------------------------------: | :----------------------------------------: | :-------------------------------------------------------------------------------------------------------------------------- |
| **[`outputPath`](#)** |                            `{String}`                             |   `{path.resolve(__dirname, "../../")}`    | 生成 ts 文件输入的文件夹位置                                                                                                |
| **[`serverList`](#)** | `{Array<{serviceName: string;serviceUrl:string;}>,Array<string>}` |                    `[]`                    | 当前字段必传如果穿数组字符串['sms-service'] 后端服务名，如果是字符串对象，必传服务名称和服务地址                            |
|   **[`appUrl`](#)**   |                            `{String}`                             | `"http://eureka.dev.com:1111/eureka/apps"` | 后端所有服务注册信息                                                                                                        |
|  **[`fileName`](#)**  |                            `{string}`                             |          `"[name].swagger2.d.ts"`          | 每个服务输出的文件名称默认【[服务 mingc].自定义.d.ts。 请满足当前正则 new RegExp(/^[a-zA-Z0-9]_\[\S_\][a-zA-Z0-9]\*.d.ts$/) |
