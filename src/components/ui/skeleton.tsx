import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-white dark:bg-gray-800", className)} // 변경: bg-muted -> bg-white dark:bg-gray-800 (또는 다른 밝은 색)
      {...props}
    />
  )
}

export { Skeleton }
