import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- UNIFIED IN-MEMORY DATABASE ---
const db = {
  users: [
    { id: 'u1', name: 'Dr. Emily Watson', email: 'emily@school.com', role: 'TEACHER' },
    { id: 'u2', name: 'Alex Johnson', email: 'alex@student.com', role: 'STUDENT' },
    { id: 'u3', name: 'Sarah Johnson', email: 'sarah@guardian.com', role: 'GUARDIAN' },
    { id: 'u4', name: 'Robert Ross', email: 'robert@school.com', role: 'TEACHER' },
    { id: 'admin', name: 'System Admin', email: 'admin@school.com', role: 'ADMIN' },
  ],
  teachers: [
    { id: 't1', userId: 'u1', departmentId: 'd1', role: 'Head of Department', status: 'In Class', avatar: 'EW', salary: 5000 },
    { id: 't2', userId: 'u4', departmentId: 'd2', role: 'Senior Teacher', status: 'Available', avatar: 'RR', salary: 4500 },
  ],
  students: [
    { id: 's1', userId: 'u2', classId: 'c1', guardianId: 'g1', status: 'Active', avatar: 'AJ' },
  ],
  guardians: [
    { id: 'g1', userId: 'u3', phone: '555-0123' },
  ],
  departments: [
    { id: 'd1', name: 'Mathematics' },
    { id: 'd2', name: 'Fine Arts' },
  ],
  classes: [
    { id: 'c1', name: 'Class 10-A', grade: '10th', section: 'A', teacherId: 't1' },
  ],
  subjects: [
    { id: 'sub1', name: 'Mathematics', code: 'MATH101' },
    { id: 'sub2', name: 'Physics', code: 'PHYS101' },
    { id: 'sub3', name: 'Advanced Chemistry', code: 'CHEM201' },
  ],
  schedules: [
    { id: 'sch1', classId: 'c1', subjectId: 'sub1', teacherId: 't1', day: 'Monday', startTime: '08:00', endTime: '09:30', room: 'R201' },
    { id: 'sch2', classId: 'c1', subjectId: 'sub2', teacherId: 't2', day: 'Monday', startTime: '10:00', endTime: '11:00', room: 'R201' },
    { id: 'sch3', classId: 'c1', subjectId: 'sub3', teacherId: 't1', day: 'Tuesday', startTime: '09:00', endTime: '10:30', room: 'Lab A' },
  ],
  attendance: [
    { id: 'a1', entityId: 's1', entityType: 'STUDENT', date: '2023-10-17', status: 'Present' },
  ],
  fees: [
    { id: 'f1', studentId: 's1', categoryId: 'cat1', amountPaid: 1200, dueDate: '2023-11-01', status: 'Pending' },
  ],
  feeCategories: [
    { id: 'cat1', name: 'Tuition Fee', amount: 1500, frequency: 'Monthly' },
    { id: 'cat2', name: 'Admission Fee', amount: 5000, frequency: 'One-time' },
    { id: 'cat3', name: 'Library Fee', amount: 200, frequency: 'Quarterly' },
    { id: 'cat4', name: 'Examination Fee', amount: 500, frequency: 'Bi-annual' },
  ],
  events: [
    { id: 'e1', title: 'Annual Sports Day 2023', date: '2023-12-15', location: 'Stadium', category: 'Sports', image: 'https://picsum.photos/seed/sports/800/600', status: 'Upcoming', isPublic: true },
  ],
  exams: [
    { id: 'exam1', name: 'Mid-Term 2024', date: '2024-11-12', totalMarks: 100, status: 'Active' },
    { id: 'exam2', name: 'Quantum Physics Final', date: '2024-11-20', totalMarks: 100, status: 'Upcoming' },
  ],
  examResults: [
    { id: 'res1', studentId: 's1', examId: 'exam1', subjectId: 'sub1', marks: 85, gradingNode: 'Alpha-7' },
  ],
  salaryPayments: [
    { id: 'sp1', teacherId: 't1', month: 'October 2023', amount: 5000, status: 'Paid', paymentDate: '2023-10-05' },
    { id: 'sp2', teacherId: 't2', month: 'October 2023', amount: 4500, status: 'Paid', paymentDate: '2023-10-05' },
    { id: 'sp3', teacherId: 't1', month: 'November 2023', amount: 5000, status: 'Pending', paymentDate: null },
    { id: 'sp4', teacherId: 't2', month: 'November 2023', amount: 4500, status: 'Pending', paymentDate: null },
  ],
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health
  app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

  // Dashboard Stats (Aggregated)
  app.get('/api/stats', (req, res) => {
    res.json({
      students: db.students.length,
      teachers: db.teachers.length,
      attendance: '92%',
      feesCollected: db.fees.filter(f => f.status === 'Paid').reduce((acc, curr) => acc + curr.amountPaid, 0),
    });
  });

  // Students
  app.get('/api/students', (req, res) => {
    const enriched = db.students.map(s => ({
      ...s,
      user: db.users.find(u => u.id === s.userId),
      class: db.classes.find(c => c.id === s.classId),
      guardian: db.guardians.find(g => g.id === s.guardianId),
    }));
    res.json(enriched);
  });

  app.post('/api/students', (req, res) => {
    const { name, email, classId, guardianPhone, guardianName } = req.body;
    
    // Guardian Unification Logic with Phone Normalization
    const normalizedTarget = normalizePhone(guardianPhone);
    let guardian = db.guardians.find(g => normalizePhone(g.phone) === normalizedTarget);
    
    if (!guardian) {
      const gUserId = `u${db.users.length + 1}`;
      const gId = `g${db.guardians.length + 1}`;
      const newGUser = { id: gUserId, name: guardianName || 'New Guardian', email: `guardian_${gId}@school.com`, role: 'GUARDIAN' };
      guardian = { id: gId, userId: gUserId, phone: guardianPhone };
      db.users.push(newGUser as any);
      db.guardians.push(guardian);
    }

    const userId = `u${db.users.length + 1}`;
    const studentId = `s${db.students.length + 1}`;
    
    const newUser = { id: userId, name, email, role: 'STUDENT' };
    const newStudent = { id: studentId, userId, classId, guardianId: guardian.id, status: 'Active', avatar: name.charAt(0) };
    
    db.users.push(newUser as any);
    db.students.push(newStudent as any);

    // Initial Billing Synchronization
    db.fees.push({
      id: `f${db.fees.length + 1}`,
      studentId: studentId,
      categoryId: 'cat1',
      amountPaid: 0,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'Pending'
    });
    
    res.status(201).json(newStudent);
  });

  app.patch('/api/students/:id/promote', (req, res) => {
    const { classId } = req.body;
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    student.classId = classId;
    res.json(student);
  });

  app.patch('/api/students/:id/withdraw', (req, res) => {
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    student.status = 'Withdrawn';
    res.json(student);
  });

  // Classes
  app.get('/api/classes', (req, res) => {
    const enriched = db.classes.map(c => ({
      ...c,
      teacher: db.users.find(u => u.id === db.teachers.find(t => t.id === c.teacherId)?.userId),
      studentCount: db.students.filter(s => s.classId === c.id).length
    }));
    res.json(enriched);
  });

  app.post('/api/classes', (req, res) => {
    const id = `c${db.classes.length + 1}`;
    const newClass = { ...req.body, id };
    db.classes.push(newClass);
    res.status(201).json(newClass);
  });

  app.post('/api/classes/bulk-import', (req, res) => {
    const { classes } = req.body;
    classes.forEach((c: any) => {
      const id = `c${db.classes.length + 1}`;
      db.classes.push({ ...c, id });
    });
    res.status(201).json({ status: 'bulk_sync_complete', count: classes.length });
  });

  app.get('/api/schedules', (req, res) => {
    const enriched = db.schedules.map(s => ({
      ...s,
      class: db.classes.find(c => c.id === s.classId),
      subject: db.subjects.find(sub => sub.id === s.subjectId),
      teacher: db.users.find(u => u.id === db.teachers.find(t => t.id === s.teacherId)?.userId),
    }));
    res.json(enriched);
  });

  app.get('/api/subjects', (req, res) => res.json(db.subjects));

  app.get('/api/departments', (req, res) => res.json(db.departments));

  // Teachers
  app.get('/api/teachers', (req, res) => {
    const enriched = db.teachers.map(t => ({
      ...t,
      user: db.users.find(u => u.id === t.userId),
      department: db.departments.find(d => d.id === t.departmentId),
    }));
    res.json(enriched);
  });

  // Finance
  app.get('/api/fees', (req, res) => {
    const enriched = db.fees.map(f => ({
      ...f,
      student: db.students.find(s => s.id === f.studentId),
      class: db.classes.find(c => c.id === db.students.find(s => s.id === f.studentId)?.classId),
      studentUser: db.users.find(u => {
        const student = db.students.find(s => s.id === f.studentId);
        return student ? u.id === student.userId : false;
      }),
      category: db.feeCategories.find(c => c.id === f.categoryId),
    }));
    res.json(enriched);
  });

  app.get('/api/fee-categories', (req, res) => res.json(db.feeCategories));
  
  app.post('/api/fee-categories', (req, res) => {
    const id = `cat${db.feeCategories.length + 1}`;
    const newCat = { ...req.body, id };
    db.feeCategories.push(newCat);
    res.status(201).json(newCat);
  });

  app.patch('/api/fees/:id/pay', (req, res) => {
    const { amount } = req.body;
    const fee = db.fees.find(f => f.id === req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    
    fee.amountPaid += amount;
    const category = db.feeCategories.find(c => c.id === fee.categoryId);
    if (category && fee.amountPaid >= category.amount) {
      fee.status = 'Paid';
    }
    res.json(fee);
  });

  app.get('/api/finance/overview', (req, res) => {
    const totalFees = db.fees.filter(f => f.status === 'Paid').reduce((acc, f) => acc + f.amountPaid, 0);
    const totalSalaries = db.salaryPayments.filter(s => s.status === 'Paid').reduce((acc, s) => acc + s.amount, 0);
    const pendingFees = db.fees.filter(f => f.status === 'Pending').reduce((acc, f) => {
      const cat = db.feeCategories.find(c => c.id === f.categoryId);
      return acc + (cat ? cat.amount - f.amountPaid : 0);
    }, 0);
    const pendingSalaries = db.salaryPayments.filter(s => s.status === 'Pending').reduce((acc, s) => acc + s.amount, 0);

    res.json({
      revenue: totalFees,
      expenses: totalSalaries,
      netProfit: totalFees - totalSalaries,
      receivables: pendingFees,
      payables: pendingSalaries,
      recentTransactions: [
        ...db.fees.map(f => ({ 
          type: 'Income', 
          category: 'Student Fee', 
          amount: f.amountPaid, 
          date: f.dueDate, 
          status: f.status,
          beneficiary: db.users.find(u => u.id === db.students.find(s => s.id === f.studentId)?.userId)?.name
        })),
        ...db.salaryPayments.map(s => ({ 
          type: 'Expense', 
          category: 'Staff Salary', 
          amount: s.amount, 
          date: s.paymentDate || 'Pending', 
          status: s.status,
          beneficiary: db.users.find(u => u.id === db.teachers.find(t => t.id === s.teacherId)?.userId)?.name
        }))
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
    });
  });

  app.get('/api/salaries', (req, res) => {
    const enriched = db.salaryPayments.map(s => ({
      ...s,
      teacher: db.teachers.find(t => t.id === s.teacherId),
      teacherUser: db.users.find(u => u.id === db.teachers.find(t => t.id === s.teacherId)?.userId),
    }));
    res.json(enriched);
  });

  app.patch('/api/salaries/:id/pay', (req, res) => {
    const pay = db.salaryPayments.find(s => s.id === req.params.id);
    if (!pay) return res.status(404).json({ error: 'Salary record not found' });
    
    pay.status = 'Paid';
    pay.paymentDate = new Date().toISOString().split('T')[0];
    res.json(pay);
  });

  // Attendance
  app.get('/api/attendance', (req, res) => {
    const enriched = db.attendance.map(a => ({
      ...a,
      entity: a.entityType === 'STUDENT' 
        ? db.users.find(u => u.id === db.students.find(s => s.id === a.entityId)?.userId)
        : db.users.find(u => u.id === db.teachers.find(t => t.id === a.entityId)?.userId),
    }));
    res.json(enriched);
  });

  app.post('/api/attendance', (req, res) => {
    const { entityId, entityType, status } = req.body;
    const today = new Date().toISOString().split('T')[0];
    
    // Simple update or create logic for demo
    const existing = db.attendance.find(a => a.entityId === entityId && a.date === today);
    if (existing) {
      existing.status = status;
      res.json(existing);
    } else {
      const newRecord = {
        id: `a${db.attendance.length + 1}`,
        entityId,
        entityType,
        date: today,
        status
      };
      db.attendance.push(newRecord);
      res.status(201).json(newRecord);
    }
  });

  // Events
  app.get('/api/events', (req, res) => res.json(db.events));

  // Examinations & Assessments
  app.get('/api/exams', (req, res) => res.json(db.exams));

  app.get('/api/exam-results', (req, res) => {
    const enriched = db.examResults.map(r => ({
      ...r,
      student: db.students.find(s => s.id === r.studentId),
      studentUser: db.users.find(u => u.id === db.students.find(s => s.id === r.studentId)?.userId),
      exam: db.exams.find(ex => ex.id === r.examId),
      subject: db.subjects.find(sub => sub.id === r.subjectId),
    }));
    res.json(enriched);
  });

  app.post('/api/exam-results', (req, res) => {
    const { results } = req.body; // Array of { studentId, examId, subjectId, marks }
    results.forEach((r: any) => {
      const id = `res${db.examResults.length + 1}`;
      db.examResults.push({ 
        ...r, 
        id, 
        gradingNode: `Node-${Math.floor(Math.random() * 100)}` 
      });
    });
    res.status(201).json({ status: 'results_synchronized', count: results.length });
  });

  app.get('/api/exam-stats', (req, res) => {
    const scores = db.examResults.map(r => r.marks);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
    const passRate = scores.length > 0 ? ((scores.filter(s => s >= 40).length / scores.length) * 100).toFixed(0) : 0;
    
    res.json({
      avgScore,
      passRate: `${passRate}%`,
      totalGraded: db.examResults.length,
      masteryIndex: 'High-Beta'
    });
  });

  // Normalize phone number function
  const normalizePhone = (phone: string) => phone.replace(/\D/g, '');

  app.get('/api/guardians/search-by-phone/:phone', (req, res) => {
    const rawPhone = req.params.phone;
    const phone = normalizePhone(rawPhone);
    const guardian = db.guardians.find(g => normalizePhone(g.phone) === phone);
    
    if (!guardian) {
      return res.status(404).json({ error: 'Guardian not found with this phone number' });
    }

    const students = db.students.filter(s => s.guardianId === guardian.id).map(student => {
      const user = db.users.find(u => u.id === student.userId);
      const studentGuardian = db.guardians.find(g => g.id === student.guardianId);
      const guardianUser = db.users.find(u => u.id === studentGuardian?.userId);

      return {
        ...student,
        user,
        class: db.classes.find(c => c.id === student.classId),
        guardian: studentGuardian ? { ...studentGuardian, user: guardianUser } : null,
        attendance: db.attendance.filter(a => a.entityId === student.id),
        fees: db.fees.filter(f => f.studentId === student.id).map(f => ({
          ...f,
          category: db.feeCategories.find(c => c.id === f.categoryId)
        })),
        results: db.examResults.filter(r => r.studentId === student.id).map(r => ({
          ...r,
          exam: db.exams.find(ex => ex.id === r.examId),
          subject: db.subjects.find(sub => sub.id === r.subjectId),
        })),
      };
    });

    res.json({
      guardian: {
        ...guardian,
        user: db.users.find(u => u.id === guardian.userId)
      },
      students
    });
  });

  // Guardian Specific (Interconnected)
  app.get('/api/guardians/:id/summary', (req, res) => {
    const guardianId = req.params.id;
    const students = db.students.filter(s => s.guardianId === guardianId);
    
    const summaries = students.map(student => {
      const user = db.users.find(u => u.id === student.userId);
      const studentGuardian = db.guardians.find(g => g.id === student.guardianId);
      const guardianUser = db.users.find(u => u.id === studentGuardian?.userId);

      return {
        student: {
          ...student,
          user,
          guardian: studentGuardian ? { ...studentGuardian, user: guardianUser } : null
        },
        attendance: db.attendance.filter(a => a.entityId === student.id),
        fees: db.fees.filter(f => f.studentId === student.id).map(f => ({
          ...f,
          category: db.feeCategories.find(c => c.id === f.categoryId)
        })),
        results: db.examResults.filter(r => r.studentId === student.id).map(r => ({
          ...r,
          exam: db.exams.find(ex => ex.id === r.examId),
          subject: db.subjects.find(sub => sub.id === r.subjectId),
        })),
      };
    });
    res.json(summaries);
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`EduFlow SaaS Unified Server active at port ${PORT}`));
}

startServer();
