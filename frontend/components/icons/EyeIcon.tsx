interface EyeIconProps {
  className?: string;
}

export default function EyeIcon({ className = "h-5 w-5" }: EyeIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M12 5c5.5 0 9.3 4.8 10.7 6.9.2.3.2.8 0 1.1C21.3 15.2 17.5 20 12 20S2.7 15.2 1.3 13.1a1 1 0 0 1 0-1.1C2.7 9.8 6.5 5 12 5Zm0 2c-4.2 0-7.3 3.5-8.6 5 1.3 1.5 4.4 5 8.6 5s7.3-3.5 8.6-5c-1.3-1.5-4.4-5-8.6-5Zm0 1.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4Zm0 2a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4Z"
      />
    </svg>
  );
}
