
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## docker mysql

```
// 安装docker
brew install --cask --appdir=/Applications docker

// 在载入 Docker app 后，点击 Next，可能会询问你的 macOS 登陆密码，你输入即可。之后会弹出一个 Docker 运行的提示窗口，状态栏上也有有个小鲸鱼的图标（）。

// 命令来查看可用版本
docker search mysql

// 拉取mysql对象
docker pull mysql:latest

// 运行容器
docker run -itd --name mysql-test -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql

// 重新启动容器
// 第一步查询mysql的容器ID
docker ps -a

// 重启容器 5e7821a2a06b (镜像运行的id号)
docker restart 5e7821a2a06b
```

## 建立 mongodb 
安装 mongodb
```docker pull mongo```

接着启动mongo
```
docker run -itd --name mongo -p 27017:27017 mongo --auth
```

创建用户和密码
```
docker exec -it mongo mongosh admin
// 尝试建立链接
db.auth('admin', '123456');
// 返回 { ok: 1 } 即为成功
```
