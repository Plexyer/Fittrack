import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ExerciseService} from './exercise.service';
import {Exercise} from '../models/exercise.model';
import {ExerciseSet} from '../models/exercise-set.model';

describe('ExerciseService', () => {
  let service: ExerciseService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost/api/exercises';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ExerciseService],
    });

    service = TestBed.inject(ExerciseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update an exercise', () => {
    const updatedExercise: Exercise = {id: 1, name: 'Push-up'};

    service.updateExercise(updatedExercise).subscribe(response => {
      expect(response).toEqual(updatedExercise);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedExercise);
  });

  it('should delete an exercise', () => {
    const exerciseId = 1;

    service.deleteExercise(exerciseId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should fetch exercise sets for a specific exercise', () => {
    const exerciseId = 1;
    const mockExerciseSets: ExerciseSet[] = [
      {id: 1, repetitions: 10, weight: 50, setNumber: 1},
      {id: 2, repetitions: 12, weight: 60, setNumber: 2},
    ];

    service.getExerciseSets(exerciseId).subscribe(sets => {
      expect(sets).toEqual(mockExerciseSets);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/sets`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExerciseSets);
  });

  it('should add a new set to an exercise', () => {
    const exerciseId = 1;
    const newSet: ExerciseSet = {id: 3, repetitions: 15, weight: 70, setNumber: 3};

    service.addSetToExercise(exerciseId, newSet).subscribe(set => {
      expect(set).toEqual(newSet);
    });

    const req = httpMock.expectOne(`${apiUrl}/1/sets`);
    expect(req.request.method).toBe('POST');
    req.flush(newSet);
  });

  it('should handle error when updating exercise', () => {
    const updatedExercise: Exercise = {id: 1, name: 'Push-up'};

    service.updateExercise(updatedExercise).subscribe(
      () => {
      },
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error occurred', {status: 500, statusText: 'Server Error'});
  });

  it('should handle error when deleting exercise', () => {
    const exerciseId = 1;

    service.deleteExercise(exerciseId).subscribe(
      () => {
      },
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Error occurred', {status: 500, statusText: 'Server Error'});
  });
});
