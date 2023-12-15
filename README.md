# node-event-bus
Node SSE

## 介绍
基于Node.js SSE(Server-Sent Events)的事件总线，用于解决跨页面、跨域、跨端的通信问题。

## 接口文档

### 1. 订阅事件

#### 1.1 接口地址
```
GET /sub
```

#### 1.2 接口描述

订阅事件，当事件触发时，会向客户端推送事件数据。订阅成功后，服务器会首先返回一个初始化事件，包含订阅的唯一标识符（ID）。

```json
{"event": "Init", "id": "<unique_id>"}
```

在订阅成功后，服务器将通过事件总线（EventEmitter）监听 'pub' 事件，并将发布的数据发送给客户端。

```json
{"event": "Pub", "data": "<published_data>", "id": "<unique_id>"}
```

#### 1.3 请求参数
无

### 2.发布事件

#### 2.1 接口地址
```
POST /pub/:id
```

#### 2.2 接口描述
此接口用于向特定订阅者发布事件。

#### 2.3 请求参数

路径参数：
id (必需): 订阅者的唯一标识符。由订阅时返回。

请求体参数：
能够被JSON.stringify()序列化的任意数据。

#### 2.4 接口返回
发布成功时返回以下响应：
```json
{
    "message": "ok",
    "success": true
}

```
如果订阅者ID不存在或者无效，将返回以下错误响应：

```json
{
    "message": "Id not Found!",
    "success": false
}
```

### 3.探活
#### 3.1 接口地址

```
GET /ping
```
#### 3.2 接口返回
```text
pong
```

## 演示demo

### 1. 启动服务
```
npm run start
```

### 2. 打开浏览器
```
http://localhost:3000/demo.html
```