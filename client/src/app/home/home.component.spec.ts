import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { WorkoutService } from '../services/workout.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Workout } from '../models/workout.model';
import {ActivatedRoute} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let workoutServiceSpy: jasmine.SpyObj<WorkoutService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const workoutSpy = jasmine.createSpyObj('WorkoutService', ['getAllWorkouts']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule
      ],
      providers: [
        { provide: WorkoutService, useValue: workoutSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    workoutServiceSpy = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spyOn(routerSpy, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadRecentWorkouts on ngOnInit', () => {
    const loadSpy = spyOn(component, 'loadRecentWorkouts');
    component.ngOnInit();
    expect(loadSpy).toHaveBeenCalled();
  });

  it('should set recentWorkouts and upcomingWorkoutSuggestion on successful load', () => {
    const mockWorkouts: Workout[] = [
      { id: 1, name: 'Workout A', date: new Date(), lastWorkoutAt: new Date() },
      { id: 2, name: 'Workout B', date: new Date(Date.now() - 86400000), lastWorkoutAt: new Date(Date.now() - 86400000) }
    ];

    workoutServiceSpy.getAllWorkouts.and.returnValue(of(mockWorkouts));

    component.loadRecentWorkouts();

    expect(component.recentWorkouts.length).toBeGreaterThan(0);
    expect(component.upcomingWorkoutSuggestion).toBeTruthy();
    expect(component.isLoading).toBeFalse();
  });

  it('should set error on failed workout load', () => {
    workoutServiceSpy.getAllWorkouts.and.returnValue(throwError(() => new Error('Network error')));

    component.loadRecentWorkouts();

    expect(component.error).toBe('Failed to load workouts');
    expect(component.isLoading).toBeFalse();
  });

  it('should navigate to workout on startWorkout', () => {
    component.startWorkout(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/workouts', 1]);
  });

  it('should return "Never trained" if date is undefined', () => {
    const result = component.getDaysSinceLastTraining(undefined);
    expect(result).toBe('Never trained');
  });

  it('should return "Just now" if difference is less than 1 minute', () => {
    const pastDate = new Date(Date.now() - 120 * 60 * 1000); // 5 minutes ago
    const result = component.getDaysSinceLastTraining(pastDate);
    expect(result).toContain('Just now');
  });

  it('should calculate minutes ago correctly', () => {
    const pastDate = new Date(Date.now() - 90 * 60 * 1000); // 5 minutes ago
    const result = component.getDaysSinceLastTraining(pastDate);
    expect(result).toContain('minute');
  });

  it('should calculate hours ago correctly', () => {
    const pastDate = new Date(Date.now() - 4 * 60 * 60 * 1000); // 2 hours ago
    const result = component.getDaysSinceLastTraining(pastDate);
    expect(result).toContain('hour');
  });

  it('should calculate days ago correctly', () => {
    const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
    const result = component.getDaysSinceLastTraining(pastDate);
    expect(result).toContain('day');
  });

  it('should calculate weeks ago correctly', () => {
    const pastDate = new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000); // 3 weeks ago
    const result = component.getDaysSinceLastTraining(pastDate);
    expect(result).toContain('week');
  });

  it('should return "months ago" if date is very old', () => {
    const oldDate = new Date(Date.now() - 70 * 24 * 60 * 60 * 1000); // 70 days ago
    const result = component.getDaysSinceLastTraining(oldDate);
    expect(result).toBe('months ago');
  });
});
