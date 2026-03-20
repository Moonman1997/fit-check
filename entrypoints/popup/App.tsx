import { useState, useEffect } from 'react';
import { browser } from 'wxt/browser';
import { hasMeasurements } from '@/lib/storage';

function openLandingPage() {
  browser.tabs.create({ url: browser.runtime.getURL('/landing.html') });
  window.close();
}

function App() {
  const [loading, setLoading] = useState(true);
  const [measurementsExist, setMeasurementsExist] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const exists = await hasMeasurements();
        setMeasurementsExist(exists);
      } catch {
        setMeasurementsExist(false);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  async function handleAnalyze() {
    setError(null);
    try {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (!tab?.id) {
        setError('Something went wrong. Try again.');
        return;
      }
      const chromeApi = (globalThis as any).chrome;
      if (chromeApi?.sidePanel?.open) {
        await chromeApi.sidePanel.open({ tabId: tab.id });
      }
      browser.runtime.sendMessage({ action: 'analyzePage' });
      window.close();
    } catch {
      setError('Something went wrong. Try again.');
    }
  }

  if (loading) {
    return (
      <div className="w-64 p-5 text-center">
        <p className="text-[13px] text-[#9CA3AF]">Loading...</p>
      </div>
    );
  }

  if (!measurementsExist) {
    return (
      <div className="w-64 space-y-4 p-5 text-center">
        <div style={{ fontFamily: 'var(--fc-serif)' }} className="text-lg text-[#1A1A1A] mb-4">
          Fit Check
        </div>
        <p className="text-[13px] text-[#6B7280]">
          Add your measurements to use Fit Check
        </p>
        <button
          type="button"
          onClick={openLandingPage}
          className="w-full py-2.5 bg-[#5B7B94] text-white text-[13.5px] font-medium rounded-md hover:bg-[#4D6B82] tracking-[0.02em]"
        >
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 space-y-3 p-5 text-center">
      <div style={{ fontFamily: 'var(--fc-serif)' }} className="text-lg text-[#1A1A1A] mb-4">
        Fit Check
      </div>
      <button
        type="button"
        onClick={handleAnalyze}
        className="w-full py-2.5 bg-[#5B7B94] text-white text-[13.5px] font-medium rounded-md hover:bg-[#4D6B82] tracking-[0.02em]"
      >
        Analyze This Page
      </button>
      <p className="text-[11px] text-[#9CA3AF] text-center leading-relaxed">
        For best results, open the size chart on the product page before analyzing
      </p>
      {error && (
        <p className="text-[13px] text-red-600">{error}</p>
      )}
      <button
        type="button"
        onClick={openLandingPage}
        className="w-full py-2.5 bg-transparent text-[#6B7280] text-[13.5px] font-medium rounded-md border border-[#E8E6E3] hover:bg-[#F8F7F5]"
      >
        My Profile
      </button>
    </div>
  );
}

export default App;
