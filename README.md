```bash
  npm i --save-dev swagger-ts-plugin
```

```bash
  yarn add --dev swagger-ts-plugin
```
### `Plugins`
***
### links 
[github](https://github.com/AugustEnd/swagger-ts-plugin)

### Usage

该插件根据 swagger 提供的 api-doc 返回的接口数据，生成前端写 ts 所需的接口定义。
如果你正在使用用 ts 并且后端接口文档是 swagger 的话，这个插件适合你

**webpack.config.js**

```js
const Swapper2TsPlugin = require("swagger-ts-plugin");
/**
 * outputPath 输出地址
 * appUrl 必须是贵公司的eureka所有服务列表地址 http://eureka.dev.com:1111/eureka/apps 当前地址返回的是xml格式数据，插件会处理
 */
module.exports = {
    plugins: [
        new Swapper2TsPlugin({
            outputPath: path.resolve(__dirname, "../"),
            serverList: ["trialpartner-web", "sms-service"],
            // 必须提供 http://eureka.dev.com:1111(eureka地址)+ /eureka/apps
            appUrl: "http://eureka.dev.com:1111/eureka/apps",
        }),
    ],
};
```

### output

```txt
├── swagger2ts
	├── [serviceName1]
        ├── interface.d.ts
        └── paths.ts
	├── [serviceName2]
        ├── interface.d.ts
        └── paths.ts
	└── ...
```

```ts
// 文件 [service1]/paths.d.ts;

import { AnswerDTO } from "./interface.d";
interface pathsObj {
    "/calendar/deleteCalendarNoticeRecord": {
        method: "delete";
        data: AnswerDTO;
    };
}

// 文件 [service1]/interface.d.ts;
// 生成如下interface和注释
/**
 * @param answerContent (string) 回答内容
 * @param answerPersonId (string) 回答人id
 * @param answerPersonName (string) 回答人名称
 * @param answerPersonType (number) 回答人类型：1-受试者；2-CRC
 * @param attachment (string) 附件
 * @param authUserRoleDto (用户角色关系) 角色信息
 * @param createTime (string) 回答时间
 * @param id (string) 主键id
 * @param operation (boolean) 是否可操作：true-是；false-否
 * @param projectId (string) 项目id
 * @param questionId (string) 问题id
 * @param siteId (string) 中心id
 * @param sourceSystem (string) 外部系统标识
 * @param subjectInfoDTO (SubjectInfoDTO) 受试者信息
 */
export interface AnswerDTO {
    answerContent: string | null;
    answerPersonId: string | null;
    answerPersonName: string | null;
    answerPersonType: number | null;
    attachment: string | null;
    authUserRoleDto: 用户角色关系;
    createTime: string | null;
    id: string | null;
    operation: boolean | null;
    projectId: string | null;
    questionId: string | null;
    siteId: string | null;
    sourceSystem: string | null;
    subjectInfoDTO: SubjectInfoDTO;
}
```

|         Name          |                               Type                                |                  Default                   | Description                                                                                      |
| :-------------------: | :---------------------------------------------------------------: | :----------------------------------------: | :----------------------------------------------------------------------------------------------- |
| **[`outputPath`](#)** |                            `{String}`                             |   `{path.resolve(__dirname, "../../")}`    | 生成 ts 文件输入的文件夹位置                                                                     |
| **[`serverList`](#)** | `{Array<{serviceName: string;serviceUrl:string;}>,Array<string>}` |                    `[]`                    | 当前字段必传如果穿数组字符串['sms-service'] 后端服务名，如果是字符串对象，必传服务名称和服务地址 |
|   **[`appUrl`](#)**   |                            `{String}`                             | `"http://eureka.dev.com:1111/eureka/apps"` | 后端所有服务注册信息                                                                             |
