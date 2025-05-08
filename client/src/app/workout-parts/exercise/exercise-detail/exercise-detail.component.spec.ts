import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ExerciseDetailComponent} from './exercise-detail.component';
import {ExerciseService} from '../../../services/exercise.service';
import {SetService} from '../../../services/set.service';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

describe('ExerciseDetailComponent', () => {
  let component: ExerciseDetailComponent;
  let fixture: ComponentFixture<ExerciseDetailComponent>;
  let exerciseService: jasmine.SpyObj<ExerciseService>;
  let setService: jasmine.SpyObj<SetService>;

  beforeEach(() => {
    const exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', [
      'getExerciseSets',
      'addSetToExercise',
      'getExercise'
    ]);
    const setServiceSpy = jasmine.createSpyObj('SetService', ['deleteSet']);

    exerciseServiceSpy.getExercise.and.returnValue(of({
      id: 1,
      name: 'Push-up',
      description: 'A basic upper body exercise'
    }));

    exerciseServiceSpy.getExerciseSets.and.returnValue(of([
      {id: 1, repetitions: 10, weight: 100, setNumber: 1, createdAt: new Date()},
      {id: 2, repetitions: 8, weight: 110, setNumber: 2, createdAt: new Date()}
    ]));

    TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      providers: [
        {provide: ExerciseService, useValue: exerciseServiceSpy},
        {provide: SetService, useValue: setServiceSpy},
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => key === 'id' ? '1' : key === 'workoutId' ? '0' : null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseDetailComponent);
    component = fixture.componentInstance;
    exerciseService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
    setService = TestBed.inject(SetService) as jasmine.SpyObj<SetService>;

    fixture.detectChanges();
  });

  it('should load exercise details and sets on init', () => {
    const mockSets = [
      {id: 1, repetitions: 10, weight: 100, setNumber: 1, createdAt: new Date()},
      {id: 2, repetitions: 8, weight: 110, setNumber: 2, createdAt: new Date()}
    ];

    exerciseService.getExerciseSets.and.returnValue(of(mockSets));

    fixture.detectChanges();

    expect(component.exerciseId).toBe(1);
    expect(component.workoutId).toBe(0);
    expect(component.allSets.length).toBe(2);
    expect(component.setsByDate.length).toBeGreaterThan(0);
  });

  it('should group sets by date', () => {
    const mockSets = [
      {id: 1, repetitions: 10, weight: 100, setNumber: 1, createdAt: new Date('2024-04-01T18:00:00')},
      {id: 2, repetitions: 8, weight: 110, setNumber: 2, createdAt: new Date('2024-04-01T18:00:00')},
      {id: 3, repetitions: 6, weight: 120, setNumber: 3, createdAt: new Date('2024-05-01T18:00:00')},
    ];

    component.allSets = mockSets as any;
    component.groupSetsByDate();

    expect(component.setsByDate.length).toBe(2);
    expect(component.setsByDate[0].date).toBe('2024-05-01');
    expect(component.setsByDate[1].date).toBe('2024-04-01');
  });

  it('should add a new set', () => {
    const newSet = {repetitions: 10, weight: 100, setNumber: 4};
    const mockSet = {...newSet, id: 4, createdAt: new Date()};

    exerciseService.addSetToExercise.and.returnValue(of(mockSet));

    component.newSet = newSet;
    component.addSet();

    expect(exerciseService.addSetToExercise).toHaveBeenCalledWith(component.exerciseId, component.newSet);
    expect(component.allSets.length).toBe(3);
    expect(component.setsByDate.length).toBeGreaterThan(0);
  });

  it('should delete a set', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    const setId = 1;
    const mockSets = [
      {id: 1, repetitions: 10, weight: 100, setNumber: 1, createdAt: new Date()},
      {id: 2, repetitions: 8, weight: 110, setNumber: 2, createdAt: new Date()}
    ];

    component.allSets = mockSets;

    setService.deleteSet.and.returnValue(of(undefined));

    component.deleteSet(setId);

    expect(setService.deleteSet).toHaveBeenCalledWith(setId);
    expect(component.allSets.length).toBe(1);
    expect(component.allSets[0].id).toBe(2);
  });

  it('should toggle date expanded state', () => {
    const freshDate = '2030-01-01';

    expect(component.isDateExpanded(freshDate)).toBeFalse();

    component.toggleDateExpanded(freshDate);
    expect(component.isDateExpanded(freshDate)).toBeTrue();

    component.toggleDateExpanded(freshDate);
    expect(component.isDateExpanded(freshDate)).toBeFalse();
  });

  it('should show and hide the add set form', () => {
    component.showAddSetForm();
    expect(component.showSetForm).toBeTrue();

    component.hideAddSetForm();
    expect(component.showSetForm).toBeFalse();
  });

  it('should calculate total repetitions correctly', () => {
    const mockSets = [
      {id: 1, repetitions: 10, weight: 100, setNumber: 1, createdAt: new Date()},
      {id: 2, repetitions: 8, weight: 110, setNumber: 2, createdAt: new Date()}
    ];

    component.allSets = mockSets;
    const totalReps = component.getTotalReps(mockSets);

    expect(totalReps).toBe(18);
  });

  it('should calculate average weight per rep correctly', () => {
    const mockSets = [
      {id: 1, repetitions: 10, weight: 100, setNumber: 1, createdAt: new Date()},
      {id: 2, repetitions: 8, weight: 110, setNumber: 2, createdAt: new Date()}
    ];

    component.allSets = mockSets;
    const avgWeightPerRep = component.getAvgWeightPerRep(mockSets);

    expect(avgWeightPerRep).toBe(104);
  });

  it('should return the correct current day', () => {
    const currentDay = component.getCurrentDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    expect(days).toContain(currentDay);
  });
});
