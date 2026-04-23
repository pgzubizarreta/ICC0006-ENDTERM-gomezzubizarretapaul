import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface CampusTask {
  id: number;
  title: string;
  completed: boolean;
}

interface JsonPlaceholderTodo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/todos';

  getTasks(): Observable<CampusTask[]> {
    return this.http.get<JsonPlaceholderTodo[]>(this.apiUrl).pipe(
      map((tasks) =>
        tasks.map((task) => ({
          id: task.id,
          title: task.title,
          completed: task.completed,
        })),
      ),
    );
  }
}
