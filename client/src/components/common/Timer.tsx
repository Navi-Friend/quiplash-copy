import { cn } from "@/lib/utils";

export function Timer({
  time,
  className,
}: {
  time: number;
  className?: string;
}) {
  return (
    <div
      key={time}
      className={cn(
        `flex justify-center items-center bg-gray-950 rounded-md rotate-[-2deg] w-22 h-22 opacity-85 text-secondary-foreground text-center animate-[spin_0.35s_cubic-bezier(1,0.2,0,1)]`,
        className
      )}
    >
      <span className="text-7xl font-semibold font-mono">{time}</span>
    </div>
  );
}
