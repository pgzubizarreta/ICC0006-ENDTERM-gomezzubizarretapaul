import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { playOutline, schoolOutline, trophyOutline } from 'ionicons/icons';

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
    IonTitle,
    IonToolbar,
  ],
})
export class GamePage {
  userName = 'Paul';
  isGameStarted = false;

  constructor() {
    addIcons({ playOutline, schoolOutline, trophyOutline });
  }

  startGame(): void {
    this.isGameStarted = true;
  }
}
