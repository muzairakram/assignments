import { cn } from "@/lib/utils";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "border border-input-border bg-white px-[10px] py-[7px] text-[13px] text-navy",
        "focus:outline-none focus:border-navy",
        "placeholder:text-grey-text",
        className
      )}
      {...props}
    />
  );
}
