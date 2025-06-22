# Open-WebUI 模型切换助手 (Open-WebUI Model Switcher)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.7-blue.svg)](#)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-Install-brightgreen.svg)](https://greasyfork.org/zh-CN/scripts/YOUR-SCRIPT-ID-HERE) <!-- 请在发布到 Greasy Fork 后替换 YOUR-SCRIPT-ID-HERE -->

[English Version](./README_EN.md) <!-- 可选 -->

一个为 [Open-WebUI](https://github.com/open-webui/open-webui) 设计的油猴脚本，旨在通过一个悬浮窗口，帮助用户快速记录、管理和切换多模型聊天组合。

![脚本运行截图](https://raw.githubusercontent.com/guihuashaoxiang/open-webui-model-switcher/main/screenshot.png)
*(请在仓库中上传一张名为 `screenshot.png` 的截图)*

## ✨ 功能特性

*   **悬浮窗口**: 在 Open-WebUI 页面右侧创建一个可拖拽、可折叠的悬浮面板。
*   **记录模型**: 一键记录当前聊天会话中使用的所有模型组合。
*   **快速切换**: 点击已保存的配置，即可自动将当前会话的模型切换为目标组合。
*   **配置管理**:
    *   为每套模型组合自定义名称。
    *   支持**重命名**已保存的配置。
    *   支持**删除**不再需要的配置。
*   **持久化存储**: 所有配置都保存在浏览器本地，刷新页面或重启浏览器后依然存在。

## 🚀 安装

1.  **安装脚本管理器**: 你首先需要一个用户脚本管理器。推荐使用 [**Tampermonkey**](https://www.tampermonkey.net/) (油猴)。请根据你的浏览器选择并安装。
2.  **安装本脚本**: 点击下面的链接直接安装。
    *   **[➡️ 从 Github 安装 (推荐)](https://github.com/guihuashaoxiang/open-webui-model-switcher/raw/main/open-webui-model-switcher.user.js)**

## 🛠️ 使用说明

1.  安装脚本后，打开你的 Open-WebUI 页面。
2.  在页面右侧，你会看到 "Open-WebUI模型切换助手" 的悬浮窗。
3.  **记录配置**: 在 Open-WebUI 中设置好你想要保存的模型组合（可以是一个或多个模型），然后点击悬浮窗中的 **"记录当前模型"** 按钮，并为这个配置命名。
4.  **切换配置**: 直接点击列表中你想要使用的配置名称，脚本会自动为你调整模型。
5.  **管理配置**:
    *   点击配置项旁边的 **铅笔图标** ✏️ 可以重命名。
    *   点击配置项旁边的 **叉号** ❌ 可以删除。
    *   点击悬浮窗头部的 **`—` / `+`** 可以折叠或展开面板。
    *   按住悬浮窗头部可以拖动到任意位置。

### ⚠️ 重要：如何匹配你自己的 Open-WebUI 地址

本脚本默认只在 `http://localhost:3000/*` 地址生效。如果你的 Open-WebUI 是通过 `localhost`、`127.0.0.1` 或者其他IP地址/域名访问的，你需要手动修改脚本的匹配规则才能让它工作。

请按照以下步骤操作：

1.  在浏览器右上角点击 **Tampermonkey (油猴) 图标**，然后选择 **"管理面板"** (Dashboard)。
2.  在脚本列表中找到 **"Open-WebUI 模型切换助手"**，点击它的**编辑按钮**（通常是一个铅笔和纸的图标）。
3.  在打开的代码编辑器中，找到最顶部的 `@match` 这一行：
    ```
    // @match        http://localhost:3000/*
    ```
4.  **将这个地址修改为你自己的 Open-WebUI 地址**。请确保保留末尾的 `/*`，它表示匹配该域名下的所有页面。

    **常见示例:**
    *   如果你的地址是 `http://localhost:8080`，就修改为:
        `// @match        http://localhost:8080/*`
    *   如果你的地址是 `http://192.168.1.5:3000`，就修改为:
        `// @match        http://192.168.1.5:3000/*`

5.  修改完成后，按 `Ctrl + S` 或点击编辑器上方的 **"文件" -> "保存"** 来保存你的修改。
6.  刷新你的 Open-WebUI 页面，脚本现在应该可以正常加载了。

## 🤝 贡献

欢迎通过 [Issues](https://github.com/guihuashaoxiang/open-webui-model-switcher/issues) 提交 Bug 报告或功能建议。也欢迎通过 Pull Request 贡献代码！

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。
