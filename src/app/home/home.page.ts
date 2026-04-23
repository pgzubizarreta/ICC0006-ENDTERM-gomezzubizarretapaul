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
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';

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
    IonToolbar,
  ],
})
export class HomePage implements OnInit {
  private readonly taskService = inject(TaskService);

  userName = 'Paul';
  tasks: CampusTask[] = [];
  isLoading = true;
  errorMessage = '';

  constructor() {
    addIcons({ refreshOutline });
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
}
