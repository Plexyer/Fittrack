import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetFormComponent } from './set-form.component';
import { ExerciseService } from '../../../services/exercise.service';
import { of, throwError } from 'rxjs';
import { ExerciseSet } from '../../../models/exercise-set.model';
import { FormsModule } from '@angular/forms';

describe('SetFormComponent', () => {
  let component: SetFormComponent;
  let fixture: ComponentFixture<SetFormComponent>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;

  beforeEach(async () => {
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', ['addSetToExercise']);

    await TestBed.configureTestingModule({
      imports: [SetFormComponent, FormsModule],
      providers: [{ provide: ExerciseService, useValue: exerciseServiceSpy }]
    }).compileComponents();

    exerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    fixture = TestBed.createComponent(SetFormComponent);
    component = fixture.componentInstance;
    component.exerciseId = 10;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call ExerciseService and emit event on successful submit', () => {
    const mockSet: ExerciseSet = {
      id: 1,
      exerciseId: 10,
      repetitions: 12,
      weight: 100,
      setNumber: 1,
      notes: 'Test'
    };

    component.setData = {
      repetitions: 12,
      weight: 100,
      notes: 'Test'
    };

    exerciseService.addSetToExercise.and.returnValue(of(mockSet));
    spyOn(component.setAdded, 'emit');

    component.onSubmit();

    expect(component.isSubmitting).toBeFalse();
    expect(exerciseService.addSetToExercise).toHaveBeenCalledWith(10, jasmine.any(Object));
    expect(component.setAdded.emit).toHaveBeenCalledWith(mockSet);
    expect(component.setData.repetitions).toBe(0);
    expect(component.setData.weight).toBe(0);
    expect(component.setData.notes).toBe('');
  });

  it('should handle errors during submit', () => {
    component.setData = { repetitions: 8, weight: 80 };

    exerciseService.addSetToExercise.and.returnValue(throwError(() => new Error('Failed to add')));
    component.onSubmit();

    expect(component.isSubmitting).toBeFalse();
  });

  it('should reset the form', () => {
    component.setData = { repetitions: 10, weight: 90, notes: 'Notes' };
    component.resetForm();

    expect(component.setData.repetitions).toBe(0);
    expect(component.setData.weight).toBe(0);
    expect(component.setData.notes).toBe('');
  });
});
