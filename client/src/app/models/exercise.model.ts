import { ExerciseSet } from "./exercise-set.model";

export interface Exercise {
  id?: number;
  workoutId?: number;
  name: string;
  muscleGroup?: string;
  notes?: string;
  sets?: ExerciseSet[];
}
