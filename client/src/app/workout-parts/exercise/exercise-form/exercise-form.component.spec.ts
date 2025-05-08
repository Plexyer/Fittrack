import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseFormComponent } from './exercise-form.component';
import { WorkoutService } from '../../../services/workout.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Exercise } from '../../../models/exercise.model';

describe('ExerciseFormComponent', () => {
  let component: ExerciseFormComponent;
  let fixture: ComponentFixture<ExerciseFormComponent>;
  let workoutService: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    const workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['addExerciseToWorkout']);

    await TestBed.configureTestingModule({
      imports: [ExerciseFormComponent, FormsModule],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy }
      ]
    }).compileComponents();

    workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;

    fixture = TestBed.createComponent(ExerciseFormComponent);
    component = fixture.componentInstance;
    component.workoutId = 123;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call WorkoutService and emit event on successful submit', () => {
    const mockExercise: Exercise = {
      id: 1,
      name: 'Push Up',
      notes: 'Upper body',
      workoutId: 123
    };

    component.exercise = {
      name: 'Push Up',
      notes: 'Upper body'
    };

    workoutService.addExerciseToWorkout.and.returnValue(of(mockExercise));

    spyOn(component.exerciseAdded, 'emit');

    component.onSubmit();

    expect(workoutService.addExerciseToWorkout).toHaveBeenCalledWith(123, jasmine.any(Object));
    expect(component.exerciseAdded.emit).toHaveBeenCalledWith(mockExercise);
    expect(component.isSubmitting).toBeFalse();
    expect(component.exercise.name).toBe('');
    expect(component.exercise.notes).toBe('');
  });

  it('should handle errors during submit gracefully', () => {
    component.exercise = {
      name: 'Sit Up',
      notes: 'Core work'
    };

    workoutService.addExerciseToWorkout.and.returnValue(throwError(() => new Error('Submit failed')));

    spyOn(console, 'error');

    component.onSubmit();

    expect(workoutService.addExerciseToWorkout).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error adding exercise:', jasmine.any(Error));
    expect(component.isSubmitting).toBeFalse();
  });

  it('should reset the form', () => {
    component.exercise = {
      name: 'Test',
      notes: 'Something'
    };

    component.resetForm();

    expect(component.exercise.name).toBe('');
    expect(component.exercise.notes).toBe('');
  });
});
