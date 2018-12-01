function createTabListeners() {
  chrome.tabs.onCreated.addListener((tab) => {
    createdTab(tab);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    checkSecurityWebsites(tabId, changeInfo);
    updatedTab(tabId, changeInfo, tab);
  });
  chrome.tabs.onActivated.addListener((tabId, activeInfo, tab) => {
    activatedTab(tabId, activeInfo, tab);
  });
  chrome.tabs.onRemoved.addListener((tabId, removeInfo, tab) => {
    removedTab(tabId, removeInfo, tab);
  });
}

function createdTab(tab) {
  socket.emit('Created Tab', tab);
}

function updatedTab(tabId, changeInfo, tab) {
  socket.emit('Updated Tab', {tab: tab, changeInfo: changeInfo, tab: tab});
}

function activatedTab(tabId, activeInfo, tab) {
  socket.emit('Activated Tab', {tab: tab, activeInfo: activeInfo, tab: tab});
}

function removedTab(tabId, removeInfo, tab) {
  socket.emit('Removed Tab', {tab: tab, removeInfo: removeInfo, tab: tab});
}
