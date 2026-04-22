import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  deleteDoc,
  Timestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './firebase';

export class FirestoreService {
  private schoolId: string;

  constructor(schoolId: string) {
    this.schoolId = schoolId;
  }

  private getColRef(collectionName: string) {
    return collection(db, 'schools', this.schoolId, collectionName);
  }

  private getDocRef(collectionName: string, docId: string) {
    return doc(db, 'schools', this.schoolId, collectionName, docId);
  }

  async getAll(collectionName: string) {
    const q = query(this.getColRef(collectionName));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  }

  async getById(collectionName: string, id: string) {
    const snap = await getDoc(this.getDocRef(collectionName, id));
    return snap.exists() ? { ...snap.data(), id: snap.id } : null;
  }

  async create(collectionName: string, data: any) {
    const id = data.id || doc(this.getColRef(collectionName)).id;
    const docRef = this.getDocRef(collectionName, id);
    const payload = { ...data, id, schoolId: this.schoolId, createdAt: new Date().toISOString() };
    await setDoc(docRef, payload);
    return payload;
  }

  async update(collectionName: string, id: string, data: any) {
    const docRef = this.getDocRef(collectionName, id);
    const payload = { ...data, updatedAt: new Date().toISOString() };
    await updateDoc(docRef, payload);
    return payload;
  }

  async delete(collectionName: string, id: string) {
    await deleteDoc(this.getDocRef(collectionName, id));
  }

  async enrollStudent(data: {
    name: string;
    email: string;
    classId: string;
    guardianName: string;
    guardianPhone: string;
  }) {
    // 1. Create Student User Record
    const userId = doc(this.getColRef('users')).id;
    const userPayload = {
      id: userId,
      name: data.name,
      email: data.email,
      role: 'STUDENT',
      schoolId: this.schoolId,
      createdAt: new Date().toISOString()
    };
    await setDoc(this.getDocRef('users', userId), userPayload);

    // 2. Resolve Guardian
    const guardianQuery = query(this.getColRef('guardians'), where('phone', '==', data.guardianPhone));
    const guardianSnap = await getDocs(guardianQuery);
    let guardianId;

    if (guardianSnap.empty) {
      // Create new Guardian Profile (User & Guardian records)
      const guardianUserId = doc(this.getColRef('users')).id;
      await setDoc(this.getDocRef('users', guardianUserId), {
        id: guardianUserId,
        name: data.guardianName,
        email: `guardian_${data.guardianPhone}@school.edu`, // Placeholder email
        role: 'GUARDIAN',
        schoolId: this.schoolId,
        createdAt: new Date().toISOString()
      });

      guardianId = doc(this.getColRef('guardians')).id;
      await setDoc(this.getDocRef('guardians', guardianId), {
        id: guardianId,
        userId: guardianUserId,
        phone: data.guardianPhone,
        schoolId: this.schoolId,
        createdAt: new Date().toISOString()
      });
    } else {
      guardianId = guardianSnap.docs[0].id;
    }

    // 3. Create Student Document
    const studentId = doc(this.getColRef('students')).id;
    const studentPayload = {
      id: studentId,
      userId: userId,
      classId: data.classId,
      guardianId: guardianId,
      status: 'Active',
      avatar: data.name.charAt(0),
      schoolId: this.schoolId,
      createdAt: new Date().toISOString()
    };
    await setDoc(this.getDocRef('students', studentId), studentPayload);

    return { studentId, userId, guardianId };
  }

  // Specialized multi-child query for Guardians
  async getGuardianSummary(phone: string) {
    // 1. Find the guardian by phone
    const guardianQuery = query(this.getColRef('guardians'), where('phone', '==', phone));
    const guardianSnap = await getDocs(guardianQuery);
    
    if (guardianSnap.empty) return null;
    const guardian = { ...guardianSnap.docs[0].data(), id: guardianSnap.docs[0].id } as any;

    // 2. Find all students for this guardian
    const studentsQuery = query(this.getColRef('students'), where('guardianId', '==', guardian.id));
    const studentsSnap = await getDocs(studentsQuery);
    
    // 3. Enrich each student with results, fees, attendance
    const summary = await Promise.all(studentsSnap.docs.map(async (studentDoc) => {
      const studentData = { ...studentDoc.data(), id: studentDoc.id } as any;
      
      // Get related data in parallel for speed
      const [user, classData, attendance, rawFees, results] = await Promise.all([
        this.getById('users', studentData.userId),
        this.getById('classes', studentData.classId),
        this.queryByField('attendance', 'entityId', studentData.id),
        this.queryByField('fees', 'studentId', studentData.id),
        this.queryByField('examResults', 'studentId', studentData.id),
      ]);

      // Enrich fees with categories for fiscal display
      const fees = await Promise.all(rawFees.map(async (f: any) => ({
        ...f,
        category: await this.getById('feeCategories', f.categoryId)
      })));

      return {
        student: { ...studentData, user, class: classData },
        attendance,
        fees,
        results
      };
    }));

    return { guardian, summary };
  }

  async getSummaryById(guardianId: string) {
    const guardian = await this.getById('guardians', guardianId);
    if (!guardian) return null;

    const studentsQuery = query(this.getColRef('students'), where('guardianId', '==', guardianId));
    const studentsSnap = await getDocs(studentsQuery);
    
    const summary = await Promise.all(studentsSnap.docs.map(async (studentDoc) => {
      const studentData = { ...studentDoc.data(), id: studentDoc.id } as any;
      const [user, classData, attendance, rawFees, results] = await Promise.all([
        this.getById('users', studentData.userId),
        this.getById('classes', studentData.classId),
        this.queryByField('attendance', 'entityId', studentData.id),
        this.queryByField('fees', 'studentId', studentData.id),
        this.queryByField('examResults', 'studentId', studentData.id),
      ]);

      const fees = await Promise.all(rawFees.map(async (f: any) => ({
        ...f,
        category: await this.getById('feeCategories', f.categoryId)
      })));

      return {
        student: { ...studentData, user, class: classData },
        attendance,
        fees,
        results
      };
    }));

    return { guardian, summary };
  }

  private async queryByField(collectionName: string, field: string, value: string) {
    const q = query(this.getColRef(collectionName), where(field, '==', value));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ ...d.data(), id: d.id }));
  }
}
