interface BarChartIconProps {
  className?: string;
}

export default function BarChartIcon({
  className = "h-4 w-4",
}: BarChartIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <rect x="3" y="10" width="4" height="10" fill="currentColor" rx="1" />
      <rect x="10" y="6" width="4" height="14" fill="currentColor" rx="1" />
      <rect x="17" y="3" width="4" height="17" fill="currentColor" rx="1" />
    </svg>
  );
}
