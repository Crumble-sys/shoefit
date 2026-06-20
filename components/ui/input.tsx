import * as React from "react"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={
        className ||
        "flex h-11 w-full rounded-md border-2 border-slate-300 bg-white px-4 py-2.5 text-base font-medium ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-base [&::placeholder]:text-slate-400 [&::placeholder]:font-normal"
      }
      style={{ color: '#0f172a' }}
      ref={ref}
      {...props}
    />
  )
)
Input.displayName = "Input"

export { Input }
