import { useQuery } from '@tanstack/react-query';
import { GuardianService } from '@/lib/api';

export const useGuardianSummary = (guardianId: string) => {
  const summaryQuery = useQuery({
    queryKey: ['guardian', guardianId, 'summary'],
    queryFn: () => GuardianService.getSummary(guardianId),
    enabled: !!guardianId,
  });

  return {
    summary: summaryQuery.data || [],
    isLoading: summaryQuery.isLoading,
  };
};
