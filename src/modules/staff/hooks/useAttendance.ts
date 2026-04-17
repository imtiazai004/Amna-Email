import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AttendanceService } from '@/lib/api';

export const useAttendance = () => {
  const queryClient = useQueryClient();

  const attendanceQuery = useQuery({
    queryKey: ['attendance'],
    queryFn: AttendanceService.getAll,
  });

  const markMutation = useMutation({
    mutationFn: AttendanceService.mark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      queryClient.invalidateQueries({ queryKey: ['guardian'] }); // Guardians see attendance
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return {
    attendance: attendanceQuery.data || [],
    isLoading: attendanceQuery.isLoading,
    markAttendance: markMutation.mutate,
    isMarking: markMutation.isPending,
  };
};
