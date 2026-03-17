/**
 * Transactions API hooks - TanStack Query
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactions, properties, contacts } from '../../lib/api';

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: Record<string, string | number>) => [...transactionKeys.lists(), filters ?? {}] as const,
  detail: (id: string) => [...transactionKeys.all, 'detail', id] as const,
};

export function useTransactionsList(filters?: Record<string, string | number>) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactions.list(filters),
  });
}

export function useTransaction(id: string | undefined | null, enabled = true) {
  return useQuery({
    queryKey: transactionKeys.detail(id ?? ''),
    queryFn: () => transactions.get(id!),
    enabled: !!id && enabled,
  });
}

export function useTransactionCreate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => transactions.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: transactionKeys.all }),
  });
}

/** Fetch properties and contacts for transaction form dropdowns */
export function useTransactionFormData() {
  const props = useQuery({ queryKey: ['properties', 'list'], queryFn: () => properties.list() });
  const conts = useQuery({ queryKey: ['contacts', 'list'], queryFn: () => contacts.list() });
  return {
    properties: (props.data ?? []) as Record<string, unknown>[],
    contacts: (conts.data ?? []) as Record<string, unknown>[],
    isLoading: props.isLoading || conts.isLoading,
  };
}
