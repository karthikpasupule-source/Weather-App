import React, { useState } from 'react';
import {
  Shirt,
  Sun,
  Umbrella,
  Activity,
  Utensils,
  SunDim,
  Compass,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  Sparkles,
} from 'lucide-react';
import { CurrentWeather, DailyForecastData } from '../types/weather';
import { generatePlanningRecommendations } from '../utils/weatherUtils';

interface PlanningRecommendationsProps {
  current: CurrentWeather;
  daily?: DailyForecastData;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Shirt,
  Sun,
  Umbrella,
  Activity,
  Utensils,
  SunDim,
};

export const PlanningRecommendations: React.FC<PlanningRecommendationsProps> = ({
  current,
  daily,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const recommendations = generatePlanningRecommendations(current, daily);

  const categories = [
    { id: 'all', label: 'All Advice' },
    { id: 'clothing', label: 'Clothing Guide' },
    { id: 'outdoor', label: 'Outdoor Fitness & Dining' },
    { id: 'health', label: 'Sun & Health Risk' },
    { id: 'travel', label: 'Travel & Rain' },
  ];

  const filteredRecs = recommendations.filter(
    (rec) => activeCategory === 'all' || rec.category === activeCategory
  );

  const getScoreBadge = (score: string) => {
    switch (score) {
      case 'excellent':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          icon: CheckCircle2,
          label: 'Optimal',
        };
      case 'good':
        return {
          bg: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
          icon: Info,
          label: 'Favorable',
        };
      case 'caution':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          icon: AlertTriangle,
          label: 'Caution Required',
        };
      case 'poor':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
          icon: XCircle,
          label: 'Not Recommended',
        };
      default:
        return {
          bg: 'bg-slate-800 border-slate-700 text-slate-300',
          icon: Info,
          label: 'Info',
        };
    }
  };

  return (
    <div
      id="planning-recommendations-section"
      className="rounded-3xl bg-[#141417] border border-white/10 shadow-2xl p-6 md:p-8 backdrop-blur-xl h-full flex flex-col justify-between"
    >
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <h3 className="text-xl font-bold text-white tracking-tight">
                Smart Planning Recommendations
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Real-time advice tailored for clothing, outdoor fitness, and travel safety.
            </p>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-black/40 rounded-2xl border border-white/5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                id={`rec-tab-${cat.id}`}
                className={`px-3 py-1.5 text-xs font-mono font-medium rounded-xl transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Advice Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecs.map((rec, idx) => {
            const IconComp = ICON_MAP[rec.icon] || Compass;
            const scoreInfo = getScoreBadge(rec.score);
            const ScoreIcon = scoreInfo.icon;

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/5 text-blue-400 border border-white/5 group-hover:scale-105 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {rec.activity}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${scoreInfo.bg}`}
                    >
                      <ScoreIcon className="w-3 h-3" />
                      {scoreInfo.label}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-1">{rec.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{rec.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
