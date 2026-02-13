import { useCallback, useEffect, useState } from 'react';
import type { ScorecardResult } from '@/lib/types';
import CalloutsSection from './components/CalloutsSection.tsx';
import MissingMeasurements from './components/MissingMeasurements.tsx';
import ScorecardTable from './components/ScorecardTable.tsx';
import SizeSelector from './components/SizeSelector.tsx';

const TEST_DATA: ScorecardResult = {
  size: 'M',
  garmentType: 'top',
  garmentSubType: 'hoodie',
  measurements: [
    {
      measurementName: 'Chest',
      garmentValue: 22,
      delta: 5.0,
      fitCategory: {
        category: 'Neutral Fit',
        universalMeaning:
          'Fabric hangs near chest without touching ribs when standing; chest shape softened rather than defined. Room for a standard base layer or light sweater.',
      },
      callouts: [
        'Heavier knit fabrics amplify chest volume perception. Lower ease limits layering.',
      ],
      isApproximation: false,
    },
    {
      measurementName: 'Shoulder',
      garmentValue: 19.5,
      delta: 1.5,
      fitCategory: {
        category: 'Dropped',
        universalMeaning:
          'Sleeve starts clearly below shoulder edge. Relaxed, looser upper-body shape. Sleeves appear longer; shoulder line softened.',
      },
      callouts: [
        'Dropped shoulders are common and increase visual sleeve length. Narrow shoulders may be less noticeable due to relaxed knit structure.',
      ],
      isApproximation: false,
    },
    {
      measurementName: 'Sleeve Length',
      garmentValue: 26,
      delta: 0.3,
      fitCategory: {
        category: 'Aligned',
        universalMeaning:
          'Cuff meets wrist bone directly; neither wrist nor hand visibly covered. Neutral sleeve position.',
      },
      callouts: [
        'Ribbed cuffs grip wrist, prevent hand coverage. Extra length pools above cuff.',
      ],
      isApproximation: false,
    },
    {
      measurementName: 'Front Length',
      garmentValue: 28,
      delta: 0.06,
      fitCategory: {
        category: 'Extended',
        universalMeaning:
          'Hem sits below waistband onto hip. Belt line and pocket openings covered. Hem reaches toward lower half of front pockets.',
      },
      callouts: [
        'Ribbed/elastic hems (hoodies, sweaters): May bunch rather than hang straight at longer lengths.',
      ],
      isApproximation: false,
    },
  ],
  fabricInfo: '80% Cotton, 20% Polyester',
  brandFitNotes: 'Relaxed fit',
  missingMeasurements: [],
};

const TEST_BOTTOMS_DATA: ScorecardResult = {
  size: '32',
  garmentType: 'bottom',
  garmentSubType: 'jeans',
  measurements: [
    {
      measurementName: 'Waist',
      garmentValue: 16.5,
      delta: 1.0,
      fitCategory: {
        category: 'Aligned Waist',
        universalMeaning:
          'Waistband matches body circumference with minimal air space; closure fastens comfortably without pulling or gaping. Stays in position without belt; breathing and sitting unrestricted.',
      },
      callouts: [],
      isApproximation: false,
    },
    {
      measurementName: 'Thigh',
      garmentValue: 12,
      delta: 2.0,
      fitCategory: {
        category: 'Close Thigh',
        universalMeaning:
          'Fits close to leg with limited extra room. Movement feels firm and controlled.',
      },
      callouts: [],
      isApproximation: false,
    },
    {
      measurementName: 'Inseam',
      garmentValue: 32,
      delta: 0.5,
      fitCategory: {
        category: 'Long Length',
        universalMeaning:
          'Hem extends past ankle bone onto footwear; gentle stacking creates light break at vamp or laces. Hem partially covers shoe.',
      },
      callouts: [],
      isApproximation: false,
    },
    {
      measurementName: 'Rise',
      garmentValue: 10.5,
      delta: null,
      fitCategory: {
        category: 'Extended Rise',
        universalMeaning:
          'Substantial room through seat, hips, and upper thighs. Comfortable at typical hip height with flexibility to wear higher if desired.',
      },
      callouts: [],
      isApproximation: false,
    },
  ],
  fabricInfo: '99% Cotton, 1% Elastane',
  missingMeasurements: [
    {
      name: 'Leg Opening',
      impact: 'Leg silhouette (taper vs straight) cannot be determined.',
    },
  ],
};

type DisplayState = 'idle' | 'loading' | 'results' | 'error';

function SidePanel() {
  const [displayState, setDisplayState] = useState<DisplayState>('results');
  const [scorecardData, setScorecardData] = useState<ScorecardResult | null>(
    TEST_DATA
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [testDataToggle, setTestDataToggle] = useState<'tops' | 'bottoms'>(
    'tops'
  );
  const [selectedSize, setSelectedSize] = useState<string>('M');

  // State setters for Phase 7 messaging — will be called from message listener
  const setIdle = useCallback(() => {
    setDisplayState('idle');
    setScorecardData(null);
    setErrorMessage('');
  }, []);
  const setLoading = useCallback(() => {
    setDisplayState('loading');
    setScorecardData(null);
    setErrorMessage('');
  }, []);
  const setResults = useCallback((data: ScorecardResult) => {
    setDisplayState('results');
    setScorecardData(data);
    setErrorMessage('');
  }, []);
  const setError = useCallback((message: string) => {
    setDisplayState('error');
    setScorecardData(null);
    setErrorMessage(message);
  }, []);

  const activeTestData =
    testDataToggle === 'tops' ? TEST_DATA : TEST_BOTTOMS_DATA;
  const testSizes =
    testDataToggle === 'tops'
      ? ['S', 'M', 'L', 'XL']
      : ['30', '32', '34', '36'];

  useEffect(() => {
    setSelectedSize(testDataToggle === 'tops' ? 'M' : '32');
  }, [testDataToggle]);

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

  // results state — Phase 5A uses test data, toggle switches between tops/bottoms
  const data = displayState === 'results' ? activeTestData : null;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-3">
        <h1 className="text-lg font-semibold">
          {data.garmentSubType.charAt(0).toUpperCase() +
            data.garmentSubType.slice(1)}{' '}
          — Size {data.size}
        </h1>
        <button
          type="button"
          onClick={() =>
            setTestDataToggle((t) => (t === 'tops' ? 'bottoms' : 'tops'))
          }
          className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50"
        >
          {testDataToggle === 'tops' ? 'Show bottoms' : 'Show tops'}
        </button>
      </div>

      <SizeSelector
        sizes={testSizes}
        selectedSize={selectedSize}
        onSizeChange={setSelectedSize}
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
