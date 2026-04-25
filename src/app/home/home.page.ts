import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { Share } from '@capacitor/share';
import { addIcons } from 'ionicons';
import {
  gameControllerOutline,
  refreshOutline,
  saveOutline,
  shareSocialOutline,
  trophyOutline,
} from 'ionicons/icons';

import { FirebaseScoreService, GameScore } from '../services/firebase-score.service';
import { FirebaseTaskStoreService } from '../services/firebase-task-store.service';
import { CampusTask, TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonRefresher,
    IonRefresherContent,
    IonSpinner,
    IonTitle,
    IonToast,
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly firebaseTaskStore = inject(FirebaseTaskStoreService);
  private readonly firebaseScoreService = inject(FirebaseScoreService);

  userName = 'Paul';
  tasks: CampusTask[] = [];
  topScores: GameScore[] = [];
  isLoading = true;
  isRankingLoading = true;
  errorMessage = '';
  toastMessage = '';
  isToastOpen = false;
  savingTaskId: number | null = null;

  constructor() {
    addIcons({ gameControllerOutline, refreshOutline, saveOutline, shareSocialOutline, trophyOutline });
  }

  get completedCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  get pendingCount(): number {
    return this.tasks.length - this.completedCount;
  }

  ngOnInit(): void {
    this.loadTasks();
    void this.loadTopScores();
  }

  loadTasks(event?: RefresherCustomEvent): void {
    this.isLoading = !event;
    this.errorMessage = '';

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.slice(0, 20);
        this.isLoading = false;
        event?.target.complete();
        void this.loadTopScores();
      },
      error: () => {
        this.errorMessage = 'No se han podido cargar las tareas. Intentalo de nuevo.';
        this.isLoading = false;
        event?.target.complete();
      },
    });
  }

  async loadTopScores(): Promise<void> {
    this.isRankingLoading = true;

    try {
      this.topScores = await this.firebaseScoreService.getTopScores();
    } finally {
      this.isRankingLoading = false;
    }
  }

  trackByTaskId(_index: number, task: CampusTask): number {
    return task.id;
  }

  async shareTask(task: CampusTask): Promise<void> {
    const text = `Tarea seleccionada: ${task.title}`;

    try {
      const canShare = await Share.canShare();

      if (canShare.value) {
        await Share.share({
          title: 'Campus Quest',
          text,
          dialogTitle: 'Compartir tarea',
        });
        return;
      }

      await navigator.clipboard.writeText(task.title);
      this.showToastMessage('El navegador no permite compartir aqui. Nombre de la tarea copiado.');
    } catch {
      this.showToastMessage('No se ha podido abrir el menu de compartir.');
    }
  }

  async saveTask(task: CampusTask): Promise<void> {
    this.savingTaskId = task.id;

    try {
      await this.firebaseTaskStore.saveTask(task, this.userName);
      this.showToastMessage('Tarea guardada en Firebase.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se ha podido guardar la tarea.';
      this.showToastMessage(message);
    } finally {
      this.savingTaskId = null;
    }
  }

  closeToast(): void {
    this.isToastOpen = false;
  }

  private showToastMessage(message: string): void {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}
