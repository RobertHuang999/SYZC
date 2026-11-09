import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "checked" | "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked = false, disabled, onCheckedChange, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center justify-center h-4 w-4 shrink-0 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 transition-colors",
          checked
            ? "bg-amber-600 border-amber-600 text-white dark:bg-amber-600 dark:border-amber-600"
            : "hover:border-slate-400",
          disabled && "cursor-not-allowed opacity-50 bg-slate-100 dark:bg-slate-800",
          !disabled && "cursor-pointer",
          className
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

