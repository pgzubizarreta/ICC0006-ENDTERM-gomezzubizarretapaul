import { Injectable } from '@angular/core';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { addDoc, collection, Firestore, getFirestore, serverTimestamp } from 'firebase/firestore';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirebaseScoreService {
  private readonly collectionName = 'gameScores';
  private app?: FirebaseApp;
  private database?: Firestore;

  get isConfigured(): boolean {
    const config = environment.firebase;

    return Boolean(
      config.apiKey &&
        config.authDomain &&
        config.projectId &&
        config.storageBucket &&
        config.messagingSenderId &&
        config.appId,
    );
  }

  async saveScore(userName: string, score: number, hits: number): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Configura Firebase antes de guardar puntuaciones.');
    }

    await addDoc(collection(this.getDatabase(), this.collectionName), {
      userName,
      score,
      hits,
      savedAt: serverTimestamp(),
    });
  }

  private getDatabase(): Firestore {
    if (!this.database) {
      const existingApp = getApps()[0];
      this.app = existingApp ?? initializeApp(environment.firebase);
      this.database = getFirestore(this.app);
    }

    return this.database;
  }
}
