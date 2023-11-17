
# NestJS Data Helper

NestJS标准后台服务模版，基于 MySQL、Mongose、Minio等存储服务，使用 Puppeteer、lighthouse 等工具实现后台服务。

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

## docker mongodb
```bash
docker pull mongo:latest

docker run -itd --name x-replay -p 27017:27017 mongo
docker run -itd --name nest-data -p 27018:27018 mongo

```

## docker minio
```
docker pull minio:minio

docker run -d  -p 9000:9000 -p 9001:9001 --name minio -v /Users/lilonglong/minio/data:/data -e "MINIO_ROOT_USER=minio" -e "MINIO_ROOT_PASSWORD=12345678"  minio/minio server /data --console-address ":9001"
```

## puppeteer
本项目puppeteer运行需要依赖本地 chrome 浏览器，配置地址如下
```
executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
```


## 增加 lighthouse 性能实时监控
由于本项目采用的 CommonJS 的依赖加载机制，lighthouse 的版本必须要在10以下，本项目采用8.0.0版本，请勿升级。
node的版本采用12版本，19版本项目tcp ipv6无法支持

## 短期的房地产数据分析
数据库文件是在 dataBackUp/MySQL 下，有需自取

