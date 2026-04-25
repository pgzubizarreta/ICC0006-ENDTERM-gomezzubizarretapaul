import { Injectable } from '@angular/core';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';

import { environment } from '../../environments/environment';

export interface GameScore {
  userName: string;
  score: number;
  hits: number;
}

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

  async getTopScores(maxResults = 5): Promise<GameScore[]> {
    if (!this.isConfigured) {
      return [];
    }

    const scoresQuery = query(
      collection(this.getDatabase(), this.collectionName),
      orderBy('score', 'desc'),
      limit(maxResults),
    );
    const snapshot = await getDocs(scoresQuery);

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        userName: String(data['userName'] ?? 'Alumno'),
        score: Number(data['score'] ?? 0),
        hits: Number(data['hits'] ?? 0),
      };
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
