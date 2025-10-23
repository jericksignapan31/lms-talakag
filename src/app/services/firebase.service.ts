import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    public app = initializeApp(environment.firebase);
    public auth = getAuth(this.app);
    public firestore = getFirestore(this.app);
    public storage = getStorage(this.app);
    public analytics = getAnalytics(this.app);

    constructor() {
        console.log('Firebase initialized successfully');
    }
}
