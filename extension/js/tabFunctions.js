function createTabListeners(socket) {
  chrome.tabs.onCreated.addListener((tab) => {
    createdTab(tab);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    checkSecurityWebsites(socket, tabId, changeInfo);
    checkScriptWebsites(socket, tabId, changeInfo);
    updatedTab(tabId, changeInfo, tab);
  });
  chrome.tabs.onActivated.addListener((tabId, activeInfo, tab) => {
    activatedTab(tabId, activeInfo, tab);
  });
  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    removedTab(tabId, removeInfo);
  });
}

function createdTab(tab) {
  socket.emit('Created Tab', tab);
}

function updatedTab(tabId, changeInfo, tab) {
  socket.emit('Updated Tab', {
    tabId: tab,
    changeInfo: changeInfo,
    tab: tab
  });
}

function activatedTab(tabId, activeInfo, tab) {
  socket.emit('Activated Tab', {
    tabId: tabId,
    activeInfo: activeInfo,
    tab: tab
  });
}

function removedTab(tabId, removeInfo) {
  socket.emit('Removed Tab', {
    tabId: tabId,
    removeInfo: removeInfo
  });
}
