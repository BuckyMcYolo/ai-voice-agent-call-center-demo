import React from "react"

const PatientsSkeleton = () => {
  return (
    <div className="w-full rounded-lg bg-card">
      {/* Content Skeleton */}
      <div className="p-4">
        <div className="rounded-md border">
          {/* Table Header Skeleton */}
          <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-4 w-16 animate-pulse rounded bg-muted"
              ></div>
            ))}
          </div>

          {/* Table Body Skeleton */}
          <div className="max-h-[calc(100vh-12rem)] overflow-auto">
            {Array.from({ length: 10 }).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-5 gap-4 border-b p-4"
              >
                <div className="space-y-2">
                  <div className="h-4 w-32 animate-pulse rounded bg-muted"></div>
                  <div className="h-3 w-24 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-16 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-28 animate-pulse rounded bg-muted"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-4 w-36 animate-pulse rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PatientsSkeleton
