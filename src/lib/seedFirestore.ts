import { db } from './firebase';
import { doc, writeBatch, collection } from 'firebase/firestore';

const initialData = {
  users: [
    { id: 'sa-uid', name: 'System Admin', email: 'admin@school.com', role: 'ADMIN' },
    { id: 'u1', name: 'Dr. Emily Watson', email: 'emily@school.com', role: 'TEACHER' },
    { id: 'u2', name: 'Alex Johnson', email: 'alex@student.com', role: 'STUDENT' },
    { id: 'u3', name: 'Sarah Johnson', email: 'sarah@guardian.com', role: 'GUARDIAN' },
    { id: 'u4', name: 'Robert Ross', email: 'robert@school.com', role: 'TEACHER' },
    { id: 'u5', name: 'Michael Chen', email: 'michael@school.com', role: 'TEACHER' },
    { id: 'u6', name: 'Sophia Miller', email: 'sophia@student.com', role: 'STUDENT' },
    { id: 'u7', name: 'David Wilson', email: 'david@student.com', role: 'STUDENT' },
    { id: 'u8', name: 'Emma Davis', email: 'emma@student.com', role: 'STUDENT' },
    { id: 'u9', name: 'James Brown', email: 'james@student.com', role: 'STUDENT' },
  ],
  teachers: [
    { id: 't1', userId: 'u1', departmentId: 'd1', role: 'Head of Department', status: 'In Class', avatar: 'EW', salary: 5500 },
    { id: 't2', userId: 'u4', departmentId: 'd2', role: 'Senior Teacher', status: 'Available', avatar: 'RR', salary: 4800 },
    { id: 't3', userId: 'u5', departmentId: 'd1', role: 'Lecturer', status: 'In Meeting', avatar: 'MC', salary: 4200 },
  ],
  students: [
    { id: 's1', userId: 'u2', classId: 'c1', guardianId: 'g1', status: 'Active', avatar: 'AJ', enrollmentDate: '2023-09-01' },
    { id: 's2', userId: 'u6', classId: 'c1', guardianId: 'g1', status: 'Active', avatar: 'SM', enrollmentDate: '2023-09-01' },
    { id: 's3', userId: 'u7', classId: 'c2', guardianId: 'g1', status: 'Active', avatar: 'DW', enrollmentDate: '2023-09-15' },
    { id: 's4', userId: 'u8', classId: 'c3', guardianId: 'g1', status: 'Active', avatar: 'ED', enrollmentDate: '2023-09-15' },
    { id: 's5', userId: 'u9', classId: 'c1', guardianId: 'g1', status: 'Active', avatar: 'JB', enrollmentDate: '2023-10-01' },
  ],
  guardians: [
    { id: 'g1', userId: 'u3', phone: '555-0123', relationship: 'Mother', address: '123 Educational Lane' },
  ],
  departments: [
    { id: 'd1', name: 'Mathematics & Science', head: 'Dr. Emily Watson' },
    { id: 'd2', name: 'Fine Arts & Humanities', head: 'Robert Ross' },
    { id: 'd3', name: 'Physical Education', head: 'Coach Miller' },
  ],
  classes: [
    { id: 'c1', name: 'Class 10-A', grade: '10th', section: 'A', teacherId: 't1', room: 'R201', capacity: 30 },
    { id: 'c2', name: 'Class 10-B', grade: '10th', section: 'B', teacherId: 't2', room: 'R202', capacity: 30 },
    { id: 'c3', name: 'Class 11-A', grade: '11th', section: 'A', teacherId: 't3', room: 'R301', capacity: 25 },
  ],
  subjects: [
    { id: 'sub1', name: 'Mathematics', code: 'MATH101', departmentId: 'd1' },
    { id: 'sub2', name: 'Physics', code: 'PHYS101', departmentId: 'd1' },
    { id: 'sub3', name: 'Modern Art', code: 'ART201', departmentId: 'd2' },
    { id: 'sub4', name: 'English Literature', code: 'ENG101', departmentId: 'd2' },
  ],
  schedules: [
    { id: 'sch1', classId: 'c1', subjectId: 'sub1', teacherId: 't1', day: 'Monday', startTime: '08:00', endTime: '09:30', room: 'R201' },
    { id: 'sch2', classId: 'c1', subjectId: 'sub2', teacherId: 't3', day: 'Monday', startTime: '10:00', endTime: '11:00', room: 'R201' },
    { id: 'sch3', classId: 'c2', subjectId: 'sub3', teacherId: 't2', day: 'Tuesday', startTime: '09:00', endTime: '10:30', room: 'Studio 1' },
    { id: 'sch4', classId: 'c3', subjectId: 'sub1', teacherId: 't1', day: 'Wednesday', startTime: '11:00', endTime: '12:30', room: 'R301' },
  ],
  attendance: [
    { id: 'att1', entityId: 's1', entityType: 'STUDENT', date: new Date().toISOString().split('T')[0], status: 'Present' },
    { id: 'att2', entityId: 's2', entityType: 'STUDENT', date: new Date().toISOString().split('T')[0], status: 'Present' },
    { id: 'att3', entityId: 's3', entityType: 'STUDENT', date: new Date().toISOString().split('T')[0], status: 'Absent' },
    { id: 'att4', entityId: 't1', entityType: 'TEACHER', date: new Date().toISOString().split('T')[0], status: 'Present' },
  ],
  fees: [
    { id: 'f1', studentId: 's1', categoryId: 'cat1', amount: 1500, amountPaid: 1500, dueDate: '2024-01-01', status: 'Paid' },
    { id: 'f2', studentId: 's2', categoryId: 'cat1', amount: 1500, amountPaid: 0, dueDate: '2024-02-01', status: 'Pending' },
    { id: 'f3', studentId: 's3', categoryId: 'cat1', amount: 1500, amountPaid: 750, dueDate: '2024-02-01', status: 'Partial' },
  ],
  feeCategories: [
    { id: 'cat1', name: 'Tuition Fee', amount: 1500, frequency: 'Monthly' },
    { id: 'cat2', name: 'Laboratory Fee', amount: 300, frequency: 'Monthly' },
    { id: 'cat3', name: 'Transport Fee', amount: 500, frequency: 'Monthly' },
  ],
  events: [
    { id: 'e1', title: 'Science Exhibition', date: '2024-12-15', location: 'Main Hall', category: 'Academic', status: 'Upcoming', isPublic: true },
    { id: 'e2', title: 'Alumni Meet', date: '2024-11-20', location: 'Conference Room', category: 'Social', status: 'Upcoming', isPublic: true },
  ],
  exams: [
    { id: 'exam1', name: 'First Semester Finals', date: '2024-11-15', totalMarks: 100, status: 'Upcoming' },
    { id: 'exam2', name: 'Monthly Assessment', date: '2024-10-30', totalMarks: 50, status: 'Active' },
  ],
  examResults: [
    { id: 'res1', studentId: 's1', examId: 'exam2', subjectId: 'sub1', marks: 45, gradingNode: 'Beta-4' },
    { id: 'res2', studentId: 's2', examId: 'exam2', subjectId: 'sub1', marks: 38, gradingNode: 'Beta-4' },
  ],
  salaryPayments: [
    { id: 'sp1', teacherId: 't1', month: 'October 2024', amount: 5500, status: 'Paid', paymentDate: '2024-10-01' },
    { id: 'sp2', teacherId: 't2', month: 'October 2024', amount: 4800, status: 'Paid', paymentDate: '2024-10-01' },
  ],
};

export const seedDatabase = async (schoolId: string = 'default-school') => {
  const batch = writeBatch(db);

  for (const [collectionName, records] of Object.entries(initialData)) {
    records.forEach((record: any) => {
      const docRef = doc(db, 'schools', schoolId, collectionName, record.id);
      batch.set(docRef, { ...record, schoolId });
    });
  }

  await batch.commit();
  console.log(`Database seeded successfully for school: ${schoolId}`);
};
