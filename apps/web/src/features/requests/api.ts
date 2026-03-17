/**
 * Requests API hooks - TanStack Query
 */
import { useQuery } from '@tanstack/react-query';
import { requests } from '../../lib/api';

export const requestKeys = {
  all: ['requests'] as const,
  lists: () => [...requestKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | number>) => [...requestKeys.lists(), filters ?? {}] as const,
  detail: (id: string) => [...requestKeys.all, 'detail', id] as const,
};

export function useRequestsList(filters?: Record<string, string | number>) {
  return useQuery({
    queryKey: requestKeys.list(filters),
    queryFn: () => requests.list(filters),
  });
}

export function useRequest(id: string | undefined | null, enabled = true) {
  return useQuery({
    queryKey: requestKeys.detail(id ?? ''),
    queryFn: () => requests.get(id!),
    enabled: !!id && enabled,
  });
}
