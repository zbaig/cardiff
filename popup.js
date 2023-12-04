// popup.js

function remElem(tabs, selector, isYT = false) {
  // Send a message to content.js to remove elements
  const tabId = tabs[0]?.id
  if (tabId) {
    chrome.tabs.sendMessage(tabId, { action: isYT ? 'removeElementsYT' : 'removeElements', selector })
  } else {
    console.error('Couldn\'t get the active tab ID.')
  }
}

function updateToggleButton() {
  const toggleButton = document.getElementById('toggleButton');
  chrome.storage.sync.get('isEnabled', data => {
    toggleButton.innerText = data.isEnabled ? 'Disable' : 'Enable';
  });
}

document.getElementById('toggleButton').addEventListener('click', function () {
  chrome.storage.sync.get('isEnabled', data => {
    const newStatus = !data.isEnabled;
    chrome.storage.sync.set({ isEnabled: newStatus }, () => {
      updateToggleButton();
    });
  });
});

const list = [
  'body #sidebar-right',
  'body header',
  'body footer',
  'body aside',
  'body #leftcolumn',
  'body #rightcolumn',
  'body .gtable',
  'html head',
  'body p',
  'body style',
  'body script',
  'body h1',
  'body form',
  'body input',
  'body #floater',
  '[id*=\'overlay\']',
  '[id*=\'smart\']',
]

const ytList = [
  'body ytd-ad-slot-renderer',
  '.ytp-gated-actions-overlay',
  '.ytp-paid-content-overlay',
  'ytd-comments',
  '#player-ads',
]

document.getElementById('removeButton').addEventListener('click', function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    chrome.storage.sync.get('isEnabled', data => {
      if (data.isEnabled) {
        const isYT = tabs[0]?.url?.includes('youtube')
        if (isYT) {
          ytList.forEach((e) => remElem(tabs, e, isYT))
        } else {
          list.forEach((e) => remElem(tabs, e))
        }
      }
    })
    updateToggleButton();
  })
})
