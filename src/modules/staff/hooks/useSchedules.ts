import { useQuery } from '@tanstack/react-query';
import { AcademicService } from '@/lib/api';

export const useSchedules = () => {
  const schedulesQuery = useQuery({
    queryKey: ['schedules'],
    queryFn: AcademicService.getSchedules,
  });

  return {
    schedules: schedulesQuery.data || [],
    isLoading: schedulesQuery.isLoading,
  };
};
