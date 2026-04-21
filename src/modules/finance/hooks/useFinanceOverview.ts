import { useQuery } from '@tanstack/react-query';
import { FinanceService } from '@/lib/api';

export const useFinanceOverview = () => {
  const overviewQuery = useQuery({
    queryKey: ['finance-overview'],
    queryFn: FinanceService.getOverview,
  });

  return {
    overview: overviewQuery.data || {
      revenue: 0,
      expenses: 0,
      netProfit: 0,
      receivables: 0,
      payables: 0,
      recentTransactions: []
    },
    isLoading: overviewQuery.isLoading,
    error: overviewQuery.error,
  };
};
