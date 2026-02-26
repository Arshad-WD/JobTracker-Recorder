import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Hero header skeleton */}
      <div className="rounded-2xl border border-white/[0.06] p-6 md:p-8 bg-muted/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-11 w-40 rounded-lg" />
        </div>
        <div className="mt-6 flex gap-6">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>

      {/* Two column layout skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Insights */}
          <div className="space-y-2.5">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-[72px] rounded-xl" />
            <Skeleton className="h-[72px] rounded-xl" />
          </div>
          {/* Recent apps */}
          <Skeleton className="h-[280px] rounded-xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-[200px] rounded-xl" />
          <Skeleton className="h-[240px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
