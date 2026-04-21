import { db } from './firebase';
import { doc, writeBatch, collection } from 'firebase/firestore';

const initialData = {
  users: [
    { id: 'sa-uid', name: 'System Admin', email: 'admin@school.com', role: 'ADMIN' },
    { id: 'u1', name: 'Dr. Emily Watson', email: 'emily@school.com', role: 'TEACHER' },
    { id: 'u2', name: 'Alex Johnson', email: 'alex@student.com', role: 'STUDENT' },
    { id: 'u3', name: 'Sarah Johnson', email: 'sarah@guardian.com', role: 'GUARDIAN' },
    { id: 'u4', name: 'Robert Ross', email: 'robert@school.com', role: 'TEACHER' },
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
