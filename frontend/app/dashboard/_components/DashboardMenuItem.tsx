import BarChartIcon from "@/components/icons/BarChartIcon";
import GearIcon from "@/components/icons/GearIcon";

interface DashboardMenuItemProps {
  label: string;
  onClick: () => void;
  icon?: "bar" | "gear";
}

export default function DashboardMenuItem({
  label,
  onClick,
  icon,
}: DashboardMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm font-semibold text-slate-100 transition hover:bg-indigo-500/10 sm:px-5"
      role="menuitem"
    >
      {icon === "bar" ? (
        <BarChartIcon className="h-4 w-4 text-slate-300" />
      ) : null}
      {icon === "gear" ? <GearIcon className="h-4 w-4 text-slate-300" /> : null}
      <span>{label}</span>
    </button>
  );
}
