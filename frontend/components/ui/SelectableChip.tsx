interface SelectableChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export default function SelectableChip({
  label,
  selected = false,
  onClick,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-lg border px-3 py-2 text-sm font-semibold transition",
        selected
          ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
          : "border-slate-700 bg-slate-800/80 text-slate-300 hover:border-slate-500",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
