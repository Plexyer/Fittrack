import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutDetailComponent } from './workout-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkoutService } from '../../../services/workout.service';
import { of } from 'rxjs';
import { Workout } from '../../../models/workout.model';
import { Exercise } from '../../../models/exercise.model';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('WorkoutDetailComponent', () => {
  let component: WorkoutDetailComponent;
  let fixture: ComponentFixture<WorkoutDetailComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;
  let router: jasmine.SpyObj<Router>;

  const mockWorkout: Workout = {
    id: 1,
    name: 'Push Day',
    date: new Date(Date.now()),
    notes: 'Chest & Triceps'
  };

  const mockExercises: Exercise[] = [
    { id: 1, name: 'Bench Press', workoutId: 1, notes: '' },
    { id: 2, name: 'Dips', workoutId: 1, notes: '' }
  ];

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', [
      'getWorkout',
      'getWorkoutExercises',
      'deleteWorkout',
      'updateLastPerformed'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        WorkoutDetailComponent,
        HttpClientTestingModule
      ],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutDetailComponent);
    component = fixture.componentInstance;
    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load workout and exercises on init', () => {
    workoutService.getWorkout.and.returnValue(of(mockWorkout));
    workoutService.getWorkoutExercises.and.returnValue(of(mockExercises));

    fixture.detectChanges();

    expect(component.workout).toEqual(mockWorkout);
    expect(component.exercises.length).toBe(2);
    expect(workoutService.getWorkout).toHaveBeenCalledWith(1);
    expect(workoutService.getWorkoutExercises).toHaveBeenCalledWith(1);
  });

  it('should toggle the exercise form', () => {
    expect(component.showExerciseForm).toBeFalse();
    component.toggleExerciseForm();
    expect(component.showExerciseForm).toBeTrue();
  });

  it('should add an exercise', () => {
    component.workout = mockWorkout;
    const newExercise: Exercise = { id: 3, name: 'Flyes', workoutId: 1, notes: '' };
    component.onExerciseAdded(newExercise);
    expect(component.exercises).toContain(newExercise);
    expect(component.showExerciseForm).toBeFalse();
  });

  it('should delete an exercise', () => {
    component.exercises = [...mockExercises];
    component.onExerciseDeleted(1);
    expect(component.exercises.length).toBe(1);
    expect(component.exercises[0].id).toBe(2);
  });

  it('should delete workout and navigate back', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.workout = mockWorkout;
    workoutService.deleteWorkout.and.returnValue(of(undefined));

    component.deleteWorkout();

    expect(workoutService.deleteWorkout).toHaveBeenCalledWith(1);
    expect(router.navigate).toHaveBeenCalledWith(['/workouts']);
  });

  it('should update workout date and reload workout', () => {
    component.workout = mockWorkout;
    workoutService.updateLastPerformed.and.returnValue(of(mockWorkout));
    workoutService.getWorkout.and.returnValue(of(mockWorkout));
    workoutService.getWorkoutExercises.and.returnValue(of(mockExercises));

    component.updateWorkoutDate();

    expect(workoutService.updateLastPerformed).toHaveBeenCalledWith(1);
    expect(workoutService.getWorkout).toHaveBeenCalledWith(1);
    expect(workoutService.getWorkoutExercises).toHaveBeenCalledWith(1);
  });

  it('should return "Never trained" if no date is provided', () => {
    const result = component.getDaysSinceLastTraining(undefined);
    expect(result).toBe('Never trained');
  });

  it('should return valid datetime string for valid date', () => {
    const result = component.getDaysSinceLastTraining(new Date());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle error on invalid date string', () => {
    spyOn(console, 'error');

    const result = component.getDaysSinceLastTraining('invalid-date' as any);

    expect(console.error).toHaveBeenCalled();
    expect(result).toBe('Unknown');
  });
});
