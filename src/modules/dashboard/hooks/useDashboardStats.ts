import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/lib/api';
import { useFirebase } from '@/context/FirebaseContext';

export const useDashboardStats = () => {
  const { profile } = useFirebase();
  const schoolId = profile?.schoolId;

  const statsQuery = useQuery({
    queryKey: ['stats', schoolId],
    queryFn: DashboardService.getStats,
    enabled: !!schoolId,
  });

  return {
    stats: statsQuery.data || { students: 0, teachers: 0, attendance: '0%', feesCollected: 0 },
    isLoading: statsQuery.isLoading,
    refetch: statsQuery.refetch
  };
};
