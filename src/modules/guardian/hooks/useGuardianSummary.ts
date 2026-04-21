import { useQuery } from '@tanstack/react-query';
import { GuardianService } from '@/lib/api';

export const useGuardianSummary = (id?: string) => {
  const activeId = id || localStorage.getItem('activeGuardianId');
  
  const summaryQuery = useQuery({
    queryKey: ['guardian', activeId, 'summary'],
    queryFn: () => GuardianService.getSummary(activeId!),
    enabled: !!activeId,
  });

  return {
    summary: summaryQuery.data?.summary || [],
    guardian: summaryQuery.data?.guardian || null,
    isLoading: summaryQuery.isLoading,
  };
};
