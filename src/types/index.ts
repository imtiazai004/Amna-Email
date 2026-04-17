export type ID = string;

export interface Tenant {
  id: ID;
  name: string;
  subdomain: string;
}

export interface User {
  id: ID;
  role: 'ADMIN' | 'TEACHER' | 'STAFF' | 'GUARDIAN' | 'STUDENT';
  email: string;
  name: string;
}

export interface Teacher {
  id: ID;
  userId: ID;
  departmentId: ID;
  role: string;
  avatar: string;
  status: 'Available' | 'In Class' | 'On Leave';
  salary: number;
}

export interface Subject {
  id: ID;
  name: string;
  code: string;
}

export interface Department {
  id: ID;
  name: string;
}

export interface Class {
  id: ID;
  name: string;
  grade: string;
  section: string;
  teacherId: ID; // Class teacher
}

export interface Student {
  id: ID;
  userId: ID;
  classId: ID;
  guardianId: ID;
  status: 'Active' | 'On Leave' | 'Suspended';
  avatar: string;
}

export interface Attendance {
  id: ID;
  entityId: ID; // Student or Staff ID
  entityType: 'STUDENT' | 'STAFF';
  date: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export interface Exam {
  id: ID;
  name: string;
  classId: ID;
  subjectId: ID;
  date: string;
  maxMarks: number;
}

export interface Result {
  id: ID;
  examId: ID;
  studentId: ID;
  marksObtained: number;
  grade: string;
}

export interface FeeCategory {
  id: ID;
  name: string;
  amount: number;
}

export interface FeeRecord {
  id: ID;
  studentId: ID;
  categoryId: ID;
  amountPaid: number;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

export interface Guardian {
  id: ID;
  userId: ID;
  phone: string;
}

export interface SchoolEvent {
  id: ID;
  title: string;
  date: string;
  location: string;
  category: string;
  image: string;
  status: string;
  isPublic: boolean;
}

export interface Announcement {
  id: ID;
  title: string;
  content: string;
  date: string;
  postedBy: ID;
}
