import { CircleAlert, Info } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type BannerProps = {
  tone: "info" | "error";
  children: ReactNode;
  className?: string;
};

// A message with an icon and text. Errors are announced at once; information
// is announced politely.
export function Banner({ tone, children, className }: BannerProps) {
  const Icon = tone === "error" ? CircleAlert : Info;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      data-tone={tone}
      className={cn(
        "flex items-start gap-2.5 rounded-tile border px-3.5 py-3 text-body",
        tone === "error"
          ? "border-danger bg-danger-surface text-danger"
          : "border-highlight bg-highlight/50 text-foreground",
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <div className="font-medium">{children}</div>
    </div>
  );
}
