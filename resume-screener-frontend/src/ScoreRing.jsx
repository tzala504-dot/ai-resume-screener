function ScoreRing({ score }) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const tone = score >= 75 ? '#10B981' : score >= 50 ? '#4F46E5' : '#F97316';

    return (
        <div className="relative w-44 h-44 mx-auto">
            <svg className="-rotate-90 w-44 h-44">
                <circle cx="88" cy="88" r={radius} stroke="#E5E7EB" strokeWidth="14" fill="none" />
                <circle
                    cx="88" cy="88" r={radius}
                    stroke={tone} strokeWidth="14" fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-4xl font-bold text-ink">{score}</span>
                <span className="text-xs text-ink-soft">/ 100</span>
            </div>
        </div>
    );
}

export default ScoreRing;