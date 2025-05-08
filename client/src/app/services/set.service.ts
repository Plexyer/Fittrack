import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ExerciseSet } from '../models/exercise-set.model';

@Injectable({
  providedIn: 'root'
})
export class SetService {
  private apiUrl = 'http://localhost/api/sets';

  constructor(private http: HttpClient) { }

  getSet(id: number): Observable<ExerciseSet> {
    return this.http.get<ExerciseSet>(`${this.apiUrl}/${id}`);
  };

  updateSet(set: ExerciseSet): Observable<ExerciseSet> {
    return this.http.put<ExerciseSet>(`${this.apiUrl}/${set.id}`, set);
  }

  deleteSet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
