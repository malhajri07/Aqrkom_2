/**
 * Contacts API hooks - TanStack Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contacts } from '../../lib/api';

export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters: Record<string, string | number>) => [...contactKeys.lists(), filters] as const,
  detail: (id: string) => [...contactKeys.all, 'detail', id] as const,
};

export function useContactsList(filters?: Record<string, string | number>) {
  return useQuery({
    queryKey: contactKeys.list(filters ?? {}),
    queryFn: () => contacts.list(filters),
  });
}

export function useContact(id: string | undefined | null, enabled = true) {
  return useQuery({
    queryKey: contactKeys.detail(id ?? ''),
    queryFn: () => contacts.get(id!),
    enabled: !!id && enabled,
  });
}

export function useContactCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => contacts.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactKeys.all }),
  });
}

export function useContactImport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ rows, fieldMapping }: { rows: Array<Record<string, string>>; fieldMapping?: Record<string, string> }) =>
      contacts.import(rows, fieldMapping),
    onSuccess: () => qc.invalidateQueries({ queryKey: contactKeys.all }),
  });
}
