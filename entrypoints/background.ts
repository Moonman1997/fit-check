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
      if (message.action === 'ping') {
        sendResponse({ status: 'ok' });
        return false;
      }
      if (message.action === 'analyzePage') {
        (async () => {
          let analysisPromise: Promise<void> | undefined;
          try {
            browser.runtime.sendMessage({ action: 'showLoading' }).catch(() => {});

            let analysisTimedOut = false;
            const timeoutPromise = new Promise<never>((_, reject) =>
              setTimeout(() => {
                console.log('FITCHECK: Analysis timed out');
                analysisTimedOut = true;
                reject(new Error('TIMEOUT'));
              }, 20000)
            );

            analysisPromise = (async () => {
              const [tab] = await browser.tabs.query({
                active: true,
                currentWindow: true,
              });
              if (!tab?.id) {
                throw new Error('No active tab found');
              }

              console.log('FITCHECK: Analyze started', tab.url);

              const userMeasurements = await getUserMeasurements();
              if (!userMeasurements) {
                throw new Error(
                  'No measurements saved. Open Fit Check settings to add your measurements.'
                );
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
                throw new Error(
                  'Could not get page HTML. Ensure the content script is loaded.'
                );
              }

              const extraction = await extractMeasurements(
                screenshotBase64,
                pageData.html
              );

              console.log(
                'FITCHECK: Extraction result',
                JSON.stringify(extraction, null, 2)
              );

              const sizes = getAvailableSizes(extraction);
              if (sizes.length === 0) {
                throw new Error('No garment measurements found on this page.');
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

              console.log(
                'FITCHECK: Scorecard generated for size',
                scorecard.size
              );

              if (analysisTimedOut) {
                return;
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

              console.log('FITCHECK: Results sent to side panel');

              sendResponse({ status: 'success', data: { extraction, scorecard } });
            })();

            await Promise.race([analysisPromise, timeoutPromise]);
          } catch (err) {
            void analysisPromise?.catch(() => {});
            const errorMessage =
              err instanceof Error ? err.message : String(err);

            let userMessage: string;
            if (errorMessage === 'TIMEOUT') {
              userMessage =
                'Analysis timed out. Please refresh the page and try again.';
            } else if (
              errorMessage.includes('429') ||
              errorMessage.includes('rate_limit')
            ) {
              userMessage = 'Rate limited. Please wait a minute and try again.';
            } else if (
              errorMessage.includes('400') ||
              errorMessage.includes('401') ||
              errorMessage.includes('API key')
            ) {
              userMessage =
                'API configuration error. Please contact the developer.';
            } else if (errorMessage.includes('No garment measurements')) {
              userMessage = errorMessage;
            } else if (errorMessage.includes('No measurements saved')) {
              userMessage = errorMessage;
            } else {
              userMessage =
                'Something went wrong. Please refresh the page and try again.';
            }

            console.log('FITCHECK: Error', errorMessage);

            browser.runtime.sendMessage({
              action: 'showError',
              message: userMessage,
            }).catch(() => {});
            sendResponse({ status: 'error', message: userMessage });
          }
        })();
        return true;
      }
      return false;
    }
  );
});
