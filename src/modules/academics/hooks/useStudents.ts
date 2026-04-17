import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentService } from '@/lib/api';

export const useStudents = () => {
  const queryClient = useQueryClient();

  const studentsQuery = useQuery({
    queryKey: ['students'],
    queryFn: StudentService.getAll,
  });

  const createStudentMutation = useMutation({
    mutationFn: StudentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['fees'] }); // Fees change on admission
    },
  });

  const promoteStudentMutation = useMutation({
    mutationFn: ({ id, classId }: { id: string; classId: string }) => StudentService.promote(id, classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });

  const withdrawStudentMutation = useMutation({
    mutationFn: (id: string) => StudentService.withdraw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  return {
    students: studentsQuery.data || [],
    isLoading: studentsQuery.isLoading,
    error: studentsQuery.error,
    createStudent: createStudentMutation.mutate,
    isCreating: createStudentMutation.isPending,
    promoteStudent: promoteStudentMutation.mutate,
    withdrawStudent: withdrawStudentMutation.mutate,
  };
};
