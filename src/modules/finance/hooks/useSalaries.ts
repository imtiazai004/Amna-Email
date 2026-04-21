import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FinanceService } from '@/lib/api';

export const useSalaries = () => {
  const queryClient = useQueryClient();

  const salariesQuery = useQuery({
    queryKey: ['salaries'],
    queryFn: FinanceService.getSalaries,
  });

  const payMutation = useMutation({
    mutationFn: FinanceService.paySalary,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salaries'] });
      queryClient.invalidateQueries({ queryKey: ['finance-overview'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return {
    salaries: salariesQuery.data || [],
    isLoading: salariesQuery.isLoading,
    error: salariesQuery.error,
    paySalary: payMutation.mutate,
    isPaying: payMutation.isPending,
  };
};
