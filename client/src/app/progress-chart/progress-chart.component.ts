import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ChartService } from '../services/chat.service';

Chart.register(...registerables);

interface ChartDataset {
    label: string;
    data: (number | null)[];
    fill: boolean;
    borderColor: string;
    tension: number;
  }
  interface ChartDataStructure {
    labels: string[];
    datasets: ChartDataset[];
  }


@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-chart.component.html',
  styleUrl: './progress-chart.component.scss'
})
export class ProgressChartComponent implements OnInit {
  @Input() viewOnly = false;
  private chart: Chart | null = null;
  chartCanvas: any;
  chartType = 'workout-frequency';
  timeRange = 4;
  isLoading = true;
  noDataAvailable = false;
  isOpen = false;

  chartColors = {
      backgroundColor: 'rgba(76, 175, 80, 0.1)',
      borderColor: '#81c784'
  };

  constructor(private chartService: ChartService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.chartCanvas = document.querySelector('canvas');
      this.loadChartData();
    }, 0);
  }

  onDropdownChange(event: Event) {
    this.isOpen = false;
    const select = event.target as HTMLSelectElement;
    select.blur();
    this.changeChartType(event);
  }

  changeChartType(event: any): void {
    this.chartType = event.target.value;
    this.loadChartData();
  }

  changeTimeRange(weeks: number): void {
    this.timeRange = weeks;
    this.loadChartData();
  }

  loadChartData(): void {
    if (!this.chartCanvas) return;

    this.isLoading = true;
    this.noDataAvailable = false;

    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }

    switch (this.chartType) {
      case 'workout-frequency':
        this.loadWorkoutFrequencyChart();
        break;
      case 'exercise-progress':
        this.loadExerciseProgressChart();
        break;
      case 'total-volume':
        this.loadTotalVolumeChart();
        break;
    }
  }

  loadWorkoutFrequencyChart(): void {
    this.chartService.getWorkoutFrequencyData(this.timeRange).subscribe({
      next: (data: any[]) => {
        if (data.length === 0 || data.every((item: { value: number; }) => item.value === 0)) {
          this.noDataAvailable = true;
          this.isLoading = false;
          return;
        }

        this.chart = new Chart(this.chartCanvas, {
          type: 'bar',
          data: {
            labels: data.map((item: { label: any; }) => item.label),
            datasets: [{
              label: 'Workouts per Week',
              data: data.map((item: { value: any; }) => item.value),
              backgroundColor: this.chartColors.backgroundColor,
              borderColor: this.chartColors.borderColor,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                bottom: 30
              }
            },
            scales: {
              x: {
                ticks: {
                  maxRotation: 45,
                  minRotation: 0
                }
              },
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading workout frequency data:', error);
        this.isLoading = false;
        this.noDataAvailable = true;
      }
    });
  }

  loadExerciseProgressChart(): void {
    this.chartService.getExerciseProgressData([], this.timeRange).subscribe({
      next: (chartData: any) => {
        if (!chartData.labels.length || !chartData.datasets.length) {
          this.noDataAvailable = true;
          this.isLoading = false;
          return;
        }

        const labels = Array.isArray(chartData.labels) ? chartData.labels : [];

        const datasets = chartData.datasets.map((dataset: any) => ({
          label: dataset.label || '',
          data: dataset.data || [],
          fill: dataset.fill !== undefined ? dataset.fill : false,
          borderColor: dataset.borderColor || '#007bff',
          tension: dataset.tension !== undefined ? dataset.tension : 0.1
        }));

        const typedChartData: ChartDataStructure = {
          labels,
          datasets: datasets.map((dataset: ChartDataset) => ({
            backgroundColor: this.chartColors.backgroundColor,
            borderColor: this.chartColors.borderColor,
          }))
        };

        this.chart = new Chart(this.chartCanvas, {
          type: 'line',
          data: typedChartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Weight'
                }
              }
            }
          }
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading exercise progress data:', error);
        this.isLoading = false;
        this.noDataAvailable = true;
      }
    });
  }

  loadTotalVolumeChart(): void {
    this.chartService.getTotalVolumeData(this.timeRange).subscribe({
      next: (data: any[]) => {
        if (data.length === 0 || data.every((item: { value: number; }) => item.value === 0)) {
          this.noDataAvailable = true;
          this.isLoading = false;
          return;
        }

        this.chart = new Chart(this.chartCanvas, {
          type: 'bar',
          data: {
            labels: data.map((item: { label: any; }) => item.label),
            datasets: [{
              label: 'Total Volume (Weight × Reps)',
              data: data.map((item: { value: any; }) => item.value),
              backgroundColor: this.chartColors.backgroundColor,
              borderColor: this.chartColors.borderColor,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Volume'
                }
              }
            }
          }
        });

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading total volume data:', error);
        this.isLoading = false;
        this.noDataAvailable = true;
      }
    });
  }
}
