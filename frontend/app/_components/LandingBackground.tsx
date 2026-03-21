export default function LandingBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
      <div className="absolute left-[-120px] top-[-80px] h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="absolute right-[-80px] top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl" />
    </div>
  );
}
