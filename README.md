
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

## 增加 lighthouse 性能实时监控
由于本项目采用的 CommonJS 的依赖加载机制，lighthouse 的版本必须要在10以下，本项目采用8.0.0版本，请勿升级。
node的版本采用12版本，19版本项目tcp ipv6无法支持

## 短期的房地产数据分析
数据库文件是在 dataBackUp/MySQL 下，有需自取


## nosql 集成
目前nest对于不同类型的数据库兼容，本人学习不够还在研究中。
