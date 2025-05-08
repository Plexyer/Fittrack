import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Workout } from '../models/workout.model';
import { Exercise } from '../models/exercise.model';

@Injectable({
  providedIn: 'root'
})
export class WorkoutService {
  private apiUrl = 'http://localhost/api/workouts';

  constructor(private http: HttpClient) { }

  getAllWorkouts(): Observable<Workout[]> {
    return this.http.get<Workout[]>(this.apiUrl);
  }

  getWorkout(id: number | undefined): Observable<Workout> {
    return this.http.get<Workout>(`${this.apiUrl}/${id}`);
  }

  createWorkout(workout: Workout): Observable<Workout> {
    return this.http.post<Workout>(this.apiUrl, workout);
  }

  updateWorkout(workout: Workout): Observable<Workout> {
    return this.http.put<Workout>(`${this.apiUrl}/${workout.id}`, workout);
  }

  deleteWorkout(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getWorkoutExercises(workoutId: number | undefined): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/${workoutId}/exercises`);
  }

  addExerciseToWorkout(workoutId: number, exercise: Exercise): Observable<Exercise> {
    return this.http.post<Exercise>(`${this.apiUrl}/${workoutId}/exercises`, exercise);
  }

  updateLastPerformed(workoutId: number | undefined): Observable<Workout> {
    return this.http.patch<Workout>(`${this.apiUrl}/${workoutId}`, { });
  }
}
