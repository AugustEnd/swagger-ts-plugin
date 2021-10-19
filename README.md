```bash
  npm i --save-dev swagger-ts-plugin
```

```bash
  yarn add --dev swagger-ts-plugin
```

---

<a href="https://github.com/AugustEnd/swagger-ts-plugin" target="\_parent"><img src="https://img.shields.io/github/stars/AugustEnd/swagger-ts-plugin.svg?style=social&label=Star"/></a>

### 参数

|          Name          |                            Type                            |                  Default                   | Description                                                                                      |
| :--------------------: | :--------------------------------------------------------: | :----------------------------------------: | :----------------------------------------------------------------------------------------------- |
| **[`*serverList`](#)** | `{Array<{serviceName: string;serviceUrl:string;},string>}` |                    `[]`                    | 当前字段必传如果穿数组字符串['sms-service'] 后端服务名，如果是字符串对象，必传服务名称和服务地址 |
| **[`outputPath`](#)**  |                         `{String}`                         |              `根目录/swagger`              | 生成 ts 文件输入的文件夹位置                                                                     |
|   **[`appUrl`](#)**    |                         `{String}`                         | `"http://eureka.dev.com:1111/eureka/apps"` | 后端所有服务注册信息                                                                             |

### 配置

该插件根据 swagger 提供的 api-doc 返回的接口数据，生成前端写 ts 所需的接口定义。
如果你正在使用 ts 并且后端接口文档是 swagger 的话，这个插件适合你

**webpack.config.js**

```js
const Swapper2TsPlugin = require("swagger-ts-plugin");
/**
 * outputPath 输出地址
 * appUrl 必须是贵公司的eureka所有服务列表地址 http://eureka.dev.com:1111/eureka/apps 当前地址返回的是xml格式数据，插件会处理
 */
// 第一种使用方式
module.exports = {
    plugins: [
        new Swapper2TsPlugin({
            serverList: [
                "trialpartner-web",
                "sms-service",
                {
                    serviceName: "xxx-service",
                    serviceUrl: "http://172.20.37.153:8000/",
                },
            ],
            // 测试环境使用http://eureka.test.com:1111/eureka/apps
            appUrl: "http://eureka.dev.com:1111/eureka/apps",
        }),
    ],
};

// 第二种使用方式
// 因为插件也直接暴露出build方法，开发者可以直接调用
// npm scripts 增加一条命名，"build:ts":"node xxx.js";

// 创建一个xxx.js;
new Swapper2TsPlugin({
    /* 配置 */
}).build();

// cmd bash powershell等终端中 运行yarn build:ts或者 npm run build:ts;
```

### 输出

```txt
├── swagger2ts
	├── [serviceName1]
        ├── function.ts
        ├── interface.d.ts
        └── paths.ts
	├── [serviceName2]
        ├── function.ts
        ├── interface.d.ts
        └── paths.ts
    ├── ...
    ├── request.ts
	└── translation.json
```

### 使用

```typescript
// test.ts 这里的地址根据生成的swagger2ts文件
import request from "xxx/swagger2ts/request.ts";
import tmsRequest from "axios";

let http = tmsRequest.create({
    timeout: 500000,
    baseURL: "/api/",
});

const API = request(http);
// 走网关 请求
API["服务名称"]["后端接口地址"]("参数").then((val) => {});

// 例
const msg = API.smsService["/homeMenu/getHomeMenuList"]({
    body: {
        projectId: "xxx",
        siteId: "xxx",
        subjectInfoId: "xxx",
    },
}).then((val) => {});
```

### 请求参数

#### params.body

如果入参需要 body 参数，对应的 post 请求 body

#### params.path

如果入参需要 path 参数，对应后端动态路由，例如/api/getFileId/{fileId};

#### params.query

如果入参需要 query 参数，对应 url 后面拼接的参数

#### params.formData

上传文件，这里暂时没处理好
