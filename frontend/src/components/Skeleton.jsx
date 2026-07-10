import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4.5 shadow-soft animate-pulse dark:border-slate-800 dark:bg-slate-900">
      <div className="aspect-[3/4] w-full rounded-xl bg-gray-200 dark:bg-slate-800 mb-4" />
      <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-slate-800 mb-2" />
      <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-800 mb-2" />
      <div className="h-3.5 w-1/2 rounded bg-gray-200 dark:bg-slate-800 mb-4" />
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50 dark:border-slate-800/50">
        <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-9 w-20 rounded-xl bg-gray-200 dark:bg-slate-800" />
      </div>
    </div>
  );
};

export const CatalogSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 animate-pulse">
      <div className="aspect-[3/4] w-full rounded-2xl bg-gray-200 dark:bg-slate-800" />
      <div className="space-y-4">
        <div className="h-3.5 w-24 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-8 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="flex gap-2">
          <div className="h-5 w-12 rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-5 w-20 rounded bg-gray-200 dark:bg-slate-800" />
        </div>
        <div className="h-8 w-28 rounded bg-gray-200 dark:bg-slate-800 pt-4" />
        <hr className="border-gray-100 dark:border-slate-800" />
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-800" />
          <div className="h-3 w-4/5 rounded bg-gray-200 dark:bg-slate-800" />
        </div>
        <div className="flex gap-4 pt-6">
          <div className="h-11 w-32 rounded-xl bg-gray-200 dark:bg-slate-800" />
          <div className="h-11 w-32 rounded-xl bg-gray-200 dark:bg-slate-800" />
        </div>
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full rounded-2xl border border-gray-100 bg-white p-4 shadow-soft animate-pulse dark:border-slate-800 dark:bg-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div className="h-6 w-32 rounded bg-gray-200 dark:bg-slate-800" />
        <div className="h-9 w-24 rounded-xl bg-gray-200 dark:bg-slate-800" />
      </div>
      <div className="space-y-4">
        {[...Array(rows)].map((_, r) => (
          <div key={r} className="flex gap-4 items-center justify-between py-3 border-b border-gray-50 dark:border-slate-800/50">
            <div className="flex items-center gap-3 w-1/3">
              <div className="h-8 w-8 rounded bg-gray-200 dark:bg-slate-800" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-slate-800" />
                <div className="h-2.5 w-1/2 rounded bg-gray-200 dark:bg-slate-800" />
              </div>
            </div>
            {[...Array(cols - 1)].map((_, c) => (
              <div key={c} className="h-3.5 w-20 rounded bg-gray-200 dark:bg-slate-800" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnalyticsSkeleton = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl bg-white border border-gray-100 p-5 shadow-soft dark:bg-slate-900 dark:border-slate-800">
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-slate-800 mb-2.5" />
            <div className="h-6 w-24 rounded bg-gray-200 dark:bg-slate-800 mb-1" />
            <div className="h-2.5 w-20 rounded bg-gray-200 dark:bg-slate-800" />
          </div>
        ))}
      </div>
      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-soft h-80 lg:col-span-2 dark:bg-slate-900 dark:border-slate-800" />
        <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-soft h-80 dark:bg-slate-900 dark:border-slate-800" />
      </div>
    </div>
  );
};
