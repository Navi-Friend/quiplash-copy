import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const resolveAvatar = (playerNumber: number): string => {
  const playerNumberToAvatar: { [key: number]: string } = {
    1: "blue",
    2: "coffin",
    3: "green",
    4: "orange",
    5: "purple",
    6: "red",
    7: "teal",
    8: "yellow",
  };

  const avatarName = playerNumberToAvatar[playerNumber];
  return `../../../${avatarName}.webp`;
};
