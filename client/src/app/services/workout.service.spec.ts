import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WorkoutService } from './workout.service';
import { Workout } from '../models/workout.model';
import { Exercise } from '../models/exercise.model';

describe('WorkoutService', () => {
  let service: WorkoutService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost/api/workouts';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkoutService],
    });

    service = TestBed.inject(WorkoutService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get all workouts', () => {
    const mockWorkouts: Workout[] = [
      { id: 1, name: 'Workout 1', date: new Date() },
      { id: 2, name: 'Workout 2', date: new Date() },
    ];

    service.getAllWorkouts().subscribe((data) => {
      expect(data).toEqual(mockWorkouts);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockWorkouts);
  });

  it('should get a workout by id', () => {
    const mockWorkout: Workout = { id: 1, name: 'Workout 1', date: new Date() };

    service.getWorkout(1).subscribe((data) => {
      expect(data).toEqual(mockWorkout);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockWorkout);
  });

  it('should create a workout', () => {
    const newWorkout: Workout = { id: 1, name: 'Workout 1', date: new Date() };

    service.createWorkout(newWorkout).subscribe((response) => {
      expect(response).toEqual(newWorkout);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(newWorkout);
  });

  it('should update a workout', () => {
    const updatedWorkout: Workout = { id: 1, name: 'Updated Workout', date: new Date() };

    service.updateWorkout(updatedWorkout).subscribe((response) => {
      expect(response).toEqual(updatedWorkout);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedWorkout);
  });

  it('should delete a workout', () => {
    const workoutId = 1;

    service.deleteWorkout(workoutId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should get exercises for a workout', () => {
    const workoutId = 1;
    const mockExercises: Exercise[] = [
      { id: 1, name: 'Exercise 1', sets: [] },
      { id: 2, name: 'Exercise 2', sets: [] },
    ];

    service.getWorkoutExercises(workoutId).subscribe((data) => {
      expect(data).toEqual(mockExercises);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/exercises`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExercises);
  });

  it('should add an exercise to a workout', () => {
    const workoutId = 1;
    const newExercise: Exercise = { id: 1, name: 'Bench Press', sets: [] };

    service.addExerciseToWorkout(workoutId, newExercise).subscribe((response) => {
      expect(response).toEqual(newExercise);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/exercises`);
    expect(req.request.method).toBe('POST');
    req.flush(newExercise);
  });

  it('should update the last performed workout', () => {
    const workoutId = 1;
    const mockWorkout: Workout = { id: 1, name: 'Updated Workout', date: new Date() };

    service.updateLastPerformed(workoutId).subscribe((response) => {
      expect(response).toEqual(mockWorkout);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PATCH');
    req.flush(mockWorkout);
  });
});
