import { Exercise } from "./exercise.model";

export interface Workout {
  id?: number | undefined;
  name: string;
  date: Date;
  duration?: number;
  notes?: string;
  lastWorkoutAt?: Date;
  exercises?: Exercise[];
}
