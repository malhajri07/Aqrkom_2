/**
 * Properties API hooks - TanStack Query
 */
import { useQuery } from '@tanstack/react-query';
import { properties } from '../../lib/api';

export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number>) => [...propertyKeys.lists(), filters] as const,
  detail: (id: string) => [...propertyKeys.all, 'detail', id] as const,
};

export function usePropertiesList(filters?: Record<string, string | number>) {
  return useQuery({
    queryKey: propertyKeys.list(filters ?? {}),
    queryFn: () => properties.list(filters),
  });
}

export function useProperty(id: string | undefined | null, enabled = true) {
  return useQuery({
    queryKey: propertyKeys.detail(id ?? ''),
    queryFn: () => properties.get(id!),
    enabled: !!id && enabled,
  });
}
