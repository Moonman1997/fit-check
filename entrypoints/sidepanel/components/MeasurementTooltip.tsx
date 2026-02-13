import { useEffect, useRef, useState } from 'react';
import { measurementDescriptions } from '@/lib/descriptions';

interface MeasurementTooltipProps {
  measurementKey: string;
}

function MeasurementTooltip({ measurementKey }: MeasurementTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const description = measurementDescriptions[measurementKey];

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  if (!description) return null;

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-gray-100 text-[10px] text-gray-500 hover:bg-gray-200"
        aria-label="Measurement info"
      >
        ⓘ
      </button>
      {isOpen && (
        <div
          className="absolute left-0 top-6 z-50 max-w-[min(360px,85vw)] rounded border border-gray-200 bg-white p-3 shadow-lg"
          role="dialog"
          aria-label="Measurement description"
        >
          <div className="space-y-2 text-xs">
            <div>
              <div className="font-medium text-gray-700">What this means</div>
              <p className="mt-0.5 text-gray-600">{description.whatThisMeans}</p>
            </div>
            <div>
              <div className="font-medium text-gray-700">
                How this shows up in wear
              </div>
              <ul className="mt-0.5 list-inside list-disc space-y-0.5 text-gray-600">
                {description.howThisShowsUpInWear.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-medium text-gray-700">Context</div>
              <p className="mt-0.5 text-gray-600">{description.context}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MeasurementTooltip;
