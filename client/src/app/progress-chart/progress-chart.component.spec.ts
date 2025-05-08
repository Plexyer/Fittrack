import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProgressChartComponent } from './progress-chart.component';
import { ChartService } from '../services/chat.service';
import { of, throwError } from 'rxjs';

describe('ProgressChartComponent', () => {
  let component: ProgressChartComponent;
  let fixture: ComponentFixture<ProgressChartComponent>;
  let chartService: jasmine.SpyObj<ChartService>;

  const mockChartData = [
    { label: 'Week 1', value: 3 },
    { label: 'Week 2', value: 5 }
  ];

  beforeEach(async () => {
    const chartServiceSpy = jasmine.createSpyObj('ChartService', [
      'getWorkoutFrequencyData',
      'getExerciseProgressData',
      'getTotalVolumeData'
    ]);

    await TestBed.configureTestingModule({
      imports: [ProgressChartComponent],
      providers: [{ provide: ChartService, useValue: chartServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgressChartComponent);
    component = fixture.componentInstance;
    chartService = TestBed.inject(ChartService) as jasmine.SpyObj<ChartService>;

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
  });

  afterEach(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) canvas.remove();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load workout frequency chart on init', fakeAsync(() => {
    chartService.getWorkoutFrequencyData.and.returnValue(of(mockChartData));
    fixture.detectChanges();
    tick();

    component.chartCanvas = document.querySelector('canvas');
    component.loadChartData();

    expect(chartService.getWorkoutFrequencyData).toHaveBeenCalled();
    expect(component.noDataAvailable).toBeFalse();
  }));

  it('should show no data if all values are zero', fakeAsync(() => {
    chartService.getWorkoutFrequencyData.and.returnValue(of([
      { label: 'Week 1', value: 0 },
      { label: 'Week 2', value: 0 }
    ]));

    fixture.detectChanges();
    tick();

    component.chartCanvas = document.querySelector('canvas');
    component.loadChartData();

    expect(component.noDataAvailable).toBeTrue();
  }));

  it('should handle chart type change', () => {
    const event = { target: { value: 'total-volume' } };
    chartService.getTotalVolumeData.and.returnValue(of(mockChartData));

    component.chartCanvas = document.createElement('canvas');
    component.changeChartType(event);

    expect(component.chartType).toBe('total-volume');
    expect(chartService.getTotalVolumeData).toHaveBeenCalled();
  });

  it('should handle service error gracefully', fakeAsync(() => {
    spyOn(console, 'error');
    chartService.getWorkoutFrequencyData.and.returnValue(throwError(() => new Error('Fail')));

    fixture.detectChanges();
    tick();

    component.chartCanvas = document.querySelector('canvas');
    component.loadChartData();

    expect(component.noDataAvailable).toBeTrue();
    expect(console.error).toHaveBeenCalled();
  }));
});
