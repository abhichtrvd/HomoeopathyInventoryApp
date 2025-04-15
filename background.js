chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

// Listen for OAuth2 authentication requests
chrome.identity.getAuthToken({ interactive: true }, function (token) {
    console.log('Auth token:', token);
    // Store token for later use
    chrome.storage.local.set({ googleToken: token });
});


// Example function to handle OAuth2 callback
function handleAuthCallback(response) {
    if (response && response.access_token) {
        // Store the token in Chrome's local storage
        chrome.storage.local.set({ googleToken: response.access_token }, function () {
            console.log('Token stored');
        });
    } else {
        console.error('No access token received.');
    }
}

// Listen for authentication response
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'authCallback') {
        handleAuthCallback(request.response);
    }
});

chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({
        url: chrome.runtime.getURL("popup.html")
    });
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("popup.html")
    });
});


chrome.browserAction.onClicked.addListener(function() {
    chrome.windows.create({
        url: chrome.runtime.getURL("your_extension_page.html"),
        type: "popup",
        state: "maximized"  // This will maximize the window
    });
});

