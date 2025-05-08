package ch.zhaw.skibidicoders.fittrack.service;

import ch.zhaw.skibidicoders.fittrack.dto.request.WorkoutRequestDto;
import ch.zhaw.skibidicoders.fittrack.exception.WorkoutNotFoundException;
import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.Workout;
import ch.zhaw.skibidicoders.fittrack.repository.ExerciseRepository;
import ch.zhaw.skibidicoders.fittrack.repository.WorkoutRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Service class for managing workouts.
 */
@Service
public class WorkoutService {
    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;

    /**
     * Constructor for WorkoutService.
     *
     * @param workoutRepository  the workout repository
     * @param exerciseRepository the exercise repository
     */
    public WorkoutService(WorkoutRepository workoutRepository, ExerciseRepository exerciseRepository) {
        this.workoutRepository = workoutRepository;
        this.exerciseRepository = exerciseRepository;
    }

    /**
     * Retrieves all workouts.
     *
     * @return a list of workouts
     */
    public List<Workout> getAllWorkouts() {
        return workoutRepository.findAll();
    }

    /**
     * Retrieves a workout by its ID.
     *
     * @param workoutId the ID of the workout
     * @return the workout
     */
    public Workout getWorkoutById(long workoutId) {
        return workoutRepository.findById(workoutId).orElseThrow(WorkoutNotFoundException::new);
    }

    /**
     * Creates a new workout.
     *
     * @param workout the workout data
     * @return the created workout
     */
    public Workout createWorkout(WorkoutRequestDto workout) {
        return workoutRepository.save(workout.toEntity());
    }

    /**
     * Updates an existing workout.
     *
     * @param workoutId the ID of the workout to update
     * @param workout   the new workout data
     * @return the updated workout
     */
    public Workout updateWorkout(long workoutId, WorkoutRequestDto workout) {
        if (!workoutRepository.existsById(workoutId)) {
            throw new WorkoutNotFoundException();
        }

        return workoutRepository.save(workout.toEntity(workoutId));
    }

    /**
     * Deletes a workout given its ID.
     *
     * @param workoutId the ID of the workout
     */
    public void deleteWorkout(long workoutId) {
        if (!workoutRepository.existsById(workoutId)) {
            throw new WorkoutNotFoundException();
        }

        workoutRepository.deleteById(workoutId);
    }

    /**
     * Retrieves all exercises for a given workout.
     *
     * @param workoutId the ID of the workout
     * @return a list of exercises
     */
    public List<Exercise> getExercisesByWorkoutId(long workoutId) {
        return exerciseRepository.findByWorkoutId(workoutId);
    }

    /**
     * Updates the last workout date for a given workout.
     *
     * @param workoutId the ID of the workout
     */
    public void updateLastWorkoutAt(long workoutId) {
        Workout workout = getWorkoutById(workoutId);
        workout.setLastWorkoutAt(LocalDateTime.now());
        workoutRepository.save(workout);
    }
}
