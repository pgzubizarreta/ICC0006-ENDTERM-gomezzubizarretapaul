import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, inject } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonProgressBar,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline,
  arrowForwardOutline,
  pauseOutline,
  playOutline,
  refreshOutline,
  schoolOutline,
  trophyOutline,
} from 'ionicons/icons';

import { FirebaseScoreService } from '../services/firebase-score.service';

type GameState = 'start' | 'playing' | 'paused' | 'gameOver';
type EntityType = 'challenge' | 'obstacle';

interface GameEntity {
  id: number;
  type: EntityType;
  x: number;
  y: number;
  label: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  imports: [
    CommonModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonProgressBar,
    IonSpinner,
    IonTitle,
    IonToast,
    IonToolbar,
  ],
})
export class GamePage implements OnDestroy {
  private readonly playerStep = 8;
  private readonly playerY = 88;
  private readonly tickMs = 80;
  private readonly challengeLabels = ['Examen', 'Entrega', 'Proyecto', 'Apuntes'];
  private readonly obstacleLabels = ['Distraccion', 'Estres', 'Deadline'];
  private readonly firebaseScoreService = inject(FirebaseScoreService);
  private loopId: ReturnType<typeof setInterval> | null = null;
  private entityId = 0;
  private ticksUntilSpawn = 0;

  userName = 'Player 1';
  gameState: GameState = 'start';
  playerX = 50;
  score = 0;
  hits = 0;
  entities: GameEntity[] = [];
  isSavingScore = false;
  toastMessage = '';
  isToastOpen = false;

  constructor() {
    addIcons({
      arrowBackOutline,
      arrowForwardOutline,
      pauseOutline,
      playOutline,
      refreshOutline,
      schoolOutline,
      trophyOutline,
    });
  }

  get hitsProgress(): number {
    return this.hits / 3;
  }

  get isStart(): boolean {
    return this.gameState === 'start';
  }

  get isPlaying(): boolean {
    return this.gameState === 'playing';
  }

  get isPaused(): boolean {
    return this.gameState === 'paused';
  }

  get isGameOver(): boolean {
    return this.gameState === 'gameOver';
  }

  ngOnDestroy(): void {
    this.stopLoop();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboard(event: KeyboardEvent): void {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.movePlayer(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.movePlayer(1);
    }

    if (event.key.toLowerCase() === 'p' && this.isPlaying) {
      this.pauseGame();
    }
  }

  startGame(): void {
    this.resetGame();
    this.gameState = 'playing';
    this.startLoop();
  }

  pauseGame(): void {
    if (!this.isPlaying) {
      return;
    }

    this.gameState = 'paused';
    this.stopLoop();
  }

  resumeGame(): void {
    if (!this.isPaused) {
      return;
    }

    this.gameState = 'playing';
    this.startLoop();
  }

  restartGame(): void {
    this.startGame();
  }

  closeToast(): void {
    this.isToastOpen = false;
  }

  movePlayer(direction: -1 | 1): void {
    if (!this.isPlaying) {
      return;
    }

    const nextPosition = this.playerX + direction * this.playerStep;
    this.playerX = Math.max(8, Math.min(92, nextPosition));
  }

  private resetGame(): void {
    this.stopLoop();
    this.playerX = 50;
    this.score = 0;
    this.hits = 0;
    this.entities = [];
    this.entityId = 0;
    this.ticksUntilSpawn = 0;
  }

  private startLoop(): void {
    this.stopLoop();
    this.loopId = setInterval(() => this.tick(), this.tickMs);
  }

  private stopLoop(): void {
    if (this.loopId) {
      clearInterval(this.loopId);
      this.loopId = null;
    }
  }

  private tick(): void {
    if (!this.isPlaying) {
      return;
    }

    this.ticksUntilSpawn -= 1;

    if (this.ticksUntilSpawn <= 0) {
      this.spawnEntity();
      this.ticksUntilSpawn = 7 + Math.floor(Math.random() * 8);
    }

    this.entities = this.entities
      .map((entity) => ({ ...entity, y: entity.y + 2.7 }))
      .filter((entity) => entity.y <= 105);

    this.checkCollisions();
  }

  private spawnEntity(): void {
    const type: EntityType = Math.random() > 0.38 ? 'challenge' : 'obstacle';
    const labels = type === 'challenge' ? this.challengeLabels : this.obstacleLabels;
    const label = labels[Math.floor(Math.random() * labels.length)];

    this.entities = [
      ...this.entities,
      {
        id: this.entityId,
        type,
        x: 10 + Math.random() * 80,
        y: -5,
        label,
      },
    ];
    this.entityId += 1;
  }

  private checkCollisions(): void {
    const remainingEntities: GameEntity[] = [];

    for (const entity of this.entities) {
      const isCollision = Math.abs(entity.x - this.playerX) < 8 && Math.abs(entity.y - this.playerY) < 8;

      if (!isCollision) {
        remainingEntities.push(entity);
        continue;
      }

      if (entity.type === 'challenge') {
        this.score += 1;
      } else {
        this.hits += 1;
      }
    }

    this.entities = remainingEntities;

    if (this.hits >= 3) {
      this.finishGame();
    }
  }

  private finishGame(): void {
    this.gameState = 'gameOver';
    this.stopLoop();
    void this.saveFinalScore();
  }

  private async saveFinalScore(): Promise<void> {
    this.isSavingScore = true;

    try {
      await this.firebaseScoreService.saveScore(this.userName, this.score, this.hits);
      this.showToast('Puntuacion guardada en Firebase.');
    } catch {
      this.showToast('No se ha podido guardar la puntuacion.');
    } finally {
      this.isSavingScore = false;
    }
  }

  private showToast(message: string): void {
    this.toastMessage = message;
    this.isToastOpen = true;
  }
}
