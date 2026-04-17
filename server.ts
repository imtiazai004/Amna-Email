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
    { id: 'cat1', name: 'Tuition Fee', amount: 1500 },
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
    const { name, email, classId, guardianId } = req.body;
    const userId = `u${db.users.length + 1}`;
    const studentId = `s${db.students.length + 1}`;
    
    const newUser = { id: userId, name, email, role: 'STUDENT' };
    const newStudent = { id: studentId, userId, classId, guardianId, status: 'Active', avatar: name.charAt(0) };
    
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
      studentUser: db.users.find(u => {
        const student = db.students.find(s => s.id === f.studentId);
        return student ? u.id === student.userId : false;
      }),
      category: db.feeCategories.find(c => c.id === f.categoryId),
    }));
    res.json(enriched);
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

  // Guardian Specific (Interconnected)
  app.get('/api/guardians/:id/summary', (req, res) => {
    const guardianId = req.params.id;
    const students = db.students.filter(s => s.guardianId === guardianId);
    const summaries = students.map(student => ({
      student: db.users.find(u => u.id === student.userId),
      attendance: db.attendance.filter(a => a.entityId === student.id),
      fees: db.fees.filter(f => f.studentId === student.id),
    }));
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
