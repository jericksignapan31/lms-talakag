import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Student {
    id: number;
    lrn: string;
    name: string;
    sex: string;
    birthDate: string;
    address: string;
    barangay: string;
    municipality: string;
    province: string;
    contactNumber: string;
    learningModality: string;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
    private http = inject(HttpClient);

    /**
     * Get student by LRN
     */
    getStudentByLRN(lrn: string): Observable<Student[]> {
        return this.http.get<Student[]>(`/api/students?lrn=${encodeURIComponent(lrn)}`);
    }

    /**
     * Get all students
     */
    getAllStudents(): Observable<Student[]> {
        return this.http.get<Student[]>('/api/students');
    }

    /**
     * Get student by ID
     */
    getStudentById(id: number): Observable<Student> {
        return this.http.get<Student>(`/api/students/${id}`);
    }

    /**
     * Create new student
     */
    createStudent(student: Omit<Student, 'id'>): Observable<Student> {
        return this.http.post<Student>('/api/students', student);
    }

    /**
     * Update student
     */
    updateStudent(id: number, student: Partial<Student>): Observable<Student> {
        return this.http.put<Student>(`/api/students/${id}`, student);
    }

    /**
     * Delete student
     */
    deleteStudent(id: number): Observable<void> {
        return this.http.delete<void>(`/api/students/${id}`);
    }
}
