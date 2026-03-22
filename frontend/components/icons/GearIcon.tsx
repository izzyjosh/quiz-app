interface GearIconProps {
  className?: string;
}

export default function GearIcon({ className = "h-4 w-4" }: GearIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="m19.4 13.5.1-1.5-1.7-.7c-.1-.4-.3-.8-.5-1.2l1-1.5-1.1-1.1-1.5 1c-.4-.2-.8-.4-1.2-.5L13.5 4h-1.6l-.7 1.7c-.4.1-.8.3-1.2.5l-1.5-1L7.4 6.3l1 1.5c-.2.4-.4.8-.5 1.2L6.2 10H4.5l-.1 1.5 1.7.7c.1.4.3.8.5 1.2l-1 1.5 1.1 1.1 1.5-1c.4.2.8.4 1.2.5l.7 1.7h1.6l.7-1.7c.4-.1.8-.3 1.2-.5l1.5 1 1.1-1.1-1-1.5c.2-.4.4-.8.5-1.2l1.7-.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="12"
        cy="12"
        r="2.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}
