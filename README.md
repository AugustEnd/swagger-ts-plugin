### 一、前言

开始写 swagger2ts 这个包，纯粹只是不想写后端返回的数据的出参定义和注释（interface.d.ts 文件），然后希望通过接口地址能找到这个定义加了 paths 文件（path.ts）。到了第二版中台的同学想把它做成满足公司的数据服务层解决方案，其实就是生成可以直接调用的函数 [视频链接](https://bizsec-auth.alicdn.com/a9b5b21ee64d2b47/Qe9k4XSEr4zqvIg7131/bVGU4B8yjHqHqK5wDbt_304938576763___hd.mp4?auth_key=1618224061-0-0-dfee73b14fffc72810f7c6cd45a49240)

### 二、分析

其实我们再用 swagger 上联调接口（其他工具也类似），你会发现接口的出参，有类型，有注释（如下）。那它这里的数据是怎么得到的呢，打开控制台，network 找到/xx/api-docs, 返回 definitions、paths 等字段。

-   definitions，是生成 interface.d.ts 的数据依赖
-   paths, 是生成 paths.d.ts 文件和 function.ts 文件的数据依赖

### 三、行动起来

-   webpack 插件 [swagger-ts-plugin](https://github.com/AugustEnd/swagger-ts-plugin)
-   vscode 插件 [vscode-swagger2ts-plugin](https://github.com/AugustEnd/vscodeSwagger2tsPlugin)

### 四、插件功能

根据使用者的配置会在配置路径下生成以下（默认配置会在根目录下的 swagger 文件下生成所需文件）

```txt
├── swagger2ts
	├── [serviceName1]
 		├── interface.d.ts
 		├── paths.d.ts
		└── function.ts
	├── [serviceName2]
		├── interface.d.ts
		├── paths.d.ts
		└── function.ts
        ├── [...]
        ├── request.ts
	└── transation.json
```

#### 1. service-xxx/interface.d.ts 文件作用

当前服务下所有的 DTO 的 ts 定义和 tsdoc 注释（如下）

```ts
/**
 * @param answerContent (string) 回答内容
 * @param answerPersonId (string) 回答人id
 * @param subjectInfoDTO (SubjectInfoDTO) 受试者信息
 */
export interface AnswerDTO {
    answerContent: string | null;
    answerPersonId: string | null;
    subjectInfoDTO: SubjectInfoDTO;
}
```

#### 2. service-xxx/paths.d.ts 文件作用

当前服务所有接口地址，及对应的请求方式和出入参类型（来自 interface.d.ts）。
找到接口方便通过 f12(ctrl+单击)跳转到定义

```ts
import { AnswerDTO } from "./interface.d";
interface pathsObj {
    "/calendar/aaa": {
        method: "post";
        parameters: {
            query: any;
        };
        data: Array<AnswerDTO>;
    };
    "/calendar/bbb": {
        method: "post";
        parameters: {
            query: any;
        };
        data: AnswerDTO;
    };
}
```

#### 3. service-xxx/function.ts 文件作用

接收一个 axios 实例或者其他基于 promise 封装的 http 库。给每个接口生成唯一的函数，函数已知接口地址，请求方式，出入参类型。

```ts
/**
 * 备注：获取访视预约提醒列表
 */
export const getSubjectVisitAppointNoticeListUsingPOST = function (
    this: any,
    params: {
        query: { isAppointed: number };
        body: Partial<SubjectVisitAppointDTO>;
    }
): Promise<PageInfo_SubjectVisitOutputDTO> {
    return this.__http.post("/service-xxx" + url, body) as any;
};
```

![interface-paths.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c7e65a24906e4881955502f3a47b8a07~tplv-k3u1fbpfcp-watermark.image)

#### 4. translation.json 文件作用

保存上次翻译的结果，第三方翻译字符总数的限制。

#### 5. request.ts 文件作用

最后用户直接使用的文件，输出一个 API 函数，包含所有服务的调用接口函数

![request.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2f987907665944d481b3af627754d546~tplv-k3u1fbpfcp-watermark.image)

### 配置及使用 (三选一即可)

#### 参数

|          Name          |                            Type                             |                           Default                           | Description                                                                                |
| :--------------------: | :---------------------------------------------------------: | :---------------------------------------------------------: | :----------------------------------------------------------------------------------------- |
| **[`*serverList`](#)** | `{Array<{serviceName: string;serviceUrl:string;}或string>}` |                            `[]`                             | 必传 如果穿数组字符串 ['sms-service'] 后端服务名，如果是字符串对象，必传服务名称和服务地址 |
|   **[`*appUrl`](#)**   |                         `{String}`                          |         `"http://eureka.dev.com:1111/eureka/apps"`          | 必传 后端所有服务注册信息                                                                  |
| **[`outputPath`](#)**  |                         `{String}`                          |            `{path.resolve(__dirname, "../../")}`            | 生成文件输出路径                                                                           |
|    **[`fanyi`](#)**    |                         `{object}`                          | `{baidu: { appid: "xxx",secretKey: "xxxx",maxLimit: 2000}}` | 配置百度翻译 appid 和秘钥，maxLimit 不能超过 2000                                          |

#### 1、webpack 插件使用

**webpack.config.js**

```js
const Swapper2TsPlugin = require("swagger-ts-plugin");
/**
 * outputPath 输出地址
 * appUrl 必须是公司的eureka所有服务列表地址 http://eureka.dev.com:1111 + /eureka/apps
 * 当前地址返回的是xml格式数据，插件会处理
 */
// 原本想解析项目中的所有文件夹，自动的检查出服务名称，服务地址，实际做的时候发现不是很好做
// 所有它实际上不算一个webpack插件，
module.exports = {
    plugins: [
        new Swapper2TsPlugin({
            outputPath: path.resolve(__dirname, "../"),
            // v1.1.11 以后支持这种混合类型
            serverList: [
                "trialpartner-web",
                "sms-service",
                {
                    serviceName: "xxx-service",
                    serviceUrl: "http://172.12.12.111:8001/",
                },
            ],
            // 如果serverList中只提供服务名称，则必须提供 http://eureka.dev.com:1111(eureka地址)+ /eureka/apps
            appUrl: "http://eureka.dev.com:1111/eureka/apps",
        }),
    ],
};
```

#### 2、作为工具使用（偷懒没做 cli ^o^）

```js
// 因为swagger-ts-plugin插件也直接暴露出build方法，开发者可以直接调用
// npm scripts 增加一条命名，"build:ts":"node xxx.js";

// 创建一个xxx.js;
new Swapper2TsPlugin({
    /* 配置，如上 */
}).build();

// 执行 yarn build:ts就能run起来了
```

#### 3、vscode 插件(目前还是版本 1，后面陆续升级)

1. vscode 插件市场找到 vscode-swagger2ts-plugin 安装

2. 配置，请打开 文件-> 首选项 -> 设置， 找到 swagger-ts-plugin;

-   请配置 eureka 服务列表的接口 appUrl，如 http://eureka 地址/eureka/apps
-   请配置服务名称和服务对象（如下）。

```js
// vscode插件是每项单独配置，这里的配置等同于serverList
"swagger-ts-plugin.serviceList": [
    {
        "serviceName": "xxx-service",
        "serviceUrl": "http://172.20.37.153:8000/",
    },
    "sms-service"
]
```

3. 使用 ctrl+shift+p 打开 Command Palette，输入 swagger2ts 回车。

4. 请注意如果是新开的 vscode 窗口未选择文件是不会有任何文件生成。如果你的配置没有问题，当前窗口也选择了文件项目。你将在文件根目录得到一个 swagger2ts 文件夹，包含多个子文件夹数量等于配置的服务数量。

5. vscode 插件额外给根目录的.gitignore 文件添加忽略/swagger2ts 的配置。

### 已完成功能

-   [x] 输入定义部分 interface.d.ts。
-   [x] 接口对应的出入参，请求方式等 paths.d.ts。
-   [x] 生成可直接调用的函数 function.ts。
-   [x] 最后导出 API 函数 request.ts。
-   [x] 定义名称包含中文部分，使用翻译转成英文。
-   [x] 兼容 swagger3.0(还不完善)。
-   [x] 根据 required 字段，给定义添加字段是否可选

### 后续需要完善的内容

-   [ ] vscode 插件升级到 2.0。
-   [ ] serviceList 中服务名称目前区分大小写，后面忽略大小写
-   [ ] 返回的函数 catch 部分还没完善
-   [ ] 配置 controller,只输出自己想要的函数。
-   [ ] 完成 未使用函数 tree shaking

### 最后

第一次写文章,有很多不足的地方，有任何建议可以找我邮箱1543259203@qq.com。

如果觉得还好的话，给个 ⭐️⭐️ 谢谢啦~
[swagger-ts-plugin](https://github.com/AugustEnd/swagger-ts-plugin)

[vscode-swagger2ts-plugin](https://github.com/AugustEnd/vscodeSwagger2tsPlugin)
