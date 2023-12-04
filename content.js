// content.js

function removeElementsBySelector(selector, isYT = false) {
  const elements = document.querySelectorAll(selector);

  elements.forEach(function (e) {
    const whitelist = [
      'contentwrapper',
      'contentcolumn',
      'video_player',
      'CSSTableGenerator',
      'row',
      'box',
      'col-md-8',
    ];

    // Check if the element's ID or class is in the whitelist
    if (
      whitelist.indexOf(e.id) === -1 &&
      whitelist.indexOf(e.className) === -1
    ) {
      e.classList.add('removed-element');
      e.remove();
    }
  });
}
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
  "[id*='overlay']",
  "[id*='smart']",
];

const ytList = [
  'body ytd-ad-slot-renderer',
  '.ytp-gated-actions-overlay',
  '.ytp-paid-content-overlay',
  'ytd-comments',
  '#player-ads',
];

// Execute logic when the extension icon is clicked or page is loaded
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('Content script received a message:', request);

  if (request.action === 'pageLoaded' || request.action === 'removeElements') {
    const isYT = window.location.href.includes('youtube');
    const elementsToRemove = isYT ? ytList : list;

    elementsToRemove.forEach((e) => removeElementsBySelector(e, isYT));
  } else if (request.action === 'removeElementsYT') {
    const adOverlay = document.querySelector('.ytp-ad-overlay-close-container');
    const skipButton = document.querySelector('.ytp-ad-skip-button');

    if (adOverlay) adOverlay.click();
    if (skipButton) skipButton.click();
    else {
      const videoElement = document.querySelector('video');
      if (videoElement) {
        videoElement.playbackRate = 16;
      }
    }

    removeElementsBySelector(request.selector);
  }
});
