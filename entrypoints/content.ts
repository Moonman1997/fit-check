export default defineContentScript({
  matches: ['*://*/*'],
  main() {
    browser.runtime.onMessage.addListener(
      (
        message: { action?: string },
        _sender,
        sendResponse: (response: unknown) => void
      ) => {
        if (message.action === 'getPageData') {
          sendResponse({
            html: document.documentElement.innerHTML,
            url: window.location.href,
            title: document.title,
          });
        }
        return false;
      }
    );
  },
});
