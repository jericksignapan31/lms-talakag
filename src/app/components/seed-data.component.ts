import { Component, inject, OnInit } from '@angular/core';
import { FirestoreStudentService, Student } from '../services/firestore-student.service';
import { FirebaseAuthService } from '../services/firebase-auth.service';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

/**
 * Seed students data into Firestore
 * Run this once to populate initial data
 * 
 * Usage: Inject in app.component and call seedStudentData() on init
 */
@Component({
  selector: 'app-seed-data',
  template: ``
})
export class SeedDataComponent implements OnInit {
  private studentService = inject(FirestoreStudentService);
  private auth = getAuth();

  ngOnInit() {
    // Call this once only!
    // this.seedStudentData();
  }

  async seedStudentData() {
    const studentsData: Student[] = [
      {
        lrn: '1234567890',
        name: 'Juan Santos',
        email: 'juan@lms.com',
        sex: 'Male',
        birthDate: '2008-05-15',
        address: '123 Main Street',
        barangay: 'Tagumpay',
        municipality: 'Talakag',
        province: 'Bukidnon',
        contactNumber: '09123456789',
        learningModality: 'Face-to-Face'
      },
      {
        lrn: '1234567891',
        name: 'Maria Cruz',
        email: 'maria@lms.com',
        sex: 'Female',
        birthDate: '2008-08-20',
        address: '456 Oak Avenue',
        barangay: 'Sumasama',
        municipality: 'Talakag',
        province: 'Bukidnon',
        contactNumber: '09234567890',
        learningModality: 'Online'
      },
      {
        lrn: '1234567892',
        name: 'Pedro Reyes',
        email: 'pedro@lms.com',
        sex: 'Male',
        birthDate: '2007-12-10',
        address: '789 Pine Road',
        barangay: 'Poblacion',
        municipality: 'Talakag',
        province: 'Bukidnon',
        contactNumber: '09345678901',
        learningModality: 'Hybrid'
      }
    ];

    try {
      for (const student of studentsData) {
        // Add to Firestore
        const studentId = await this.studentService.addStudent(student);
        
        // Create Firebase Auth account using LRN
        try {
          const email = `${student.lrn}@lms.talakag`;
          await createUserWithEmailAndPassword(this.auth, email, student.lrn);
          console.log(`✅ Student added: ${student.name} (${student.lrn})`);
        } catch (authError: any) {
          if (authError.code === 'auth/email-already-in-use') {
            console.log(`⚠️ Account already exists for ${student.lrn}`);
          } else {
            console.error(`❌ Error creating account for ${student.lrn}:`, authError);
          }
        }
      }
      console.log('✅ Seeding completed!');
    } catch (error) {
      console.error('❌ Error seeding data:', error);
    }
  }
}
