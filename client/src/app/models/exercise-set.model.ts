export interface ExerciseSet {
  id?: number;
  exerciseId?: number;
  repetitions: number;
  weight: number;
  setNumber: number;
  isWarmup?: boolean;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date; 
}