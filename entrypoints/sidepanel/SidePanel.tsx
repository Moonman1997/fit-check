import { useCallback, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { generateScorecard } from '@/lib/scorecard';
import type {
  ExtractionResult,
  ScorecardResult,
  UserMeasurements,
} from '@/lib/types';
import CalloutsSection from './components/CalloutsSection.tsx';
import MissingMeasurements from './components/MissingMeasurements.tsx';
import ScorecardTable from './components/ScorecardTable.tsx';
import SizeSelector from './components/SizeSelector.tsx';

type DisplayState = 'idle' | 'loading' | 'results' | 'error';

function SidePanel() {
  const [displayState, setDisplayState] = useState<DisplayState>('idle');
  const [scorecardData, setScorecardData] = useState<ScorecardResult | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [userMeasurements, setUserMeasurements] =
    useState<UserMeasurements | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');

  const handleMessage = useCallback(
    (
      message: { action?: string; data?: unknown; message?: string },
      _sender: unknown,
      _sendResponse: (response?: unknown) => void
    ) => {
      if (message.action === 'showResults' && message.data) {
        const data = message.data as {
          extraction: ExtractionResult;
          scorecard: ScorecardResult;
          availableSizes: string[];
          userMeasurements: UserMeasurements;
        };
        setExtraction(data.extraction);
        setUserMeasurements(data.userMeasurements);
        setAvailableSizes(data.availableSizes);
        setScorecardData(data.scorecard);
        setSelectedSize(data.scorecard.size);
        setDisplayState('results');
        setErrorMessage('');
      } else if (message.action === 'showLoading') {
        setDisplayState('loading');
        setScorecardData(null);
        setErrorMessage('');
      } else if (message.action === 'showError' && message.message) {
        setDisplayState('error');
        setScorecardData(null);
        setErrorMessage(message.message);
      }
    },
    []
  );

  useEffect(() => {
    browser.runtime.onMessage.addListener(handleMessage);
    return () => {
      browser.runtime.onMessage.removeListener(handleMessage);
    };
  }, [handleMessage]);

  const handleSizeChange = useCallback(
    (newSize: string) => {
      if (!extraction || !userMeasurements) return;
      setSelectedSize(newSize);
      const newScorecard = generateScorecard(
        extraction,
        userMeasurements,
        newSize
      );
      setScorecardData(newScorecard);
    },
    [extraction, userMeasurements]
  );

  if (displayState === 'idle') {
    return (
      <div className="p-4 text-sm text-gray-600">
        Navigate to a product page and click Analyze This Page
      </div>
    );
  }

  if (displayState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <div className="mb-2 h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        <p>Analyzing...</p>
      </div>
    );
  }

  if (displayState === 'error') {
    return (
      <div className="p-4 text-sm text-red-600">{errorMessage}</div>
    );
  }

  const data = scorecardData;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="border-b border-gray-200 pb-3">
        <h1 className="text-lg font-semibold">
          {data.garmentSubType.charAt(0).toUpperCase() +
            data.garmentSubType.slice(1)}{' '}
          — Size {data.size}
        </h1>
      </div>

      <SizeSelector
        sizes={availableSizes}
        selectedSize={selectedSize}
        onSizeChange={handleSizeChange}
      />

      <ScorecardTable result={data} />

      <CalloutsSection
        measurements={data.measurements}
        garmentSubType={data.garmentSubType}
      />

      <MissingMeasurements missingMeasurements={data.missingMeasurements} />

      {(data.fabricInfo || data.brandFitNotes) && (
        <div className="border-t border-gray-200 pt-3 text-xs text-gray-500">
          {data.fabricInfo && (
            <div>Fabric: {data.fabricInfo}</div>
          )}
          {data.brandFitNotes && (
            <div>Fit notes: {data.brandFitNotes}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default SidePanel;
