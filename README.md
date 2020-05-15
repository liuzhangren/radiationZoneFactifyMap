## 田湾辐射分区厂房房间可视化Demo

### 使用的vuelayers + iview 详情参考 <a href='https://vuelayers.github.io/#/'>vuelayers</a> && <a href='https://www.iviewui.com/'>iview</a>
- 如何测试该demo?

  - 安装依赖 `yarn || npm install`
  - 运行项目 `yarn serve || npm run serve`


- 代码构建?

  - components下的olMap为模块代码
  - 同级目录下dataSource为模拟数据源

- 注意事项？
  - 缩放地图的事件触发频率太高会导致地图重绘overlay延迟，样式崩毁 建议防抖(未做)
  - 当前页面保存数据都在localstorage
  - 房间svg图片存在问题 未能充满img块级容器或超出块级容器
  - 为解决页面缩放覆盖物尺寸缩放 禁用了鼠标滚轮缩放地图事件
  - 覆盖物（厂房房间的坐标在dataSource中，需要一点点去调整，目前没有对应坐标和px的换算）
  - 提交按钮事件未绑定 需要自己取localstorage中的type1字段进行提交
  - 底图替换在 vl-source-image-static 标签对中的url
  - 覆盖物的图片替换即为overlay中的img标签，如果需要一一对应则在dataSource中添加对应图片url进行遍历
  - 大致功能具备，数据结构和具体业务场景需要具体定制
  - 用的vue,迁移样式可自定义