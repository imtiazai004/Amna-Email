import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceService } from '@/lib/api';

export const useFees = () => {
  const queryClient = useQueryClient();

  const feesQuery = useQuery({
    queryKey: ['fees'],
    queryFn: FinanceService.getFees,
  });

  const payMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) => FinanceService.payFee(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      queryClient.invalidateQueries({ queryKey: ['guardian'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return {
    fees: feesQuery.data || [],
    isLoading: feesQuery.isLoading,
    error: feesQuery.error,
    payFee: payMutation.mutate,
    isPaying: payMutation.isPending,
  };
};
