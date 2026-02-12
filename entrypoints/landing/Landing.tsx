import MeasurementForm from './components/MeasurementForm.tsx';

function Landing() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-3xl font-bold">Fit Check</h1>
      <p className="mb-8 mt-2 text-lg text-gray-600">
        Understand how garments will fit your body
      </p>

      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Your Measurements</h2>
        <MeasurementForm />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">How to Use Fit Check</h2>
        <ol className="list-decimal space-y-2 pl-5 text-gray-700">
          <li>Enter your measurements above and save</li>
          <li>Navigate to any menswear product page</li>
          <li>Click the Fit Check extension icon</li>
          <li>Click &quot;Analyze This Page&quot; to see your fit scorecard</li>
        </ol>
        <p className="mt-6 text-sm text-gray-600">
          <strong>How to Provide Feedback:</strong> Found a bug or have feedback?
          Send a screenshot and description to [placeholder email]
        </p>
      </section>
    </div>
  );
}

export default Landing;
