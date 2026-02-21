import { Skeleton } from "@/components/ui/skeleton";

const DealCardSkeleton = () => (
  <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/3] bg-card">
    <Skeleton className="absolute inset-0 w-full h-full" />
    <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-4 mt-2">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

export default DealCardSkeleton;
