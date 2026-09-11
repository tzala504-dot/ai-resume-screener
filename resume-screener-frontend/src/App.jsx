import { useState } from 'react';
import UploadForm from './UploadForm';
import ResultsDashboard from './ResultsDashboard';

function App() {
  const [analysis, setAnalysis] = useState(null);

  return (
    <div className="min-h-screen py-16 px-6">
      {!analysis ? (
        <UploadForm onAnalysisComplete={setAnalysis} />
      ) : (
        <ResultsDashboard analysis={analysis} onReset={() => setAnalysis(null)} />
      )}
    </div>
  );
}

export default App;