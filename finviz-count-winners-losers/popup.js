function updateCounts() {
    chrome.storage.sync.get(['aboveCount', 'belowCount', 'unchangedCount'], function(result) {
        document.getElementById('aboveCount').textContent = result.aboveCount;
        document.getElementById('belowCount').textContent = result.belowCount;
        document.getElementById('unchangedCount').textContent = result.unchangedCount;
    });
}

// Update the counts when the popup is loaded
document.addEventListener('DOMContentLoaded', updateCounts);

// Update the counts whenever they change in the storage
chrome.storage.onChanged.addListener(updateCounts);

// Refresh the counts every 5 seconds
setInterval(updateCounts, 3000);
