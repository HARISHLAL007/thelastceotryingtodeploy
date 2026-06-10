import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: number | string;
  trend?: number;
  icon: React.ReactNode;
  color: string;
}

export const StatCard = ({ label, value, trend, icon, color }: StatCardProps) => {
  const isBudget = label.toLowerCase() === 'budget';
  const isMorale = label.toLowerCase() === 'morale';
  const isRoi = label.toLowerCase() === 'roi';
  const isEmployees = label.toLowerCase() === 'employees';

  // Extract the numeric part if value is a string with a % sign
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]+/g, "")) : Number(value);

  let borderGlowClass = "border-slate-800 hover:border-cyan-500/50";
  let textColorClass = "text-slate-100";
  let glowColorClass = "";
  
  if (isBudget) {
    borderGlowClass = "border-slate-800 hover:border-yellow-500/50";
    textColorClass = "text-yellow-400";
  } else if (isMorale) {
    borderGlowClass = "border-slate-800 hover:border-purple-500/50";
    textColorClass = "text-purple-400";
  } else if (isRoi) {
    const isNegative = numericValue < 0 || (trend !== undefined && trend < 0);
    borderGlowClass = "border-slate-800 hover:border-cyan-500/50";
    textColorClass = isNegative ? "text-rose-400" : "text-emerald-400";
  }

  // Morale SVG ring metrics
  const radius = 26;
  const strokeDash = 2 * Math.PI * radius;
  const strokeOffset = strokeDash - (numericValue / 100) * strokeDash;

  return (
    <Card className={cn("bg-slate-900/50 backdrop-blur-sm relative overflow-hidden transition-all duration-300 group shadow-lg border", borderGlowClass)}>
      <CardContent className="p-5 relative z-10 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-space">
            {label}
          </span>
          <div className={cn("p-2 rounded-lg bg-slate-950/50 shadow-sm transition-colors", 
            isBudget ? "text-yellow-400" :
            isMorale ? "text-purple-400" :
            "text-cyan-400"
          )}>
            {icon}
          </div>
        </div>

        <div className="space-y-3">
          {isMorale ? (
            <div className="flex items-center space-x-4">
              <div className="relative h-14 w-14 flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke="rgba(168, 85, 247, 0.15)"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <circle
                    cx="28"
                    cy="28"
                    r={radius}
                    stroke="rgb(168, 85, 247)"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={strokeDash}
                    strokeDashoffset={strokeOffset}
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-space font-bold text-sm text-purple-400">
                  {numericValue}%
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
                  Stable
                </span>
                <span className="text-[10px] text-slate-500 font-space">Cohesion</span>
              </div>
            </div>
          ) : isBudget ? (
            <div className="space-y-2">
              <div className="font-space text-xl md:text-2xl font-bold text-yellow-400 tracking-tight">
                {value}
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 w-3/4 rounded-full" />
              </div>
            </div>
          ) : (
            <div className={cn("font-space text-xl md:text-2xl font-bold tracking-tight", textColorClass, glowColorClass)}>
              {value}
            </div>
          )}

          {/* Delta Status values */}
          {trend !== undefined && !isMorale && (
            <div className="flex items-center space-x-1.5 mt-auto pt-2">
              <span className={cn(
                "text-[10px] font-space px-2 py-0.5 rounded-full font-medium tracking-wide flex items-center gap-1",
                trend > 0 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : trend < 0 
                    ? "bg-rose-500/10 text-rose-400" 
                    : "bg-slate-500/10 text-slate-400"
              )}>
                {trend > 0 ? '▲' : trend < 0 ? '▼' : '■'} {Math.abs(trend)}%
              </span>
            </div>
          )}

          {/* Employees visually rendered as dots - Cleaner version */}
          {isEmployees && (
            <div className="flex flex-wrap items-center gap-1 mt-auto pt-2">
              {Array.from({ length: Math.min(Number(value) || 0, 8) }).map((_, idx) => (
                <span key={idx} className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              ))}
              {Number(value) > 8 && (
                <span className="text-[10px] text-slate-400 font-space font-medium pl-1">
                  +{Number(value) - 8}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
