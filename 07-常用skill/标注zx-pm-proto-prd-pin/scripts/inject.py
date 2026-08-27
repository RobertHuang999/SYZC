#!/usr/bin/env python3
"""
pm-proto-prd-pin 自动植入脚本
用法:
  python3 inject.py <目标原型目录>

功能:
  1. 扫描目标目录下所有的 .html 页面
  2. 将 prd-pin-tool.js 复制到 <目标目录>/assets/js/
  3. 将 server.js 与 start.sh 复制到 <目标目录>/
  4. 为每个 html 页面生成专属的 assets/js/prd-data-[name].js 占位数据
  5. 自动在每个 html 文件的 </body> 之前插入两行引入脚本
"""

import os
import sys
import shutil
import re

def main():
    if len(sys.argv) < 2:
        print("❌ 用法: python3 inject.py <目标原型目录>")
        sys.exit(1)

    target_dir = os.path.abspath(sys.argv[1])
    if not os.path.isdir(target_dir):
        print(f"❌ 错误: 目标目录不存在: {target_dir}")
        sys.exit(1)

    skill_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    assets_dir = os.path.join(skill_root, 'assets')
    target_assets_js = os.path.join(target_dir, 'assets', 'js')
    os.makedirs(target_assets_js, exist_ok=True)

    # 1. 复制 prd-pin-tool.js 与 vendor 依赖
    src_tool = os.path.join(assets_dir, 'prd-pin-tool.js')
    dst_tool = os.path.join(target_assets_js, 'prd-pin-tool.js')
    if os.path.isfile(src_tool):
        shutil.copy2(src_tool, dst_tool)
        print(f"✅ 已植入核心引擎: assets/js/prd-pin-tool.js")

    src_vendor = os.path.join(assets_dir, 'vendor')
    dst_vendor = os.path.join(target_dir, 'assets', 'vendor')
    if os.path.isdir(src_vendor):
        if os.path.exists(dst_vendor):
            shutil.rmtree(dst_vendor)
        shutil.copytree(src_vendor, dst_vendor)
        print(f"✅ 已植入第三方依赖库: assets/vendor/")

    # 2. 复制 server.js 与 start.sh
    for fn in ['server.js', 'start.sh']:
        src_f = os.path.join(assets_dir, fn)
        dst_f = os.path.join(target_dir, fn)
        if os.path.isfile(src_f) and not os.path.isfile(dst_f):
            shutil.copy2(src_f, dst_f)
            if fn.endswith('.sh'):
                os.chmod(dst_f, 0o755)
            print(f"✅ 已植入服务端脚本: {fn}")

    # 3. 扫描并处理所有 HTML 文件
    html_files = [f for f in os.listdir(target_dir) if f.endswith('.html')]
    if not html_files:
        print("⚠️ 目标目录未发现 .html 文件")
        return

    for html_file in html_files:
        pure_name = html_file.replace('.html', '')
        data_file_name = f"prd-data-{pure_name}.js"
        data_file_path = os.path.join(target_assets_js, data_file_name)

        # 3.1 创建数据初始文件 (若不存在)
        if not os.path.isfile(data_file_path):
            initial_content = f"""/**
 * {html_file} 专属 PRD 规格数据
 */
window.PAGE_PRD_DATA = window.PAGE_PRD_DATA || {{}};
window.PAGE_PRD_DATA["{html_file}"] = [];
window.INITIAL_PRD_DATA = window.PAGE_PRD_DATA["{html_file}"];
"""
            with open(data_file_path, 'w', encoding='utf-8') as f:
                f.write(initial_content)
            print(f"📄 初始化数据文件: assets/js/{data_file_name}")

        # 3.2 注入到 HTML 文件
        html_path = os.path.join(target_dir, html_file)
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()

        script_tag_1 = f'<script src="assets/js/{data_file_name}"></script>'
        script_tag_2 = '<script src="assets/js/prd-pin-tool.js"></script>'

        if 'prd-pin-tool.js' not in content:
            injection = f"\n  <!-- 交互式 PRD 打点与规约标注引擎 -->\n  {script_tag_1}\n  {script_tag_2}\n"
            if '</body>' in content:
                content = content.replace('</body>', f"{injection}</body>")
            else:
                content += injection

            with open(html_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"💉 成功向 {html_file} 植入打点组件")
        else:
            print(f"ℹ️ {html_file} 已包含打点组件，跳过注入")

    print("\n🎉 全部页面植入完成！请在项目根目录下执行 ./start.sh 启动服务。")

if __name__ == '__main__':
    main()
