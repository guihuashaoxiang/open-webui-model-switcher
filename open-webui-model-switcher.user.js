// ==UserScript==
// @name         Open-WebUI 模型切换助手
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在Open-WebUI页面创建一个悬浮窗，用于记录和快速切换多个模型组合。V1.7 增加重命名功能。V1.6 修复了菜单查找失败问题。
// @author       guihuashaoxiang (guaqian@vip.qq.com)
// @homepage     https://github.com/guihuashaoxiang/open-webui-model-switcher
// @supportURL   https://github.com/guihuashaoxiang/open-webui-model-switcher/issues
// @match        http://localhost:3000/*
// @note         ↑↑↑ 请务必修改为你自己的Open-WebUI地址，否则脚本无法正常工作。例如 http://localhost:3000/* 或 https://xxxx.guaqian.com/* 。 
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    const STORAGE_KEY = 'webui_model_sets_v2';

    // --- 样式定义 ---
    GM_addStyle(`
        #model-switcher-panel {
            position: fixed;
            top: 100px;
            right: 20px;
            width: 280px;
            background-color: #2a2a2e;
            color: #e0e0e0;
            border: 1px solid #444;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: opacity 0.3s;
        }
        #model-switcher-panel.hidden {
            opacity: 0;
            pointer-events: none;
        }
        #model-switcher-header {
            padding: 10px;
            background-color: #333;
            cursor: move;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
        }
        #model-switcher-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
        }
        #model-switcher-toggle {
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
        }
        #model-switcher-content {
            padding: 10px;
            max-height: 400px;
            overflow-y: auto;
        }
        #model-switcher-content.collapsed {
            display: none;
        }
        .model-set-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            margin-bottom: 5px;
            background-color: #38383d;
            border-radius: 4px;
            border: 1px solid transparent;
            transition: background-color 0.2s, border-color 0.2s;
        }
        .model-set-item:hover {
            background-color: #4a4a50;
        }
        .model-set-name {
            cursor: pointer;
            flex-grow: 1;
            font-size: 14px;
            margin-right: 8px;
        }
        .model-set-name small {
            display: block;
            font-size: 11px;
            color: #aaa;
            margin-top: 3px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .model-set-actions {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }
        .model-set-rename, .model-set-delete {
            cursor: pointer;
            padding: 2px 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .model-set-rename {
            color: #a0a0e0;
        }
        .model-set-rename:hover {
            background-color: #a0a0e0;
            color: #fff;
        }
        .model-set-delete {
            color: #ff6b6b;
            font-weight: bold;
            font-size: 18px; /* Make the '×' a bit larger */
            line-height: 1;
        }
        .model-set-delete:hover {
            background-color: #ff6b6b;
            color: #fff;
        }
        #record-current-model-btn {
            width: 100%;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            margin-top: 10px;
        }
        #record-current-model-btn:hover {
            background-color: #0056b3;
        }
        #model-switcher-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            z-index: 10000;
        }
    `);

    // --- 主逻辑 ---

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('[id^="model-selector-"]')) {
            init();
            obs.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function init() {
        if (document.getElementById('model-switcher-panel')) return;
        createPanelUI();
        makePanelDraggable();
        renderSavedSets();
    }

    function createPanelUI() {
        const panel = document.createElement('div');
        panel.id = 'model-switcher-panel';
        panel.innerHTML = `
            <div id="model-switcher-header">
                <h3>Open-WebUI模型切换助手 v1.7</h3>
                <span id="model-switcher-toggle" title="折叠/展开">-</span>
            </div>
            <div id="model-switcher-content">
                <div id="saved-sets-list"></div>
                <button id="record-current-model-btn">记录当前模型</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('record-current-model-btn').addEventListener('click', recordCurrentModels);
        document.getElementById('model-switcher-toggle').addEventListener('click', togglePanelContent);
    }

    function makePanelDraggable() {
        const panel = document.getElementById('model-switcher-panel');
        const header = document.getElementById('model-switcher-header');
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            if (e.target.id === 'model-switcher-toggle') return;
            isDragging = true;
            offsetX = e.clientX - panel.offsetLeft;
            offsetY = e.clientY - panel.offsetTop;
            panel.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                panel.style.left = `${e.clientX - offsetX}px`;
                panel.style.top = `${e.clientY - offsetY}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.transition = 'opacity 0.3s';
        });
    }

    function togglePanelContent() {
        const content = document.getElementById('model-switcher-content');
        const toggleBtn = document.getElementById('model-switcher-toggle');
        content.classList.toggle('collapsed');
        toggleBtn.textContent = content.classList.contains('collapsed') ? '+' : '-';
    }

    function getCurrentModelsFromPage() {
        const modelButtons = document.querySelectorAll('button[id^="model-selector-"][id$="-button"]');
        return Array.from(modelButtons).map(btn => {
            const innerButton = btn.querySelector('button');
            return innerButton ? innerButton.textContent.trim() : '';
        }).filter(name => name);
    }

    async function recordCurrentModels() {
        const currentModels = getCurrentModelsFromPage();
        if (currentModels.length === 0) {
            alert('未能检测到任何已选择的模型。');
            return;
        }

        const setName = prompt('请输入这组模型配置的名称：', `配置 ${new Date().toLocaleString()}`);
        if (setName && setName.trim()) {
            const savedSets = await GM_getValue(STORAGE_KEY, []);
            savedSets.push({ name: setName.trim(), models: currentModels });
            await GM_setValue(STORAGE_KEY, savedSets);
            await renderSavedSets();
        }
    }

    async function renderSavedSets() {
        const listContainer = document.getElementById('saved-sets-list');
        listContainer.innerHTML = '';
        const savedSets = await GM_getValue(STORAGE_KEY, []);

        savedSets.forEach((set, index) => {
            const item = document.createElement('div');
            item.className = 'model-set-item';
            // **UI CHANGE**: Added rename icon and grouped actions
            item.innerHTML = `
                <div class="model-set-name" title="点击切换到此配置\n${set.models.join('\n')}">
                    ${set.name}
                    <small>${set.models.join(', ')}</small>
                </div>
                <div class="model-set-actions">
                    <span class="model-set-rename" data-index="${index}" title="重命名">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </span>
                    <span class="model-set-delete" data-index="${index}" title="删除此配置">×</span>
                </div>
            `;
            listContainer.appendChild(item);

            // **EVENT LISTENERS**: Added listener for the new rename button
            item.querySelector('.model-set-name').addEventListener('click', () => applyModelSet(set.models));
            item.querySelector('.model-set-rename').addEventListener('click', () => renameSet(index));
            item.querySelector('.model-set-delete').addEventListener('click', () => deleteSet(index));
        });
    }

    // =========================================================================
    // ========================= 新增重命名功能 (START) ==========================
    // =========================================================================

    async function renameSet(index) {
        const savedSets = await GM_getValue(STORAGE_KEY, []);
        const setToRename = savedSets[index];
        if (!setToRename) {
            console.error("要重命名的项目不存在。");
            return;
        }

        const currentName = setToRename.name;
        const newName = prompt('请输入新的配置名称：', currentName);

        // Check if user provided a new, non-empty name that is different from the old one
        if (newName && newName.trim() && newName.trim() !== currentName) {
            savedSets[index].name = newName.trim();
            await GM_setValue(STORAGE_KEY, savedSets);
            await renderSavedSets(); // Re-render the list to show the new name
        }
    }

    // =========================================================================
    // ========================= 新增重命名功能 (END) ============================
    // =========================================================================

    async function deleteSet(index) {
        if (!confirm('确定要删除这个配置吗？')) return;
        const savedSets = await GM_getValue(STORAGE_KEY, []);
        savedSets.splice(index, 1);
        await GM_setValue(STORAGE_KEY, savedSets);
        await renderSavedSets();
    }

    async function applyModelSet(modelsToApply) {
        showLoading('正在切换模型...');
        try {
            const addBtn = document.querySelector('button[aria-label="Add Model"]');
            while (getCurrentModelsFromPage().length < modelsToApply.length) {
                if (!addBtn) throw new Error('找不到“添加模型”按钮。');
                addBtn.click();
                await delay(200);
            }
            while (getCurrentModelsFromPage().length > modelsToApply.length) {
                const removeBtns = document.querySelectorAll('button[aria-label="Remove Model"]');
                if (removeBtns.length === 0) break;
                removeBtns[removeBtns.length - 1].click();
                await delay(200);
            }
            await delay(200);
            const modelSelectors = document.querySelectorAll('button[id^="model-selector-"][id$="-button"]');
            if (modelSelectors.length !== modelsToApply.length) {
                throw new Error('调整模型数量失败，请手动调整后重试。');
            }
            for (let i = 0; i < modelsToApply.length; i++) {
                const modelName = modelsToApply[i];
                const selectorButton = modelSelectors[i];
                const currentModelName = selectorButton.querySelector('button')?.textContent.trim();
                if (currentModelName === modelName) {
                    console.log(`模型 ${i + 1} (${modelName}) 已正确设置，跳过。`);
                    continue;
                }
                selectorButton.click();
                const menuSelector = 'div[role="menu"][data-state="open"][data-menu-content]';
                const menu = await waitForElement(menuSelector);
                const searchInput = menu.querySelector('#model-search-input');
                if (!searchInput) throw new Error('在模型菜单中找不到搜索框。');
                searchInput.value = modelName;
                searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                await delay(300);
                const targetItem = menu.querySelector(`button[aria-label="model-item"][data-value="${CSS.escape(modelName)}"]`);
                if (targetItem) {
                    targetItem.click();
                    await delay(300);
                } else {
                    console.error(`在菜单中搜索后依然找不到模型: "${modelName}"。请检查模型名称是否完全匹配。`);
                    selectorButton.click();
                    await delay(150);
                    throw new Error(`找不到模型: ${modelName}，切换中止。`);
                }
            }
        } catch (error) {
            console.error('切换模型时出错:', error);
            alert(`切换模型时出错: ${error.message}`);
        } finally {
            hideLoading();
        }
    }

    // --- 辅助函数 ---
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const intervalTime = 100;
            let elapsedTime = 0;
            const timer = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(timer);
                    resolve(element);
                }
                elapsedTime += intervalTime;
                if (elapsedTime >= timeout) {
                    clearInterval(timer);
                    reject(new Error(`等待元素超时: "${selector}" 在 ${timeout}ms 内未找到。`));
                }
            }, intervalTime);
        });
    }

    function showLoading(message) {
        let loader = document.getElementById('model-switcher-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'model-switcher-loader';
            document.body.appendChild(loader);
        }
        loader.textContent = message;
        loader.style.display = 'flex';
    }

    function hideLoading() {
        const loader = document.getElementById('model-switcher-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
})();