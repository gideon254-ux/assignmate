import { useEffect, useState, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  dueDate: Date;
  priority: Priority;
  status: Status;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssignmentInput {
  title: string;
  description?: string;
  subject: string;
  dueDate: Date;
  priority: Priority;
}

export interface UpdateAssignmentInput {
  title?: string;
  description?: string;
  subject?: string;
  dueDate?: Date;
  priority?: Priority;
  status?: Status;
}

interface UseAssignmentsReturn {
  assignments: Assignment[];
  loading: boolean;
  error: Error | null;
  createAssignment: (data: CreateAssignmentInput) => Promise<void>;
  updateAssignment: (id: string, data: UpdateAssignmentInput) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
}

function convertTimestampToDate(timestamp: Timestamp | Date | undefined): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp || new Date();
}

function convertDocToAssignment(doc: any): Assignment {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description || null,
    subject: data.subject,
    dueDate: convertTimestampToDate(data.dueDate),
    priority: data.priority,
    status: data.status,
    userId: data.userId,
    createdAt: convertTimestampToDate(data.createdAt),
    updatedAt: convertTimestampToDate(data.updatedAt),
  };
}

export function useAssignments(): UseAssignmentsReturn {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const q = query(
      collection(db, 'assignments'),
      where('userId', '==', user.id),
      orderBy('dueDate', 'asc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedAssignments = snapshot.docs.map(convertDocToAssignment);
        setAssignments(fetchedAssignments);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching assignments:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const createAssignment = useCallback(async (data: CreateAssignmentInput) => {
    if (!user) throw new Error('User not authenticated');

    await addDoc(collection(db, 'assignments'), {
      ...data,
      status: 'pending',
      userId: user.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }, [user]);

  const updateAssignment = useCallback(async (id: string, data: UpdateAssignmentInput) => {
    await updateDoc(doc(db, 'assignments', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const deleteAssignment = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'assignments', id));
  }, []);

  return {
    assignments,
    loading,
    error,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}