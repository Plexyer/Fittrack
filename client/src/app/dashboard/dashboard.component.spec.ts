import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DashboardComponent} from './dashboard.component';
import {WorkoutService} from '../services/workout.service';
import {ChartService} from '../services/chat.service';
import {of, throwError} from 'rxjs';
import {Workout} from '../models/workout.model';
import {RouterTestingModule} from '@angular/router/testing';
import {CommonModule} from '@angular/common';
import {WorkoutCardComponent} from '../workout-parts/workout/workout-card/workout-card.component';
import {ProgressChartComponent} from '../progress-chart/progress-chart.component';
import {ExerciseService} from '../services/exercise.service';
import { HttpClientModule } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let workoutServiceSpy: jasmine.SpyObj<WorkoutService>;
  let exerciseServiceSpy: jasmine.SpyObj<ExerciseService>;
  let chartServiceSpy: jasmine.SpyObj<ChartService>;

  const mockWorkouts: Workout[] = [
    {
      id: 1,
      name: 'Workout A',
      date: new Date(),
      lastWorkoutAt: new Date(),
      exercises: [
        { name: 'Push-up', sets: [{ repetitions: 15, weight: 0, setNumber: 1 }, { repetitions: 15, weight: 0, setNumber: 2 }] },
        { name: 'Squat', sets: [{ repetitions: 12, weight: 150, setNumber: 1 }, { repetitions: 12, weight: 150, setNumber: 2 }] }
      ]
    },
    {
      id: 2,
      name: 'Workout B',
      date: new Date(Date.now() - 86400000),
      lastWorkoutAt: new Date(Date.now() - 86400000),
      exercises: [
        { name: 'Bench Press', sets: [{ repetitions: 8, weight: 80, setNumber: 1 }, { repetitions: 8, weight: 80, setNumber: 2 }] },
        { name: 'Shoulder Press', sets: [{ repetitions: 8, weight: 20, setNumber: 1 }, { repetitions: 8, weight: 20, setNumber: 2 }] }
      ]
    }
  ];

  beforeEach(async () => {
    workoutServiceSpy = jasmine.createSpyObj('WorkoutService', ['getAllWorkouts', 'getWorkoutExercises']);
    exerciseServiceSpy = jasmine.createSpyObj('ExerciseService', ['getExerciseSets']);
    chartServiceSpy = jasmine.createSpyObj('ChartService', ['getChartData']);

    workoutServiceSpy.getWorkoutExercises.and.returnValue(of([
      { name: 'Push-up', sets: [{ repetitions: 15, weight: 0, setNumber: 1 }] },
      { name: 'Squat', sets: [{ repetitions: 12, weight: 150, setNumber: 1 }] }
    ]));

    workoutServiceSpy.getAllWorkouts.and.returnValue(of(mockWorkouts));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterTestingModule,
        WorkoutCardComponent,
        ProgressChartComponent,
        HttpClientModule
      ],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceSpy },
        { provide: ExerciseService, useValue: exerciseServiceSpy },
        { provide: ChartService, useValue: chartServiceSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create the DashboardComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should load recent workouts and calculate stats on successful load', () => {
    workoutServiceSpy.getAllWorkouts.and.returnValue(of(mockWorkouts));

    component.loadDashboardData();

    expect(component.recentWorkouts.length).toBe(2);
    expect(component.workoutStats.totalWorkouts).toBe(2);
  });

  it('should set error on failed load of workouts', () => {
    workoutServiceSpy.getAllWorkouts.and.returnValue(throwError(() => new Error('Network error')));

    component.loadDashboardData();

    expect(component.isLoading).toBeFalse();
  });

  it('should calculate average workouts per week correctly', () => {
    workoutServiceSpy.getAllWorkouts.and.returnValue(of(mockWorkouts));

    component.loadDashboardData();

    expect(component.workoutStats.averageWorkoutsPerWeek).toBe(2);
  });

  it('should handle empty workout list correctly in stats calculation', () => {
    workoutServiceSpy.getAllWorkouts.and.returnValue(of([]));

    component.loadDashboardData();

    expect(component.workoutStats.totalWorkouts).toBe(0);
    expect(component.workoutStats.averageWorkoutsPerWeek).toBe(0);
  });
});
