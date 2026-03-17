/**
 * Dashboard API hooks - TanStack Query
 */
import { useQueries } from '@tanstack/react-query';
import { dashboard, tasks } from '../../lib/api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  data: () => [...dashboardKeys.all, 'data'] as const,
};

export function useDashboardData() {
  const results = useQueries({
    queries: [
      { queryKey: ['dashboard', 'kpis'], queryFn: () => dashboard.kpis() },
      { queryKey: ['dashboard', 'pipeline-summary'], queryFn: () => dashboard.pipelineSummary() },
      { queryKey: ['dashboard', 'recent-activities'], queryFn: () => dashboard.recentActivities() },
      { queryKey: ['dashboard', 'recent-properties'], queryFn: () => dashboard.recentProperties() },
      { queryKey: ['dashboard', 'tasks'], queryFn: () => tasks.list({ limit: 5 }) },
    ],
  });

  const [kpis, pipelineSummary, recentActivities, recentProperties, taskList] = results;
  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return {
    kpis: kpis.data,
    pipeline: (pipelineSummary.data ?? []) as Array<{ id: string; name_ar: string; name_en: string; contact_count: number }>,
    recentActivities: (recentActivities.data ?? []) as Array<Record<string, unknown>>,
    recentProperties: (recentProperties.data ?? []) as Array<Record<string, unknown>>,
    taskList: ((taskList.data ?? []) as Array<Record<string, unknown>>).slice(0, 5),
    isLoading,
    isError,
    refetch: () => results.forEach((r) => r.refetch()),
  };
}
