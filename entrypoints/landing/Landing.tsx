import MeasurementForm from './components/MeasurementForm.tsx';

function Landing() {
  return (
    <div style={{ fontFamily: 'var(--fc-sans)' }} className="mx-auto max-w-xl px-6 py-10">
      {/* Brand */}
      <h1 style={{ fontFamily: 'var(--fc-serif)' }} className="text-3xl text-[#1A1A1A] mb-1">
        Fit Check
      </h1>
      <p className="text-[15px] text-[#6B7280] mb-9">
        Understand how garments will fit your body before you buy
      </p>

      {/* Section label */}
      <div className="text-[11px] uppercase tracking-[0.08em] text-[#5B7B94] font-medium mb-4">
        Your Measurements (inches)
      </div>

      {/* Form */}
      <MeasurementForm />

      {/* How It Works */}
      <div className="border-t border-[#E8E6E3] mt-9 pt-7">
        <h2 style={{ fontFamily: 'var(--fc-serif)' }} className="text-lg text-[#1A1A1A] mb-5 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div>
            <div className="mx-auto w-12 h-12 rounded-full border border-[#E8E6E3] flex items-center justify-center mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7B94" strokeWidth="1.5" strokeLinecap="round">
                <path d="M2 12h20M12 2v20M7 7l0 0M17 7l0 0M7 17l0 0M17 17l0 0"/>
              </svg>
            </div>
            <div className="text-[11px] text-[#1A1A1A] font-medium leading-tight">1. Measure yourself</div>
          </div>
          <div>
            <div className="mx-auto w-12 h-12 rounded-full border border-[#E8E6E3] flex items-center justify-center mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7B94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M9 3v18M3 9h18"/>
              </svg>
            </div>
            <div className="text-[11px] text-[#1A1A1A] font-medium leading-tight">2. Open size chart</div>
          </div>
          <div>
            <div className="mx-auto w-12 h-12 rounded-full border border-[#E8E6E3] flex items-center justify-center mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7B94" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
              </svg>
            </div>
            <div className="text-[11px] text-[#1A1A1A] font-medium leading-tight">3. Click analyze</div>
          </div>
          <div>
            <div className="mx-auto w-12 h-12 rounded-full border border-[#E8E6E3] flex items-center justify-center mb-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B7B94" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
            </div>
            <div className="text-[11px] text-[#1A1A1A] font-medium leading-tight">4. Understand your fit</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
