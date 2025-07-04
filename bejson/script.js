// 工具函数
function escapeJsonString(str) {
  return str.replace(/\\/g, "\\\\").replace(/\"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}
function unescapeJsonString(str) {
  return str.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
}

// DOM 元素
const jsonInput = document.getElementById('jsonInput');
const errorMsg = document.getElementById('errorMsg');
const jsonTree = document.getElementById('jsonTree');

// 按钮
const formatBtn = document.getElementById('formatBtn');
const removeSpaceBtn = document.getElementById('removeSpaceBtn');
const removeSpaceEscapeBtn = document.getElementById('removeSpaceEscapeBtn');
const unescapeBtn = document.getElementById('unescapeBtn');
const expandAllBtn = document.getElementById('expandAllBtn');
const collapseAllBtn = document.getElementById('collapseAllBtn');

// 显示数量配置
let showCount = false;
const showCountCheckbox = document.getElementById('showCountCheckbox');
if (showCountCheckbox) {
  showCountCheckbox.checked = false;
  showCountCheckbox.onchange = function() {
    showCount = this.checked;
    try {
      const val = jsonInput.value.trim();
      if (val) {
        const obj = JSON.parse(val);
        renderTree(obj);
      }
    } catch {}
  };
}

// 记录和恢复左右面板宽度的辅助函数
function getPanelWidths() {
  const leftPanel = document.querySelector('.left-panel');
  const rightPanel = document.querySelector('.right-panel');
  return {
    left: leftPanel ? leftPanel.style.width : '',
    right: rightPanel ? rightPanel.style.width : '',
    leftFlex: leftPanel ? leftPanel.style.flex : '',
    rightFlex: rightPanel ? rightPanel.style.flex : ''
  };
}
function setPanelWidths(widths) {
  if (!widths) return;
  const leftPanel = document.querySelector('.left-panel');
  const rightPanel = document.querySelector('.right-panel');
  if (leftPanel) {
    leftPanel.style.width = widths.left;
    leftPanel.style.flex = widths.leftFlex;
  }
  if (rightPanel) {
    rightPanel.style.width = widths.right;
    rightPanel.style.flex = widths.rightFlex;
  }
}

// 事件绑定
formatBtn.onclick = () => {
  const panelWidths = getPanelWidths();
  try {
    const val = jsonInput.value.trim();
    const obj = JSON.parse(val);
    jsonInput.value = JSON.stringify(obj, null, 2);
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
    // 重置树状态为折叠状态
    treeState = {};
    renderTree(obj);
  } catch (e) {
    errorMsg.textContent = 'JSON格式错误，请检查输入内容。';
    errorMsg.classList.add('show');
    jsonTree.innerHTML = '';
  }
  setPanelWidths(panelWidths);
};

removeSpaceBtn.onclick = () => {
  const panelWidths = getPanelWidths();
  jsonInput.value = jsonInput.value.replace(/\s+/g, '');
  errorMsg.textContent = '';
  errorMsg.classList.remove('show');
  setPanelWidths(panelWidths);
};

removeSpaceEscapeBtn.onclick = () => {
  const panelWidths = getPanelWidths();
  let str = jsonInput.value.replace(/\s+/g, '');
  jsonInput.value = escapeJsonString(str);
  errorMsg.textContent = '';
  errorMsg.classList.remove('show');
  setPanelWidths(panelWidths);
};

unescapeBtn.onclick = () => {
  const panelWidths = getPanelWidths();
  jsonInput.value = unescapeJsonString(jsonInput.value);
  errorMsg.textContent = '';
  errorMsg.classList.remove('show');
  setPanelWidths(panelWidths);
};

// 树形结构渲染
let treeState = {};
function renderTree(obj) {
  treeState = treeState || {};
  jsonTree.innerHTML = '';
  const root = buildTree(obj, 'root');
  jsonTree.appendChild(root);
}

function buildTree(data, path, keyName) {
  const node = document.createElement('div');
  node.className = 'tree-node';
  let hasChildren = false;
  let typeIcon = '';
  let isExpandable = false;
  let isExpanded = treeState[path] === true;

  // 判断类型和图标
  if (Array.isArray(data)) {
    hasChildren = data.length > 0;
    typeIcon = 'assets/array.gif';
    isExpandable = hasChildren;
  } else if (typeof data === 'object' && data !== null) {
    hasChildren = Object.keys(data).length > 0;
    typeIcon = 'assets/object.gif';
    isExpandable = hasChildren;
  } else if (typeof data === 'number') {
    typeIcon = 'assets/green.gif';
  } else if (typeof data === 'boolean') {
    typeIcon = 'assets/yellow.gif';
  } else {
    typeIcon = 'assets/blue.gif';
  }

  // 展开/折叠图标
  if (isExpandable) {
    const toggleImg = document.createElement('img');
    toggleImg.className = 'tree-toggle-img';
    toggleImg.src = isExpanded ? 'assets/minus.gif' : 'assets/plus.gif';
    toggleImg.alt = isExpanded ? '-' : '+';
    toggleImg.onclick = function(e) {
      treeState[path] = !isExpanded;
      try {
        const val = JSON.parse(jsonInput.value.trim());
        renderTree(val);
      } catch {}
      e.stopPropagation();
    };
    node.appendChild(toggleImg);
  } else {
    // 占位，保持对齐
    const emptySpan = document.createElement('span');
    emptySpan.className = 'tree-toggle-img';
    emptySpan.style.display = 'inline-block';
    emptySpan.style.width = '18px';
    node.appendChild(emptySpan);
  }

  // 类型图标
  const typeImg = document.createElement('img');
  typeImg.className = 'tree-type-img';
  typeImg.src = typeIcon;
  typeImg.alt = '';
  node.appendChild(typeImg);

  // key
  if (typeof keyName !== 'undefined') {
    const keySpan = document.createElement('span');
    keySpan.className = 'tree-key';
    keySpan.textContent = keyName + ': ';
    node.appendChild(keySpan);
  }

  // value or children
  if (Array.isArray(data)) {
    if (isExpanded) {
      if (showCount) {
        const arrLen = data.length;
        const arrLabel = document.createElement('span');
        arrLabel.className = 'tree-count-label';
        arrLabel.textContent = `[${arrLen}]`;
        node.appendChild(arrLabel);
      }
      data.forEach((item, idx) => {
        const child = buildTree(item, path + '.' + idx, idx);
        node.appendChild(child);
      });
    } else {
      if (showCount) {
        const arrLen = data.length;
        const arrLabel = document.createElement('span');
        arrLabel.className = 'tree-count-label';
        arrLabel.textContent = `[${arrLen}]`;
        node.appendChild(arrLabel);
      }
    }
  } else if (typeof data === 'object' && data !== null) {
    if (isExpanded) {
      if (showCount) {
        const keys = Object.keys(data);
        const objLabel = document.createElement('span');
        objLabel.className = 'tree-count-label';
        objLabel.textContent = `{${keys.length}}`;
        node.appendChild(objLabel);
      }
      const keys = Object.keys(data);
      keys.forEach(key => {
        const child = buildTree(data[key], path + '.' + key, key);
        node.appendChild(child);
      });
    } else {
      if (showCount) {
        const keys = Object.keys(data);
        const objLabel = document.createElement('span');
        objLabel.className = 'tree-count-label';
        objLabel.textContent = `{${keys.length}}`;
        node.appendChild(objLabel);
      }
    }
  } else {
    node.appendChild(renderValue(data));
  }
  return node;
}

function renderValue(val) {
  const span = document.createElement('span');
  if (typeof val === 'string') {
    span.className = 'tree-value-string';
    span.textContent = '"' + val + '"';
  } else if (typeof val === 'number') {
    span.className = 'tree-value-number';
    span.textContent = val;
  } else if (typeof val === 'boolean') {
    span.className = 'tree-value-boolean';
    span.textContent = val;
  } else if (val === null) {
    span.className = 'tree-value-null';
    span.textContent = 'null';
  }
  return span;
}

expandAllBtn.onclick = () => {
  const panelWidths = getPanelWidths();
  try {
    const val = JSON.parse(jsonInput.value.trim());
    setAllTreeState(val, 'root', true);
    renderTree(val);
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
  } catch (e) {
    errorMsg.textContent = 'JSON格式错误，无法全部展开。';
    errorMsg.classList.add('show');
  }
  setPanelWidths(panelWidths);
};

collapseAllBtn.onclick = () => {
  const panelWidths = getPanelWidths();
  try {
    const val = JSON.parse(jsonInput.value.trim());
    setAllTreeState(val, 'root', false);
    renderTree(val);
    errorMsg.textContent = '';
    errorMsg.classList.remove('show');
  } catch (e) {
    errorMsg.textContent = 'JSON格式错误，无法全部折叠。';
    errorMsg.classList.add('show');
  }
  setPanelWidths(panelWidths);
};

function setAllTreeState(data, path, state) {
  if (Array.isArray(data)) {
    treeState[path] = state;
    data.forEach((item, idx) => setAllTreeState(item, path + '.' + idx, state));
  } else if (typeof data === 'object' && data !== null) {
    treeState[path] = state;
    Object.keys(data).forEach(key => setAllTreeState(data[key], path + '.' + key, state));
  }
}

// 初始化时尝试渲染
try {
  const val = jsonInput.value.trim();
  if (val) {
    const obj = JSON.parse(val);
    renderTree(obj);
  }
} catch {}

// 拖动分割条实现左右面板宽度调整
(function enableDragBar() {
  let isDragging = false;
  let startX = 0;
  let startLeftWidth = 0;
  let dragBar, leftPanel, rightPanel, container;

  function updateRefs() {
    dragBar = document.querySelector('.drag-bar');
    leftPanel = document.querySelector('.left-panel');
    rightPanel = document.querySelector('.right-panel');
    container = document.querySelector('.container');
  }

  function onMouseDown(e) {
    if (window.innerWidth <= 900) return;
    isDragging = true;
    startX = e.clientX;
    startLeftWidth = leftPanel.getBoundingClientRect().width;
    document.body.style.userSelect = 'none';
  }

  function onMouseMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    let newLeftWidth = startLeftWidth + dx;
    const minWidth = 120;
    const maxWidth = container.clientWidth - 120;
    if (newLeftWidth < minWidth) newLeftWidth = minWidth;
    if (newLeftWidth > maxWidth) newLeftWidth = maxWidth;
    leftPanel.style.flex = 'none';
    rightPanel.style.flex = 'none';
    leftPanel.style.width = newLeftWidth + 'px';
    rightPanel.style.width = (container.clientWidth - newLeftWidth - dragBar.offsetWidth) + 'px';
    dragBar.style.left = (newLeftWidth - dragBar.offsetWidth / 2) + 'px';
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      document.body.style.userSelect = '';
    }
  }

  function onResize() {
    if (window.innerWidth <= 900) {
      leftPanel.style.width = '';
      rightPanel.style.width = '';
      leftPanel.style.flex = '';
      rightPanel.style.flex = '';
      dragBar.style.left = '';
    } else {
      dragBar.style.left = (leftPanel.getBoundingClientRect().width - dragBar.offsetWidth / 2) + 'px';
    }
  }

  function bindEvents() {
    updateRefs();
    if (!dragBar || !leftPanel || !rightPanel || !container) return;
    dragBar.removeEventListener('mousedown', onMouseDown);
    dragBar.addEventListener('mousedown', onMouseDown);
    dragBar.style.left = (leftPanel.getBoundingClientRect().width - dragBar.offsetWidth / 2) + 'px';
  }

  // 只绑定一次全局事件
  document.addEventListener('mousemove', function(e) {
    updateRefs();
    if (!leftPanel || !rightPanel || !container || !dragBar) return;
    onMouseMove(e);
  });
  document.addEventListener('mouseup', onMouseUp);
  window.addEventListener('resize', function() {
    updateRefs();
    onResize();
  });

  // 初始绑定
  bindEvents();
  // 每次按钮点击后重新绑定
  [formatBtn, removeSpaceBtn, removeSpaceEscapeBtn, unescapeBtn, expandAllBtn, collapseAllBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', bindEvents);
  });
})(); 