import type { AvatarCategory } from "./sign-up.constants";
import { avatarCategories, avatarsByCategory } from "./sign-up.constants";
import InitialBadge from "./InitialBadge";

import SelectableChip from "@/components/ui/SelectableChip";

interface SignUpAvatarStepProps {
  username: string;
  category: AvatarCategory;
  selectedAvatar: string;
  onCategoryChange: (value: AvatarCategory) => void;
  onAvatarChange: (value: string) => void;
}

export default function SignUpAvatarStep({
  username,
  category,
  selectedAvatar,
  onCategoryChange,
  onAvatarChange,
}: SignUpAvatarStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100">
          Pick your avatar
        </h1>
        <p className="mt-2 text-slate-400">
          This represents you across all sessions and the leaderboard.
        </p>
      </div>

      <div className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
        <div className="flex items-center gap-3">
          <InitialBadge label={selectedAvatar} />
          <div>
            <p className="text-lg font-bold text-slate-100">
              {username || "newuser"}
            </p>
            <p className="text-sm text-slate-400">
              {selectedAvatar} - {category}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {avatarCategories.map((item) => (
          <SelectableChip
            key={item}
            label={item}
            selected={item === category}
            onClick={() => onCategoryChange(item)}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {avatarsByCategory[category].map((avatar) => {
          const selected = avatar === selectedAvatar;

          return (
            <button
              type="button"
              key={avatar}
              onClick={() => onAvatarChange(avatar)}
              className={[
                "rounded-xl border p-3 text-left transition",
                selected
                  ? "border-indigo-400 bg-indigo-500/20"
                  : "border-slate-700 bg-slate-800/70 hover:border-slate-500",
              ].join(" ")}
            >
              <div className="mb-2">
                <InitialBadge label={avatar} />
              </div>
              <p className="text-xs font-semibold text-slate-200">{avatar}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
