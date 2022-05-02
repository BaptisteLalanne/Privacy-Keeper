/* Based on my understanding, this file is completely useless. -Marcus */

const messagesFromReactAppListener = (message, sender, response) => {
    console.log('[content.js]. Message received', {
        message,
        sender,
    })

    if (
        sender.id === chrome.runtime.id &&
        message.message === 'Hello from React') {
        response('Hello from content.js');
    }

}


/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);

