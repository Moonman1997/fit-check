import { useState, useEffect } from 'react';
import { getUserMeasurements, saveUserMeasurements } from '@/lib/storage';
import type { UserMeasurements } from '@/lib/types';

const FIELDS: {
  key: keyof UserMeasurements;
  label: string;
  helperText: string;
  colSpan?: number;
}[] = [
  { key: 'height', label: 'Height', helperText: 'Your total height (e.g., 70 for 5\'10")' },
  { key: 'chest', label: 'Chest', helperText: 'Around the fullest part of your chest, under arms' },
  {
    key: 'shoulderWidth',
    label: 'Shoulder Width',
    helperText: 'Point to point across your back, from one shoulder edge to the other',
  },
  {
    key: 'sleeveLength',
    label: 'Sleeve Length',
    helperText: 'Center-back of neck to wrist bone (tailor measurement)',
  },
  { key: 'waist', label: 'Waist', helperText: 'Around where you typically wear pants' },
  { key: 'inseam', label: 'Inseam', helperText: 'Crotch seam to ankle bone along inner leg' },
  { key: 'thigh', label: 'Thigh', helperText: 'Around the fullest part of one thigh', colSpan: 2 },
];

const initialValues: UserMeasurements = {
  height: 0,
  inseam: 0,
  chest: 0,
  waist: 0,
  thigh: 0,
  shoulderWidth: 0,
  sleeveLength: 0,
};

function MeasurementForm() {
  const [values, setValues] = useState<UserMeasurements>(initialValues);
  const [loaded, setLoaded] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const stored = await getUserMeasurements();
        if (stored) {
          setValues(stored);
        }
      } catch {
        setErrorMessage('Could not load measurements.');
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(false), 2500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  function handleChange(key: keyof UserMeasurements, value: string) {
    const num = parseFloat(value);
    setValues((prev) => ({ ...prev, [key]: num || 0 }));
    setErrorMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    const allPositive = FIELDS.every(
      (field) => values[field.key] > 0
    );

    if (!allPositive) {
      setErrorMessage('All fields must be filled with positive numbers.');
      return;
    }

    try {
      await saveUserMeasurements(values);
      setSuccessMessage(true);
    } catch {
      setErrorMessage('Could not save measurements. Please try again.');
    }
  }

  if (!loaded) {
    return (
      <div className="text-[13px] text-[#9CA3AF]">Loading...</div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {FIELDS.map(({ key, label, helperText, colSpan }) => (
          <div
            key={key}
            className={colSpan === 2 ? 'col-span-2' : ''}
          >
            <label
              htmlFor={key}
              className="text-[13px] font-medium text-[#1A1A1A] mb-1 block"
            >
              {label}
            </label>
            <input
              id={key}
              type="number"
              step="0.1"
              min="0"
              value={values[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              className="w-full px-3 py-2.5 text-[14px] border border-[#E8E6E3] rounded-md bg-white focus:outline-none focus:border-[#5B7B94] transition-colors"
            />
            <p className="text-[11.5px] text-[#9CA3AF] mt-1">{helperText}</p>
          </div>
        ))}
      </div>

      {errorMessage && (
        <p className="text-[13px] text-red-600">{errorMessage}</p>
      )}

      {successMessage && (
        <p className="text-[13px] text-[#5B7B94] mt-2">Measurements saved!</p>
      )}

      <button
        type="submit"
        className="w-full py-3 bg-[#5B7B94] text-white text-[14px] font-medium rounded-md hover:bg-[#4D6B82] transition-colors tracking-[0.02em]"
      >
        Save Measurements
      </button>
    </form>
  );
}

export default MeasurementForm;
