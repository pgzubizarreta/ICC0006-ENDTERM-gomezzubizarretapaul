import { Injectable } from '@angular/core';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { addDoc, collection, Firestore, getFirestore, serverTimestamp } from 'firebase/firestore';

import { environment } from '../../environments/environment';
import { CampusTask } from './task.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseTaskStoreService {
  private readonly collectionName = 'savedTasks';
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

  async saveTask(task: CampusTask, userName: string): Promise<void> {
    if (!this.isConfigured) {
      throw new Error('Configura Firebase antes de guardar tareas.');
    }

    await addDoc(collection(this.getDatabase(), this.collectionName), {
      taskId: task.id,
      title: task.title,
      completed: task.completed,
      userName,
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
