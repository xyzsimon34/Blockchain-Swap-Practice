import { TimeFrame } from "./types";

interface ChartControlsProps {
  timeframe: TimeFrame;
  onTimeframeChange: (timeframe: TimeFrame) => void;
}

export const ChartControls = ({
  timeframe,
  onTimeframeChange,
}: ChartControlsProps) => {
  const timeframes: TimeFrame[] = ["1H", "1D", "1W", "1M"];

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-2">
        {timeframes.map((tf) => (
          <button
            key={tf}
            onClick={() => onTimeframeChange(tf)}
            className={`px-3 py-1 rounded transition-colors ${
              timeframe === tf
                ? "bg-blue-500 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {tf}
          </button>
        ))}
      </div>
    </div>
  );
};
