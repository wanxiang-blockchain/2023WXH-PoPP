## Netus3-V1-Demo

*	本项目分为dev、prd模式。即测试环境和正式环境变量
### 测试环境 
*	配置环境：.env .env.test
*	打包命令： yarn build:test 、yarn start
### 正式环境
*	配置环境 .env .env.production
*	打包命令：yarn build 、yarn start
### 本地运行
yarn dev 即为测试环境
`若本地要查看正式环境数据变化，上线之前检查的话，可操作：yarn build，然后再次yarn start即可查看`