import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const StudentService = {
  getAll: () => api.get('/students').then(r => r.data),
  create: (data: any) => api.post('/students', data).then(r => r.data),
  promote: (id: string, classId: string) => api.patch(`/students/${id}/promote`, { classId }).then(r => r.data),
  withdraw: (id: string) => api.patch(`/students/${id}/withdraw`).then(r => r.data),
};

export const AcademicService = {
  getClasses: () => api.get('/classes').then(r => r.data),
  createClass: (data: any) => api.post('/classes', data).then(r => r.data),
  bulkImport: (classes: any[]) => api.post('/classes/bulk-import', { classes }).then(r => r.data),
  getSchedules: () => api.get('/schedules').then(r => r.data),
  getSubjects: () => api.get('/subjects').then(r => r.data),
};

export const TeacherService = {
  getAll: () => api.get('/teachers').then(r => r.data),
};

export const FinanceService = {
  getFees: () => api.get('/fees').then(r => r.data),
  payFee: (id: string, amount: number) => api.patch(`/fees/${id}/pay`, { amount }).then(r => r.data),
};

export const AttendanceService = {
  getAll: () => api.get('/attendance').then(r => r.data),
  mark: (data: { entityId: string; entityType: 'STUDENT' | 'TEACHER'; status: string }) => api.post('/attendance', data).then(r => r.data),
};

export const EventService = {
  getAll: () => api.get('/events').then(r => r.data),
};

export const ExamService = {
  getAll: () => api.get('/exams').then(r => r.data),
  getResults: () => api.get('/exam-results').then(r => r.data),
  submitResults: (results: any[]) => api.post('/exam-results', { results }).then(r => r.data),
  getStats: () => api.get('/exam-stats').then(r => r.data),
};

export const DashboardService = {
  getStats: () => api.get('/stats').then(r => r.data),
};

export const GuardianService = {
  getSummary: (id: string) => api.get(`/guardians/${id}/summary`).then(r => r.data),
};
