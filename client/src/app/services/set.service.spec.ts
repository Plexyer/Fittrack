import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SetService } from './set.service';
import { ExerciseSet } from '../models/exercise-set.model';

describe('SetService', () => {
  let service: SetService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost/api/sets';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SetService],
    });

    service = TestBed.inject(SetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should get an exercise set by id', () => {
    const mockExerciseSet: ExerciseSet = { id: 1, repetitions: 10, weight: 50, setNumber: 1 };
    const exerciseSetId = 1;

    service.getSet(exerciseSetId).subscribe((data) => {
      expect(data).toEqual(mockExerciseSet);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockExerciseSet);
  });


  it('should update an exercise set', () => {
    const updatedExerciseSet: ExerciseSet = { id: 1, repetitions: 12, weight: 60, setNumber: 1 };

    service.updateSet(updatedExerciseSet).subscribe((response) => {
      expect(response).toEqual(updatedExerciseSet);
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedExerciseSet);
  });

  it('should handle error when updating an exercise set', () => {
    const updatedExerciseSet: ExerciseSet = { id: 1, repetitions: 12, weight: 60, setNumber: 1 };

    service.updateSet(updatedExerciseSet).subscribe(
      () => {},
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
  });

  it('should delete an exercise set', () => {
    const exerciseSetId = 1;

    service.deleteSet(exerciseSetId).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });

  it('should handle error when deleting an exercise set', () => {
    const exerciseSetId = 1;

    service.deleteSet(exerciseSetId).subscribe(
      () => {},
      (error) => {
        expect(error.status).toBe(500);
      }
    );

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush('Error occurred', { status: 500, statusText: 'Server Error' });
  });
});
