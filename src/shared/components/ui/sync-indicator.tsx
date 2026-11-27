import { CircleCheck, CloudOff } from "lucide-react";

import { cn } from "@/shared/lib/cn";
import { formatDateTime } from "@/shared/lib/format-date-time";

type SyncIndicatorProps = {
  lastSyncedAt: number;
  erpAvailable: boolean;
  className?: string;
};

// US-002: when the data was last synchronized with the ERP. The prototype's
// green dot becomes an icon: there is no green in the palette.
export function SyncIndicator({
  lastSyncedAt,
  erpAvailable,
  className,
}: SyncIndicatorProps) {
  const when = formatDateTime(lastSyncedAt);
  const Icon = erpAvailable ? CircleCheck : CloudOff;

  return (
    <p
      className={cn(
        "flex items-center gap-1.5 text-caption font-medium",
        erpAvailable ? "text-muted" : "text-foreground",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span>
        {erpAvailable
          ? `Sincronizado com o ERP em ${when}`
          : `ERP fora do ar · dados de ${when}`}
      </span>
    </p>
  );
}
