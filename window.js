const getActiveTab = async () => (await browser.tabs.query({ active: true, currentWindow: true }))[0];

browser.contextMenus.create({
  id: "summarize",
  title: "Summarize the page",
  contexts: ["page"],
},
  // See https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/#event-pages-and-backward-compatibility
  // for information on the purpose of this error capture.
  () => void browser.runtime.lastError,
);

browser.menus.onClicked.addListener(async ({ menuItemId }, tab) => {
  if (menuItemId === 'summarize') {
    const result = await browser.scripting.executeScript({
      files: ['/content_scripts/extract_text.js'],
      target: {
        tabId: (await getActiveTab()).id
      },
    })

    let text = await browser.tabs.sendMessage((await getActiveTab()).id, {
      command: "extractText",
    });
    
    document.getElementById('content').innerText = text;
  }
})


