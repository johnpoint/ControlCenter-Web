# ControlCenter-Web

## 项目仓库列表

- [ControlCenter-Server 主控](https://github.com/johnpoint/ControlCenter-Server)
- [ControlCenter-Client 被控端](https://github.com/johnpoint/ControlCenter-Client)
- [ControlCenter-Web 前端](https://github.com/johnpoint/ControlCenter-Web)

## Project setup
```
yarn
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration

See `@/config.e.js` and run `cp config.e.js config.js`

```javascript
export default {
    apiAddress: "http://127.0.0.1:1323",
    menu: [
        {title: "Home", url: "/"},
        {title: "Server", url: "/Server"},
        {title: "Certificate", url: "/Certificate"}
    ],
    command: {
        upgrade: 5201,
        stop: 5202,
        sync: 5203,
        restart: 5204,
        docker: {
            start: 6201,
            stop: 6202
        }
    }
}
```
