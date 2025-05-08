import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exercise } from '../models/exercise.model';
import { ExerciseSet } from '../models/exercise-set.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private apiUrl = 'http://localhost/api/exercises';

  constructor(private http: HttpClient) { }

  getExercise(id: number | undefined): Observable<Exercise> {
    return this.http.get<Exercise>(`${this.apiUrl}/${id}`);
  }

  updateExercise(exercise: Exercise): Observable<Exercise> {
    return this.http.put<Exercise>(`${this.apiUrl}/${exercise.id}`, exercise);
  }

  deleteExercise(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getExerciseSets(exerciseId: number | undefined): Observable<ExerciseSet[]> {
    return this.http.get<ExerciseSet[]>(`${this.apiUrl}/${exerciseId}/sets`);
  }

  addSetToExercise(exerciseId: number | undefined, set: ExerciseSet | undefined): Observable<ExerciseSet> {
    return this.http.post<ExerciseSet>(`${this.apiUrl}/${exerciseId}/sets`, set);
  }
}
