export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (message: { action?: string }, _sender, sendResponse) => {
      if (message.action === 'analyzePage') {
        console.log('Analyze page requested');
        sendResponse({ status: 'received' });
      }
      return true;
    }
  );
});
