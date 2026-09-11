import ScoreRing from './ScoreRing';

function ResultsDashboard({ analysis, onReset }) {
  const { ats_score, missing_keywords, suggestions, formatting_issues } = analysis;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="bg-white rounded-3xl p-8 shadow-lg shadow-indigo-100 text-center">
        <p className="font-display text-sm text-ink-soft mb-4 tracking-wide">YOUR ATS SCORE</p>
        <ScoreRing score={ats_score} />
      </div>

      {missing_keywords?.length > 0 && (
        <div className="bg-flag-soft rounded-3xl p-6">
          <p className="font-display font-semibold text-flag mb-3">🔍 Missing keywords</p>
          <div className="flex flex-wrap gap-2">
            {missing_keywords.map((k, i) => (
              <span key={i} className="px-3 py-1.5 bg-white rounded-full text-sm font-medium text-ink shadow-sm">
                {k}
              </span>
            ))}
          </div>
        </div>
      )}

      {suggestions?.length > 0 && (
        <div className="bg-primary-soft rounded-3xl p-6">
          <p className="font-display font-semibold text-primary mb-3">💡 Suggestions</p>
          <ul className="space-y-3">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink leading-relaxed">
                <span className="text-primary font-bold shrink-0">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {formatting_issues?.length > 0 && (
        <div className="bg-good-soft rounded-3xl p-6">
          <p className="font-display font-semibold text-emerald-700 mb-3">⚠️ Formatting notes</p>
          <ul className="space-y-2">
            {formatting_issues.map((f, i) => (
              <li key={i} className="text-sm text-ink-soft leading-relaxed">• {f}</li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onReset}
        className="w-full rounded-xl bg-white text-primary font-display font-semibold py-3.5 shadow-md hover:shadow-lg transition"
      >
        Analyze another resume
      </button>
    </div>
  );
}

export default ResultsDashboard;