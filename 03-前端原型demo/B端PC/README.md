# SYZC B 端 PC 原型

独立 Vite 工程，与同级目录 [B端H5](../B端H5/) 分开运行。

## 启动

```bash
cd B端PC
npm install
npm run dev
```

默认端口 **5173**（H5 原型为 5174）。


## 布局与目录

- 布局：Sidebar + 宽表（后台管理风格）
- 业务代码：`src/features/{模块名}/`

```text
src/features/{模块名}/
  domain/       # 类型、常量、动作矩阵
  mock/         # Mock 数据
  components/   # PC 专用组件
  pages/        # 页面
```
