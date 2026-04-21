import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AcademicService } from '@/lib/api';
import { useFirebase } from '@/context/FirebaseContext';

export const useClasses = () => {
  const queryClient = useQueryClient();
  const { profile } = useFirebase();
  const schoolId = profile?.schoolId;

  const classesQuery = useQuery({
    queryKey: ['classes', schoolId],
    queryFn: AcademicService.getClasses,
    enabled: !!schoolId,
  });

  const schedulesQuery = useQuery({
    queryKey: ['schedules', schoolId],
    queryFn: AcademicService.getSchedules,
    enabled: !!schoolId,
  });

  const createClassMutation = useMutation({
    mutationFn: AcademicService.createClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes', schoolId] });
      queryClient.invalidateQueries({ queryKey: ['stats', schoolId] });
    }
  });

  const bulkImportMutation = useMutation({
    mutationFn: AcademicService.bulkImport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes', schoolId] });
      queryClient.invalidateQueries({ queryKey: ['stats', schoolId] });
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
