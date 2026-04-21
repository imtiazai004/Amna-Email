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
      const [user, classData, attendance, fees, results] = await Promise.all([
        this.getById('users', studentData.userId),
        this.getById('classes', studentData.classId),
        this.queryByField('attendance', 'entityId', studentData.id),
        this.queryByField('fees', 'studentId', studentData.id),
        this.queryByField('examResults', 'studentId', studentData.id),
      ]);

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
      const [user, classData, attendance, fees, results] = await Promise.all([
        this.getById('users', studentData.userId),
        this.getById('classes', studentData.classId),
        this.queryByField('attendance', 'entityId', studentData.id),
        this.queryByField('fees', 'studentId', studentData.id),
        this.queryByField('examResults', 'studentId', studentData.id),
      ]);

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
