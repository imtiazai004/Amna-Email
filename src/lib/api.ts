import { FirestoreService } from './firestoreService';

const getService = () => {
  const schoolId = localStorage.getItem('eduFlow_schoolId') || 'default-school';
  return new FirestoreService(schoolId);
};

export const StudentService = {
  getAll: () => getService().getAll('students').then(async (students: any[]) => {
    const service = getService();
    return Promise.all(students.map(async (s) => ({
      ...s,
      user: await service.getById('users', s.userId) as any,
      class: await service.getById('classes', s.classId) as any
    })));
  }) as any,
  create: (data: any) => getService().create('students', data) as any,
  promote: (id: string, classId: string) => getService().update('students', id, { classId }) as any,
  withdraw: (id: string) => getService().update('students', id, { status: 'Withdrawn' }) as any,
};

export const AcademicService = {
  getClasses: () => getService().getAll('classes').then(async (classes: any[]) => {
    const service = getService();
    return Promise.all(classes.map(async (c) => ({
      ...c,
      teacher: await service.getById('teachers', c.teacherId) as any
    })));
  }) as any,
  createClass: (data: any) => getService().create('classes', data) as any,
  bulkImport: (classes: any[]) => Promise.all(classes.map(c => getService().create('classes', c))) as any,
  getSchedules: () => getService().getAll('schedules') as any,
  getSubjects: () => getService().getAll('subjects') as any,
  getDepartments: () => getService().getAll('departments') as any,
};

export const TeacherService = {
  getAll: () => getService().getAll('teachers').then(async (teachers: any[]) => {
    const service = getService();
    return Promise.all(teachers.map(async (t) => ({
      ...t,
      user: await service.getById('users', t.userId) as any,
      department: await service.getById('departments', t.departmentId) as any
    })));
  }) as any,
};

export const FinanceService = {
  getFees: () => getService().getAll('fees') as any,
  payFee: (id: string, amount: number) => getService().update('fees', id, { amountPaid: amount, status: 'Paid' }) as any,
  getFeeCategories: () => getService().getAll('feeCategories') as any,
  createFeeCategory: (data: any) => getService().create('feeCategories', data) as any,
  getOverview: async () => {
    const service = getService();
    const students = await service.getAll('students') as any[];
    const fees = await service.getAll('fees') as any[];
    const revenue = fees.filter((f: any) => f.status === 'Paid').reduce((acc: number, f: any) => acc + (f.amountPaid || 0), 0);
    return {
      totalStudents: students.length,
      revenue,
      expenses: 15400,
      netProfit: revenue - 15400,
      receivables: fees.filter((f: any) => f.status === 'Pending').reduce((acc: number, f: any) => acc + (f.amount || 0), 0),
      payables: 2400,
      recentTransactions: [
        { id: 't1', date: '2024-11-12', description: 'Monthly Fee - Alex J.', amount: 1500, type: 'Income' },
        { id: 't2', date: '2024-11-10', description: 'Electricity Bill', amount: 450, type: 'Expense' }
      ]
    } as any;
  },
  getSalaries: () => getService().getAll('salaryPayments') as any,
  paySalary: (id: string) => getService().update('salaryPayments', id, { status: 'Paid', paymentDate: new Date().toISOString() }) as any,
};

export const AttendanceService = {
  getAll: () => getService().getAll('attendance') as any,
  mark: (data: any) => getService().create('attendance', data) as any,
};

export const EventService = {
  getAll: () => getService().getAll('events') as any,
};

export const ExamService = {
  getAll: () => getService().getAll('exams') as any,
  getResults: () => getService().getAll('examResults') as any,
  submitResults: (results: any[]) => Promise.all(results.map(r => getService().create('examResults', r))) as any,
  getStats: () => Promise.resolve({ 
    passingRate: '88%', 
    topSubject: 'Mathematics',
    avgScore: 76.5,
    passRate: '92%',
    totalGraded: 145,
    masteryIndex: 'A-'
  }) as any,
};

export const DashboardService = {
  getStats: (async () => {
    const service = getService();
    const students = await service.getAll('students') as any[];
    const teachers = await service.getAll('teachers') as any[];
    const fees = await service.getAll('fees') as any[];
    return {
      students: students.length,
      teachers: teachers.length,
      attendance: '92%',
      feesCollected: fees.filter((f: any) => f.status === 'Paid').reduce((acc: number, curr: any) => acc + curr.amountPaid, 0),
    } as any;
  }) as any,
};

export const GuardianService = {
  getSummary: (id: string) => getService().getSummaryById(id) as any, 
  searchByPhone: (phone: string) => getService().getGuardianSummary(phone) as any,
};
