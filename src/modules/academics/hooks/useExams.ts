import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExamService } from '@/lib/api';

export const useExams = () => {
  const queryClient = useQueryClient();

  const examsQuery = useQuery({
    queryKey: ['exams'],
    queryFn: ExamService.getAll,
  });

  const resultsQuery = useQuery({
    queryKey: ['exam-results'],
    queryFn: ExamService.getResults,
  });

  const statsQuery = useQuery({
    queryKey: ['exam-stats'],
    queryFn: ExamService.getStats,
  });

  const submitResultsMutation = useMutation({
    mutationFn: ExamService.submitResults,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exam-results'] });
      queryClient.invalidateQueries({ queryKey: ['exam-stats'] });
    },
  });

  return {
    exams: examsQuery.data || [],
    results: resultsQuery.data || [],
    stats: statsQuery.data || { avgScore: 0, passRate: '0%', totalGraded: 0, masteryIndex: 'N/A' },
    isLoading: examsQuery.isLoading || resultsQuery.isLoading || statsQuery.isLoading,
    submitResults: submitResultsMutation.mutate,
    isSubmitting: submitResultsMutation.isPending,
  };
};
