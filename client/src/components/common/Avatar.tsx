import { cn } from "@/lib/utils";
import React from "react";

interface AvatarProps {
  avatarURL: string;
  name: string;
  isVip: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Avatar({
  avatarURL,
  name,
  isVip,
  className,
  style,
}: AvatarProps) {
  return (
    <div style={style} className={cn("flex flex-col items-center relative", className)}>
      {isVip && (
        // mb-[-40px]
        <span className="text-primary font-extrabold text-2xl absolute top-0 tracking-widest animate-fly">
          VIP
        </span>
      )}
      <img src={avatarURL} width="130px" className="max-w-screen" alt={name} />
      <div className="bg-neutral-950 p-1 text-secondary-foreground text-xl text-bold mt-[-11px] text-center px-4">
        {name}
      </div>
    </div>
  );
}
