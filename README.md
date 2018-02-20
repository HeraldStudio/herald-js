# herald-js

小猴偷米 WebService3 配套前端 SDK

## 安装

```bash
yarn add herald-js  # or 'npm install herald-js'
```

## 试用

使用非常好用的 REPL 来试用 herald-js。

```bash
npm run dev
```

## 编译

使用下列命令来编译和发布新版本。

```bash
npm run build
yarn publish
```

## 调用

```javascript
let H = require('herald-js')({
  // config here
})

async function demo () {

  // 获取教务通知
  let jwc = await H.api.jwc() // 或 await H.api.jwc.get()，省略时默认均为 get 请求
  for (let notice in jwc) {
    console.log(k.title)
  }

  // 处理异常
  try {
    let jwc = await H.api.jwc()
  } catch (e) {
    console.log(e.message)
  }

  // 登录并获取
  await H.auth.post({ cardnum: '一卡通号', password: '密码', platform: '平台标识符' })
  console.log(H.token)
  // 可通过 H.token = ... 直接凭 token 切换用户身份

  // 获取一卡通
  let card = await H.api.card()
  console.log(card.info.balance)
}
```

## 配置项

默认配置项及各配置项的说明如下：

```javascript
const config = {

  // 会话名，若需要同时维护多个会话实例，可通过会话名进行区分
  sessionName: 'default',

  // WebService3 后端地址，要求以斜杠结尾
  baseURL: 'https://boss.myseu.cn/ws3/',

  // HTTP 请求代理者
  // 默认使用 axios，也可自行代理，使用各平台特定的 API，如 fetch，小程序的 wx.request 等
  // herald-js 对传入的四个参数进行了规范化，完全符合 HTTP 标准，兼容性强：
  // 1. method 为大写；
  // 2. body 为编码好的字符串；
  // 3. 若为 GET/DELETE 请求，请求体自动拼接到 url 上，body 为 null；
  // 4. headers 为 object。
  // 实现此函数时，请直接返回响应报文中的 body 部分，也可进行 JSON 解析。
  requestDelegate: async (url, method, headers, body) => {
    return (await require('axios')({ url, method, headers, data: body })).data
  },

  // 持久化存储代理者
  // 默认使用 Cookie（可兼容含微信 Web 在内的 Web 全平台）
  // 也可自行代理，使用各平台特定的 API，如 asyncStorage，小程序的 wx.get/setStorage 等
  // 若直接设置为成假值（例如 storageDelegate: false），表示不需要做持久化
  // herald-js 对传入的参数进行了规范化，类型均为字符串，兼容性强。
  storageDelegate: {
    async set (key, value) {
      return require('js-cookie').set(key, value)
    },

    // 若该 key 未设置过 value，请保证 get 返回为成假值（null/undefined/false/'' 等）
    async get (key) {
      return require('js-cookie').get(key)
    }
  },

  // 登录事件，参数为新的 token
  // 调用 herald(config) 时，将开始首次检查持久化存储中是否已登录，若已登录，会触发 onLogin()；
  // 调用 H.auth.post(...) 进行登录时，若登录成功，会触发 onLogin()；
  // 调用 H.token = '...' 强制切换用户时，若 token 成真，会触发 onLogin()。
  onLogin (newToken) {},

  // 登出事件，参数为旧的 token
  // 调用 H.deauth() 或 H.token = <成假值> 进行登出时，会触发 onLogout()；
  // 任何 onLogin() 事件之前都会先判断是否已登录，若已登录，均会先触发 onLogout()。
  onLogout (oldToken) {},

  // 错误处理事件，参数为 API 返回的错误对象 { success: false, code: number, reason: string }
  // 该事件的返回值也就决定了 API 调用者在遇到错误时收到的返回值。
  // 默认为抛出一个异常。
  onError (res) {
    let e = new Error(res.reason)
    e.code = res.code
    throw e
  }
}
```
