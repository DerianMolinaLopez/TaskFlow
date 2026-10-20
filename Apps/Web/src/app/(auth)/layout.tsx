import { HugeiconsIcon } from "@hugeicons/react";
import { TaskDaily01Icon } from "@hugeicons/core-free-icons";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HugeiconsIcon icon={TaskDaily01Icon} strokeWidth={2} className="size-4" />
          </div>
          TaskFlow
        </div>
        {children}
      </div>
    </div>
  );
}
