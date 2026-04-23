import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { refreshOutline, shareSocialOutline } from 'ionicons/icons';

import { CampusTask, TaskService } from '../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule,
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

  userName = 'Paul';
  tasks: CampusTask[] = [];
  isLoading = true;
  errorMessage = '';
  shareMessage = '';
  isShareToastOpen = false;

  constructor() {
    addIcons({ refreshOutline, shareSocialOutline });
  }

  get completedCount(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  get pendingCount(): number {
    return this.tasks.length - this.completedCount;
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(event?: RefresherCustomEvent): void {
    this.isLoading = !event;
    this.errorMessage = '';

    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks.slice(0, 20);
        this.isLoading = false;
        event?.target.complete();
      },
      error: () => {
        this.errorMessage = 'No se han podido cargar las tareas. Intentalo de nuevo.';
        this.isLoading = false;
        event?.target.complete();
      },
    });
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
      this.showShareMessage('El navegador no permite compartir aqui. Nombre de la tarea copiado.');
    } catch {
      this.showShareMessage('No se ha podido abrir el menu de compartir.');
    }
  }

  closeShareToast(): void {
    this.isShareToastOpen = false;
  }

  private showShareMessage(message: string): void {
    this.shareMessage = message;
    this.isShareToastOpen = true;
  }
}
