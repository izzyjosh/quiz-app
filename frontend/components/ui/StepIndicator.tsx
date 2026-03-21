interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export default function StepIndicator({
  steps,
  currentStep,
}: StepIndicatorProps) {
  return (
    <ol className="flex items-start gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isComplete = step.id < currentStep;

        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className={[
                "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold",
                isComplete || isActive
                  ? "border-indigo-400 bg-indigo-500/20 text-indigo-200"
                  : "border-slate-700 bg-slate-900 text-slate-500",
              ].join(" ")}
            >
              {isComplete ? "OK" : step.id}
            </div>

            <div className="min-w-0">
              <p
                className={[
                  "text-xs font-semibold uppercase tracking-[0.08em]",
                  isActive ? "text-indigo-300" : "text-slate-500",
                ].join(" ")}
              >
                {step.label}
              </p>
            </div>

            {index < steps.length - 1 ? (
              <span className="hidden h-px flex-1 bg-slate-700 sm:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
