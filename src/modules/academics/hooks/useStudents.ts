import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentService } from '@/lib/api';
import { useFirebase } from '@/context/FirebaseContext';

export const useStudents = () => {
  const queryClient = useQueryClient();
  const { profile } = useFirebase();
  const schoolId = profile?.schoolId;

  const studentsQuery = useQuery({
    queryKey: ['students', schoolId],
    queryFn: StudentService.getAll,
    enabled: !!schoolId,
  });

  const createStudentMutation = useMutation({
    mutationFn: StudentService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', schoolId] });
      queryClient.invalidateQueries({ queryKey: ['stats', schoolId] });
      queryClient.invalidateQueries({ queryKey: ['fees', schoolId] }); // Fees change on admission
    },
  });

  const promoteStudentMutation = useMutation({
    mutationFn: ({ id, classId }: { id: string; classId: string }) => StudentService.promote(id, classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', schoolId] });
    },
  });

  const withdrawStudentMutation = useMutation({
    mutationFn: (id: string) => StudentService.withdraw(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students', schoolId] });
      queryClient.invalidateQueries({ queryKey: ['stats', schoolId] });
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
