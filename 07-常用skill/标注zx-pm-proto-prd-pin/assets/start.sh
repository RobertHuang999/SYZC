#!/usr/bin/env bash
# 启动本地 PRD 原型服务
echo "🚀 正在启动 S2B2C 原型与 PRD 实时持久化服务..."

if command -v node >/dev/null 2>&1; then
    node server.js
elif command -v python3 >/dev/null 2>&1; then
    python3 server.py
else
    echo "⚠️ 未检测到 Node.js 或 Python 3，请先安装环境或使用 Chrome 浏览器直接打开 HTML 文件（支持 File System API）。"
fi
