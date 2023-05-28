chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url?.includes('logichome.org')) {
    await chrome.tabs.sendMessage(tab.id!, { action: 'solve' })
  }
})
