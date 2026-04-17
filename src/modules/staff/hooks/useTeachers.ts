import { useQuery } from '@tanstack/react-query';
import { TeacherService } from '@/lib/api';

export const useTeachers = () => {
  const teachersQuery = useQuery({
    queryKey: ['teachers'],
    queryFn: TeacherService.getAll,
  });

  return {
    teachers: teachersQuery.data || [],
    isLoading: teachersQuery.isLoading,
  };
};
