import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetDetailComponent } from './set-detail.component';
import { SetService } from '../../../services/set.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import {ExerciseSet} from '../../../models/exercise-set.model';

describe('SetDetailComponent', () => {
  let component: SetDetailComponent;
  let fixture: ComponentFixture<SetDetailComponent>;
  let setService: jasmine.SpyObj<SetService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const setServiceSpy = jasmine.createSpyObj('SetService', ['getSet', 'updateSet', 'deleteSet']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SetDetailComponent],
      providers: [
        { provide: SetService, useValue: setServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => {
                  if (key === 'setId') return '1';
                  if (key === 'exerciseId') return '10';
                  if (key === 'workoutId') return '5';
                  return null;
                }
              },
              queryParamMap: {
                get: (key: string) => (key === 'exerciseName' ? 'Barbell Row' : '')
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SetDetailComponent);
    component = fixture.componentInstance;
    setService = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load set details on init', () => {
    const mockSet = {
      id: 1,
      exerciseId: 10,
      repetitions: 12,
      weight: 100,
      setNumber: 1,
      notes: 'Test',
      createdAt: new Date('2024-05-01T18:30:00Z')
    };

    setService.getSet.and.returnValue(of(mockSet));
    fixture.detectChanges();

    expect(component.set.id).toBe(1);
    expect(component.exerciseId).toBe(10);
    expect(component.workoutId).toBe(5);
    expect(component.exerciseName).toBe('Barbell Row');
    expect(component.displayDate).toBe('1 May 2024');
    expect(component.displayTime).toBe('20:30');
    expect(component.exactTime).toBe('20:30:00');
  });

  it('should handle error loading set details and navigate back', () => {
    setService.getSet.and.returnValue(throwError(() => new Error('Not found')));
    fixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/workouts', 5, 'exercises', 10]);
  });

  it('should save the set and navigate back', () => {
    const updatedSet: ExerciseSet = {
      id: 1,
      exerciseId: 10,
      repetitions: 10,
      weight: 100,
      setNumber: 1,
      notes: 'Updated'
    };

    component.set = updatedSet;

    component.exerciseId = 10;
    component.workoutId = 5;

    setService.updateSet.and.returnValue(of(updatedSet));
    component.saveSet();

    expect(setService.updateSet).toHaveBeenCalledWith(updatedSet);
    expect(router.navigate).toHaveBeenCalledWith(['/workouts', 5, 'exercises', 10]);
    expect(component.isSubmitting).toBeFalse();
  });

  it('should handle error on save and not navigate', () => {
    component.set = {
      id: 1,
      exerciseId: 10,
      repetitions: 10,
      weight: 100,
      setNumber: 1,
      notes: 'Fail test'
    };

    spyOn(console, 'error');
    setService.updateSet.and.returnValue(throwError(() => new Error('Update failed')));
    component.saveSet();

    expect(console.error).toHaveBeenCalled();
    expect(component.isSubmitting).toBeFalse();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should delete the set and navigate back', () => {
    component.set.id = 1;

    component.workoutId = 5;
    component.exerciseId = 10;

    setService.deleteSet.and.returnValue(of(undefined));
    component.deleteSet();

    expect(setService.deleteSet).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/workouts', 5, 'exercises', 10]);
  });

  it('should format date correctly', () => {
    const date = new Date('2024-05-01T00:00:00Z');
    expect(component.formatDate(date)).toBe('1 May 2024');
  });

  it('should format time correctly', () => {
    const date = new Date('2024-05-01T18:25:00Z');
    expect(component.formatTime(date)).toBe('20:25');
  });

  it('should format exact time correctly', () => {
    const date = new Date('2024-05-01T18:25:42Z');
    expect(component.formatExactTime(date)).toBe('20:25:42');
  });
});
