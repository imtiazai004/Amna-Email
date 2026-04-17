import { useQuery } from '@tanstack/react-query';
import { EventService } from '@/lib/api';

export const useEvents = () => {
  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: EventService.getAll,
  });

  return {
    events: eventsQuery.data || [],
    isLoading: eventsQuery.isLoading,
  };
};
