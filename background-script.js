function notify(message) {
    let title = 'Binancify Extentsion Info'    
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("icons/link-48.png"),
      title,
      "message": message.content
    });
  }
browser.runtime.onMessage.addListener(notify);