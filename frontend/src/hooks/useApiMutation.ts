// --- /hooks/useApiMutation.ts ---
'use client';
import { useState } from 'react';

type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

export function useApiMutation<TData, TVariables>({
  mutationFn,
  onSuccess,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (data: TData) => void;
}) {
  const [status, setStatus] = useState<MutationStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const mutate = async (variables: TVariables) => {
    setStatus('loading');
    setError(null);
    try {
      const data = await mutationFn(variables);
      setStatus('success');
      onSuccess?.(data);
    } catch (err: any) {
      setStatus('error');
      setError(err.message || 'An unexpected error occurred.');
    }
  };
  
  return {
    mutate,
    error,
    isLoading: status === 'loading',
  };
}