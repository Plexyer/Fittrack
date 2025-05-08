import {TestBed} from '@angular/core/testing';
import {WorkoutService} from './workout.service';
import {of} from 'rxjs';
import {Workout} from '../models/workout.model';
import {ChartService} from './chat.service';

describe('ChartService', () => {
    let service: ChartService;
    let workoutService: jasmine.SpyObj<WorkoutService>;

    const mockWorkouts: Workout[] = [
        {
            id: 1,
            name: 'Push Day',
            date: new Date('2024-04-01'),
            lastWorkoutAt: new Date('2024-04-01'),
            exercises: [
                {
                    name: 'Bench Press',
                    sets: [
                        {weight: 100, repetitions: 10, setNumber: 1},
                        {weight: 110, repetitions: 8, setNumber: 2}
                    ]
                }
            ]
        },
        {
            id: 2,
            name: 'Pull Day',
            date: new Date('2024-04-08'),
            exercises: [
                {
                    name: 'Deadlift',
                    sets: [
                        {weight: 120, repetitions: 5, setNumber: 1},
                        {weight: 130, repetitions: 3, setNumber: 2}
                    ]
                }
            ]
        }
    ];

    beforeEach(() => {
        const spy = jasmine.createSpyObj('WorkoutService', ['getAllWorkouts']);

        TestBed.configureTestingModule({
            providers: [
                ChartService,
                {provide: WorkoutService, useValue: spy}
            ]
        });

        service = TestBed.inject(ChartService);
        workoutService = TestBed.inject(WorkoutService) as jasmine.SpyObj<WorkoutService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('getWorkoutFrequencyData', () => {
        it('should return actual chart data when workouts are present', (done) => {
            workoutService.getAllWorkouts.and.returnValue(of(mockWorkouts));

            service.getWorkoutFrequencyData(2).subscribe(data => {
                expect(data.length).toBeGreaterThan(0);
                expect(data[0].value).toBeDefined();
                expect(data[0].value).toBeDefined();
                done();
            });
        });

        it('should return sample chart data when no workouts exist', (done) => {
            workoutService.getAllWorkouts.and.returnValue(of([]));

            service.getWorkoutFrequencyData(2).subscribe(data => {
                expect(data.length).toBe(2);
                expect(data[0].value).toBeGreaterThanOrEqual(2);
                done();
            });
        });
    });

    describe('getExerciseProgressData', () => {
        it('should build progress chart for specified exercises', (done) => {
            workoutService.getAllWorkouts.and.returnValue(of(mockWorkouts));

            service.getExerciseProgressData(['Bench Press']).subscribe(chartData => {
                expect(chartData.labels.length).toBeGreaterThan(0);
                expect(chartData.datasets.length).toBe(1);
                expect(chartData.datasets[0].label).toBe('Bench Press');
                done();
            });
        });

        it('should fallback to top exercises if none are specified', (done) => {
            workoutService.getAllWorkouts.and.returnValue(of(mockWorkouts));

            service.getExerciseProgressData().subscribe(chartData => {
                expect(chartData.datasets.length).toBeGreaterThan(0);
                done();
            });
        });
    });

    describe('getTotalVolumeData', () => {
        it('should calculate weekly volume correctly', (done) => {
            workoutService.getAllWorkouts.and.returnValue(of(mockWorkouts));

            service.getTotalVolumeData(2).subscribe(data => {
                expect(data.length).toBeGreaterThan(0);
                expect(data[0].value).toBeGreaterThanOrEqual(0);
                done();
            });
        });
    });
});
