import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WorkoutListComponent } from './workout-parts/workout/workout-list/workout-list.component';
import { WorkoutFormComponent } from './workout-parts/workout/workout-form/workout-form.component';
import { WorkoutDetailComponent } from './workout-parts/workout/workout-detail/workout-detail.component';
import { ExerciseDetailComponent } from './workout-parts/exercise/exercise-detail/exercise-detail.component';
import { SetDetailComponent } from './workout-parts/set/set-detail/set-detail.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'workouts', component: WorkoutListComponent },
    { path: 'workouts/new', component: WorkoutFormComponent },
    { path: 'workouts/:id', component: WorkoutDetailComponent },
    { path: 'workouts/:id/edit', component: WorkoutFormComponent },
    {
      path: 'workouts/:workoutId/exercises/:id',
      component: ExerciseDetailComponent
    },
    {
      path: 'workouts/:workoutId/exercises/:exerciseId/sets/:setId',
      component: SetDetailComponent
    },
    { path: '**', redirectTo: '' }
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
