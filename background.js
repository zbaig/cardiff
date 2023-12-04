// background.js

function handleNavigation(details) {
  // Check if the navigation event is the main frame completing
  if (details.frameId === 0 && details.tabId) {
    // Communicate through a content script when a page is loaded
    chrome.tabs.sendMessage(details.tabId, { action: 'pageLoaded' });
  }
}

// Set up a listener for webNavigation events
chrome.webNavigation.onCompleted.addListener(handleNavigation);

// Listen for connections from the popup
chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.action === 'removeElementsYT') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const tabId = tabs[0]?.id;

        // Check if the tab ID is available
        if (tabId) {
          // Communicate through the port
          port.postMessage({ action: 'removeElementsYT', selector: 'body ytd-ad-slot-renderer' });
        } else {
          console.error("Couldn't get the active tab ID.");
        }
      });
    }
  });
});
