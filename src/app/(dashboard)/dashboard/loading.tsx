import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero header skeleton */}
      <div className="rounded-[2rem] border border-white/[0.08] p-8 md:p-10 bg-muted/20 h-[300px] flex flex-col justify-between">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-5 w-96 rounded-lg font-medium" />
          </div>
          <Skeleton className="h-14 w-44 rounded-2xl" />
        </div>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </div>
      </div>

      {/* Two column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Insights */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </div>
          </div>
          {/* Recent apps */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <Skeleton className="h-[400px] rounded-2xl" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[300px] rounded-2xl" />
          <Skeleton className="h-[280px] rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
