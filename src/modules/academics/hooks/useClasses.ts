import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AcademicService } from '@/lib/api';

export const useClasses = () => {
  const queryClient = useQueryClient();

  const classesQuery = useQuery({
    queryKey: ['classes'],
    queryFn: AcademicService.getClasses,
  });

  const schedulesQuery = useQuery({
    queryKey: ['schedules'],
    queryFn: AcademicService.getSchedules,
  });

  const createClassMutation = useMutation({
    mutationFn: AcademicService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });

  const bulkImportMutation = useMutation({
    mutationFn: AcademicService.bulkImport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }
  });

  return {
    classes: classesQuery.data || [],
    schedules: schedulesQuery.data || [],
    isLoading: classesQuery.isLoading || schedulesQuery.isLoading,
    createClass: createClassMutation.mutate,
    isCreating: createClassMutation.isPending,
    bulkImport: bulkImportMutation.mutate,
    isImporting: bulkImportMutation.isPending
  };
};
