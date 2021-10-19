# v2.0.13

## 修改

入参中的 serviceName 转小写。同时http://eureka.xxx.com:1111/eureka/apps中返回的列表中服务名称全部转小写

```js
serverList: ["SIGNCERT-SERVICE",{serviceName:'ABC',serviceUrl: "http://172.20.37.153:8000/"}]
// =>
serverList: ["signcert-service",{serviceName:'abc',serviceUrl: "http://172.20.37.153:8000/"}],

```
