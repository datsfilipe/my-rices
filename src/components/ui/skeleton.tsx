import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  text?: string;
};

function Skeleton({
  className,
  text,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(" text-neutral-100 rounded-md flex justify-center ", className)}
      {...props}
    >
      <b className="animate-pulse text-neutral-600 dark:text-neutral-400 py-6">
        {text}
      </b>
    </div >
  );
}

export { Skeleton };
