## 田湾辐射分区厂房房间可视化Demo

### 使用的vuelayers + iview 详情参考 <a href='https://vuelayers.github.io/#/'>vuelayer</a>  <a href='https://www.iviewui.com/'>iview</a>
- 如何使用?

  - 安装依赖 `yarn || npm install`
  - 运行项目 `yarn serve || npm run servd`


- 代码构建?

  - components下的olMap为模块代码
  - 同级目录下dataSource为模拟数据源

- 注意事项？

  - 当前页面保存数据都在localstorage
  - 房间svg图片存在问题 未能充满img块级容器或超出块级容器
  - 