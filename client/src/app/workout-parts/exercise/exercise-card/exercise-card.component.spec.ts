import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExerciseCardComponent } from './exercise-card.component';
import { ExerciseService } from '../../../services/exercise.service';
import { SetService } from '../../../services/set.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Exercise } from '../../../models/exercise.model';
import { ExerciseSet } from '../../../models/exercise-set.model';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';


describe('ExerciseCardComponent', () => {
  let component: ExerciseCardComponent;
  let fixture: ComponentFixture<ExerciseCardComponent>;
  let exerciseServiceSpy: jasmine.SpyObj<ExerciseService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockExercise: Exercise = {id: 1, name: 'Push-up'};
  const mockSets: ExerciseSet[] = [
    {id: 1, repetitions: 10, weight: 50, setNumber: 1},
    {id: 2, repetitions: 12, weight: 55, setNumber: 2}
  ];

  beforeEach(() => {
    const exerciseService = jasmine.createSpyObj('ExerciseService', ['getExerciseSets', 'updateExercise', 'deleteExercise']);
    const setService = jasmine.createSpyObj('SetService', ['addSet', 'updateSet', 'deleteSet']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    const activatedRoute = {
      snapshot: {
        params: {workoutId: '1'}
      }
    };

    router.url = '/workouts/1/exercises/1';

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {provide: ExerciseService, useValue: exerciseService},
        {provide: SetService, useValue: setService},
        {provide: Router, useValue: router},
        {provide: ActivatedRoute, useValue: activatedRoute}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseCardComponent);
    component = fixture.componentInstance;

    exerciseServiceSpy = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    component.exercise = mockExercise;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expand and load sets', () => {
    exerciseServiceSpy.getExerciseSets.and.returnValue(of(mockSets));

    component.toggleExpand();
    expect(component.isExpanded).toBeTrue();
    expect(exerciseServiceSpy.getExerciseSets).toHaveBeenCalledWith(mockExercise.id);
    expect(component.sets.length).toBe(2);

    component.toggleExpand();
    expect(component.isExpanded).toBeFalse();
  });

  it('should toggle edit mode', () => {
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();

    component.toggleEdit();
    expect(component.isEditing).toBeFalse();
  });

  it('should save the exercise', () => {
    const updatedExercise: Exercise = { ...mockExercise, name: 'Pull-up' };
    exerciseServiceSpy.updateExercise.and.returnValue(of(updatedExercise));

    component.editedExercise = { name: 'Pull-up' };
    component.saveExercise();

    expect(exerciseServiceSpy.updateExercise).toHaveBeenCalledWith(updatedExercise);
    expect(component.exercise.name).toBe('Pull-up');
    expect(component.isEditing).toBeFalse();
  });

  it('should delete the exercise', () => {
    exerciseServiceSpy.deleteExercise.and.returnValue(of(undefined));

    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteExercise();
    expect(exerciseServiceSpy.deleteExercise).toHaveBeenCalledWith(mockExercise.id);
    expect(component.deleted.emit)
  });

  it('should show and hide set form when toggled', () => {
    component.toggleSetForm();
    expect(component.showSetForm).toBeTrue();

    component.toggleSetForm();
    expect(component.showSetForm).toBeFalse();
  });

  it('should handle set added', () => {
    const newSet: ExerciseSet = { id: 3, repetitions: 15, weight: 60, setNumber: 3 };
    component.onSetAdded(newSet);
    expect(component.sets.length).toBe(1);
  });

  it('should handle set deleted', () => {
    component.onSetDeleted(1);
    expect(component.sets.length).toBe(0);
  });

  it('should handle set updated', () => {
    const updatedSet: ExerciseSet = { id: 1, repetitions: 12, weight: 55, setNumber: 1 };

    component.sets = [
      { id: 1, repetitions: 10, weight: 50, setNumber: 1 },
      { id: 2, repetitions: 12, weight: 55, setNumber: 2 }
    ];

    component.onSetUpdated(updatedSet);

    expect(component.sets[0].repetitions).toBe(12);
    expect(component.sets[0].weight).toBe(55);
  });

  it('should navigate to exercise detail', () => {
    component.navigateToExerciseDetail();
    expect(routerSpy.navigate)
  });
});
