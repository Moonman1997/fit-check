import MeasurementForm from './components/MeasurementForm.tsx';

function Landing() {
  return (
    <div style={{ fontFamily: 'var(--fc-sans)' }} className="mx-auto max-w-xl px-6 py-10">
      {/* Brand */}
      <h1 style={{ fontFamily: 'var(--fc-serif)' }} className="text-3xl text-[#1A1A1A] mb-1">
        Fit Check
      </h1>
      <p className="text-[15px] text-[#6B7280] mb-9">
        See how any garment will fit before you buy
      </p>

      {/* Instructions */}
      <div className="mb-9">
        <h2 style={{ fontFamily: 'var(--fc-serif)' }} className="text-lg text-[#1A1A1A] mb-3.5">
          How to Use
        </h2>
        <div className="space-y-3">
          {[
            'Enter your body measurements below and save',
            'Navigate to any menswear product page',
            'Open the size chart on the page if one is available',
            'Click the Fit Check icon and select Analyze This Page'
          ].map((step, i) => (
            <div key={i} className="flex gap-3 items-baseline">
              <span style={{ fontFamily: 'var(--fc-serif)' }} className="text-[#5B7B94] text-base flex-shrink-0">
                {i + 1}.
              </span>
              <span className="text-[13.5px] text-[#6B7280] leading-[1.45]">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Section label */}
      <div className="text-[11px] uppercase tracking-[0.08em] text-[#5B7B94] font-medium mb-4">
        Your Measurements (inches)
      </div>

      {/* Form */}
      <MeasurementForm />
    </div>
  );
}

export default Landing;
