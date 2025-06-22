# Open-WebUI Model Switcher

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.7-blue.svg)](#)
[![Greasy Fork](https://img.shields.io/badge/Greasy%20Fork-Install-brightgreen.svg)](https://greasyfork.org/en/scripts/YOUR-SCRIPT-ID-HERE) <!-- Replace YOUR-SCRIPT-ID-HERE after publishing to Greasy Fork -->

[中文文档](./README.md) <!-- Optional -->

A Tampermonkey script designed for [Open-WebUI](https://github.com/open-webui/open-webui) that helps users quickly record, manage and switch between multiple model chat combinations through a floating window.

![Screenshot](https://raw.githubusercontent.com/guihuashaoxiang/open-webui-model-switcher/main/screenshot.png)
*(Please upload a screenshot named `screenshot.png` in the repository)*

## ✨ Features

*   **Floating Window**: Creates a draggable and collapsible floating panel on the right side of Open-WebUI page.
*   **Record Models**: One-click recording of all model combinations used in current chat session.
*   **Quick Switching**: Click saved configurations to automatically switch current session's models to target combination.
*   **Configuration Management**:
    *   Custom names for each model combination.
    *   Supports **renaming** saved configurations.
    *   Supports **deleting** unwanted configurations.
*   **Persistent Storage**: All configurations are saved in browser local storage, remaining after page refresh or browser restart.

## 🚀 Installation

1.  **Install Script Manager**: First you need a userscript manager. Recommended [**Tampermonkey**](https://www.tampermonkey.net/). Please install according to your browser.
2.  **Install This Script**: Click the link below to install directly.
    *   **[➡️ Install from Github (Recommended)](https://raw.githubusercontent.com/guihuashaoxiang/open-webui-model-switcher/main/open-webui-model-switcher.user.js)**

## 🛠️ Usage Instructions

1.  After installing the script, open your Open-WebUI page.
2.  On the right side of the page, you'll see the "Open-WebUI Model Switcher" floating window.
3.  **Record Configuration**: Set up the model combination you want to save in Open-WebUI (can be one or multiple models), then click the **"Record Current Models"** button in the floating window and name this configuration.
4.  **Switch Configuration**: Click the configuration name you want to use in the list, the script will automatically adjust the models for you.
5.  **Manage Configurations**:
    *   Click the **pencil icon** ✏️ next to configuration to rename.
    *   Click the **cross icon** ❌ next to configuration to delete.
    *   Click the **`—` / `+`** on floating window header to collapse/expand panel.
    *   Drag the floating window header to move it anywhere.

### ⚠️ Important: How to Match Your Open-WebUI Address

By default, this script only works on `http://localhost:3000/*` address. If your Open-WebUI is accessed through `localhost`, `127.0.0.1` or other IP addresses/domains, you need to manually modify the script's matching rules.

Please follow these steps:

1.  Click the **Tampermonkey icon** in browser top-right corner, then select **"Dashboard"**.
2.  Find **"Open-WebUI Model Switcher"** in script list, click its **edit button** (usually a pencil and paper icon).
3.  In the code editor, find the top `@match` line:
    ```
    // @match        http://localhost:3000/*
    ```
4.  **Change this address to your own Open-WebUI address**. Make sure to keep the ending `/*`, which means matching all pages under this domain.

    **Common Examples:**
    *   If your address is `http://localhost:8080`, change to:
        `// @match        http://localhost:8080/*`
    *   If your address is `http://192.168.1.5:3000`, change to:
        `// @match        http://192.168.1.5:3000/*`

5.  After modification, press `Ctrl + S` or click **"File" -> "Save"** in editor to save changes.
6.  Refresh your Open-WebUI page, the script should now load normally.

## 🤝 Contribution

Welcome to submit bug reports or feature suggestions via [Issues](https://github.com/guihuashaoxiang/open-webui-model-switcher/issues). Also welcome to contribute code via Pull Request!

## 📄 License

This project is open source under [MIT License](LICENSE).
