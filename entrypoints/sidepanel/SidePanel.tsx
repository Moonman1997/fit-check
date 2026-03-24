import { useCallback, useEffect, useState } from 'react';
import { browser } from 'wxt/browser';
import { generateScorecard } from '@/lib/scorecard';
import type {
  ExtractionResult,
  ScorecardResult,
  UserMeasurements,
} from '@/lib/types';
import CalloutsSection from './components/CalloutsSection.tsx';
import ScorecardTable from './components/ScorecardTable.tsx';
import SizeSelector from './components/SizeSelector.tsx';

type DisplayState = 'idle' | 'loading' | 'results' | 'error';

const SIZE_BUTTON_BASE =
  'px-3.5 py-1.5 text-[13px] font-medium border rounded-md transition-colors';
const SIZE_BUTTON_DEFAULT =
  'border-[#E8E6E3] bg-white text-[#6B7280] hover:border-[#5B7B94] hover:text-[#5B7B94]';
const SIZE_BUTTON_ACTIVE = 'bg-[#5B7B94] border-[#5B7B94] text-white';

function SidePanel() {
  const [displayState, setDisplayState] = useState<DisplayState>('loading');
  const [scorecardData, setScorecardData] = useState<ScorecardResult | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);
  const [userMeasurements, setUserMeasurements] =
    useState<UserMeasurements | null>(null);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedWaist, setSelectedWaist] = useState<number | null>(null);
  const [selectedLength, setSelectedLength] = useState<number | null>(null);

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
          initialWaist?: number;
          initialLength?: number;
        };
        setExtraction(data.extraction);
        setUserMeasurements(data.userMeasurements);
        setAvailableSizes(data.availableSizes);
        setScorecardData(data.scorecard);
        setSelectedSize(data.scorecard.size);
        setSelectedWaist(data.initialWaist ?? null);
        setSelectedLength(data.initialLength ?? null);
        setDisplayState('results');
        setErrorMessage('');
      } else if (message.action === 'showLoading') {
        setDisplayState('loading');
        setScorecardData(null);
        setSelectedWaist(null);
        setSelectedLength(null);
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

  useEffect(() => {
    if (displayState === 'loading' || displayState === 'idle') {
      const timeout = setTimeout(() => {
        setDisplayState('error');
        setErrorMessage(
          'Analysis is taking too long. Please refresh the page and try again.'
        );
      }, 25000);
      return () => clearTimeout(timeout);
    }
  }, [displayState]);

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

  const handleWaistChange = useCallback(
    (waist: number) => {
      if (!extraction || !userMeasurements) return;
      setSelectedWaist(waist);
      const newScorecard = generateScorecard(
        extraction,
        userMeasurements,
        'default',
        waist,
        selectedLength ?? undefined
      );
      setScorecardData(newScorecard);
    },
    [extraction, userMeasurements, selectedLength]
  );

  const handleLengthChange = useCallback(
    (length: number) => {
      if (!extraction || !userMeasurements) return;
      setSelectedLength(length);
      const newScorecard = generateScorecard(
        extraction,
        userMeasurements,
        'default',
        selectedWaist ?? undefined,
        length
      );
      setScorecardData(newScorecard);
    },
    [extraction, userMeasurements, selectedWaist]
  );

  if (displayState === 'idle' || displayState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <div style={{ fontFamily: 'var(--fc-serif)' }} className="text-xl text-[#1A1A1A] mb-5">
          Fit Check
        </div>
        <div className="w-28 h-0.5 bg-[#E8E6E3] rounded-full overflow-hidden mb-3 relative">
          <div className="absolute h-full w-2/5 bg-[#5B7B94] rounded-full animate-slide" />
        </div>
        <div className="text-[12.5px] text-[#9CA3AF] tracking-wide">
          Analyzing measurements…
        </div>
      </div>
    );
  }

  if (displayState === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
        <div style={{ fontFamily: 'var(--fc-serif)' }} className="text-xl text-[#1A1A1A] mb-3">
          Fit Check
        </div>
        <div className="text-[13.5px] text-red-600 leading-relaxed mb-4">
          {errorMessage}
        </div>
        <button
          type="button"
          onClick={() => {
            void navigator.clipboard.writeText(errorMessage);
          }}
          className="text-[12px] text-[#5B7B94] border border-[#E8E6E3] rounded-md px-3 py-1.5 hover:bg-[#F8F7F5] transition-colors"
        >
          Copy error message
        </button>
        <button
          type="button"
          onClick={() => {
            setDisplayState('loading');
            setErrorMessage('');
            browser.runtime.sendMessage({ action: 'analyzePage' }).catch(() => {});
          }}
          className="text-[12px] text-white bg-[#5B7B94] rounded-md px-3 py-1.5 hover:bg-[#4D6B82] transition-colors mt-2"
        >
          Try again
        </button>
      </div>
    );
  }

  const data = scorecardData;
  if (!data) return null;

  const isWaistLength = extraction?.sizingFormat === 'waist-length';
  const garmentSubType =
    data.garmentSubType.charAt(0).toUpperCase() + data.garmentSubType.slice(1);
  const sizeLabel =
    isWaistLength && selectedWaist != null && selectedLength != null
      ? `${selectedWaist}W × ${selectedLength}L`
      : `Size ${data.size}`;

  return (
    <div className="flex flex-col gap-3 px-5 py-5">
      <div
        style={{ fontFamily: 'var(--fc-serif)' }}
        className="text-[22px] text-[#1A1A1A] mb-3 tracking-[0.01em]"
      >
        {garmentSubType} — {sizeLabel}
      </div>

      {isWaistLength && extraction ? (
        <div>
          <div className="mb-3">
            <div className="text-[11px] uppercase tracking-[0.06em] text-[#9CA3AF] font-medium mb-1.5">
              Waist
            </div>
            <div className="flex flex-wrap gap-1.5">
              {extraction.labeledWaistOptions?.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => handleWaistChange(w)}
                  className={`${SIZE_BUTTON_BASE} ${
                    selectedWaist === w ? SIZE_BUTTON_ACTIVE : SIZE_BUTTON_DEFAULT
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-3">
            <div className="text-[11px] uppercase tracking-[0.06em] text-[#9CA3AF] font-medium mb-1.5">
              Length
            </div>
            <div className="flex flex-wrap gap-1.5">
              {extraction.labeledLengthOptions?.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => handleLengthChange(l)}
                  className={`${SIZE_BUTTON_BASE} ${
                    selectedLength === l ? SIZE_BUTTON_ACTIVE : SIZE_BUTTON_DEFAULT
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <SizeSelector
          sizes={availableSizes}
          selectedSize={selectedSize}
          onSizeChange={handleSizeChange}
        />
      )}

      <ScorecardTable
        result={data}
        bodyMeasurementNote={extraction?.bodyMeasurementNote}
      />

      <CalloutsSection
        measurements={data.measurements}
        garmentSubType={data.garmentSubType}
      />

      {(data.fabricInfo || data.brandFitNotes) && (
        <div className="border-t border-[#E8E6E3] pt-3 text-[12px] text-[#6B7280]">
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
