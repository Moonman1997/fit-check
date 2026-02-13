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

  useEffect(() => {
    hasMeasurements().then((exists) => {
      setMeasurementsExist(exists);
      setLoading(false);
    });
  }, []);

  function handleAnalyze() {
    browser.runtime.sendMessage({ action: 'analyzePage' });
  }

  if (loading) {
    return (
      <div className="w-64 p-4">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!measurementsExist) {
    return (
      <div className="w-64 space-y-4 p-4">
        <p className="text-sm text-gray-700">
          Add your measurements to use Fit Check
        </p>
        <button
          type="button"
          onClick={openLandingPage}
          className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Get Started
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 space-y-3 p-4">
      <button
        type="button"
        onClick={handleAnalyze}
        className="w-full rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Analyze This Page
      </button>
      <button
        type="button"
        onClick={openLandingPage}
        className="w-full rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        My Profile
      </button>
    </div>
  );
}

export default App;
