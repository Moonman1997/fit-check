import { extractMeasurements } from '@/lib/extraction';
import { generateScorecard, getAvailableSizes } from '@/lib/scorecard';
import { getUserMeasurements } from '@/lib/storage';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (
      message: { action?: string },
      _sender,
      sendResponse: (response: unknown) => void
    ) => {
      if (message.action === 'analyzePage') {
        (async () => {
          try {
            browser.runtime.sendMessage({ action: 'showLoading' }).catch(() => {});

            const [tab] = await browser.tabs.query({
              active: true,
              currentWindow: true,
            });
            if (!tab?.id) {
              sendResponse({ status: 'error', message: 'No active tab found' });
              return;
            }

            const userMeasurements = await getUserMeasurements();
            if (!userMeasurements) {
              const msg =
                'No measurements saved. Open Fit Check settings to add your measurements.';
              browser.runtime.sendMessage({
                action: 'showError',
                message: msg,
              }).catch(() => {});
              sendResponse({ status: 'error', message: msg });
              return;
            }

            const dataUrl = await browser.tabs.captureVisibleTab({
              format: 'png',
            });
            const screenshotBase64 = dataUrl.replace(
              /^data:image\/png;base64,/,
              ''
            );

            const pageData = (await browser.tabs.sendMessage(tab.id, {
              action: 'getPageData',
            })) as { html: string; url: string; title: string };
            if (!pageData?.html) {
              const msg =
                'Could not get page HTML. Ensure the content script is loaded.';
              browser.runtime.sendMessage({
                action: 'showError',
                message: msg,
              }).catch(() => {});
              sendResponse({ status: 'error', message: msg });
              return;
            }

            const extraction = await extractMeasurements(
              screenshotBase64,
              pageData.html
            );
            console.log(
              'Extraction result:',
              JSON.stringify(extraction, null, 2)
            );

            const sizes = getAvailableSizes(extraction);
            if (sizes.length === 0) {
              const msg = 'No garment measurements found on this page.';
              browser.runtime.sendMessage({
                action: 'showError',
                message: msg,
              }).catch(() => {});
              sendResponse({ status: 'error', message: msg });
              return;
            }

            let scorecard: ReturnType<typeof generateScorecard>;
            let initialWaist: number | undefined;
            let initialLength: number | undefined;

            if (extraction.sizingFormat === 'waist-length') {
              const waistOpts = extraction.labeledWaistOptions ?? [];
              const lengthOpts = extraction.labeledLengthOptions ?? [];
              initialWaist =
                waistOpts.length > 0
                  ? waistOpts.reduce((a, b) =>
                      Math.abs(a - userMeasurements.waist) <=
                      Math.abs(b - userMeasurements.waist)
                        ? a
                        : b
                    )
                  : undefined;
              initialLength =
                lengthOpts.length > 0
                  ? lengthOpts.reduce((a, b) =>
                      Math.abs(a - userMeasurements.inseam) <=
                      Math.abs(b - userMeasurements.inseam)
                        ? a
                        : b
                    )
                  : undefined;
              scorecard = generateScorecard(
                extraction,
                userMeasurements,
                'default',
                initialWaist,
                initialLength
              );
            } else {
              scorecard = generateScorecard(
                extraction,
                userMeasurements,
                sizes[0]
              );
            }

            browser.runtime.sendMessage({
              action: 'showResults',
              data: {
                extraction,
                scorecard,
                availableSizes: sizes,
                userMeasurements,
                initialWaist,
                initialLength,
              },
            }).catch(() => {});

            sendResponse({ status: 'success', data: { extraction, scorecard } });
          } catch (err) {
            const message =
              err instanceof Error ? err.message : String(err);
            console.error('Extraction failed:', err);
            browser.runtime.sendMessage({
              action: 'showError',
              message,
            }).catch(() => {});
            sendResponse({ status: 'error', message });
          }
        })();
        return true;
      }
      return false;
    }
  );
});
