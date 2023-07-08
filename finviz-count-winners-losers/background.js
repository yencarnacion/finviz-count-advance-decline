chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['contentScript.js'],
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse({ result: 'Table data has been analyzed.' });
});
