import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/lib/api';

export const useDashboardStats = () => {
  const statsQuery = useQuery({
    queryKey: ['stats'],
    queryFn: DashboardService.getStats,
  });

  return {
    stats: statsQuery.data || { students: 0, teachers: 0, attendance: '0%', feesCollected: 0 },
    isLoading: statsQuery.isLoading,
  };
};
