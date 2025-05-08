package ch.zhaw.skibidicoders.fittrack.controller;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseRequestDto;
import ch.zhaw.skibidicoders.fittrack.dto.request.WorkoutRequestDto;
import ch.zhaw.skibidicoders.fittrack.dto.response.ExerciseResponseDto;
import ch.zhaw.skibidicoders.fittrack.dto.response.WorkoutResponseDto;
import ch.zhaw.skibidicoders.fittrack.service.ExerciseService;
import ch.zhaw.skibidicoders.fittrack.service.WorkoutService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for managing workouts.
 */
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {
    private final WorkoutService workoutService;
    private final ExerciseService exerciseService;

    /**
     * Constructor for WorkoutController.
     *
     * @param workoutService  the workout service
     * @param exerciseService the exercise service
     */
    public WorkoutController(WorkoutService workoutService, ExerciseService exerciseService) {
        this.workoutService = workoutService;
        this.exerciseService = exerciseService;
    }

    /**
     * Get all workouts.
     *
     * @return a list of workouts
     */
    @GetMapping
    public ResponseEntity<List<WorkoutResponseDto>> getAllWorkouts() {
        return ResponseEntity.ok(workoutService.getAllWorkouts().stream()
                .map(WorkoutResponseDto::fromEntity)
                .toList());
    }

    /**
     * Get a workout by id.
     *
     * @param id the id of the workout
     * @return the workout
     */
    @GetMapping("/{id}")
    public ResponseEntity<WorkoutResponseDto> getWorkoutById(@PathVariable Long id) {
        return ResponseEntity.ok(WorkoutResponseDto.fromEntity(workoutService.getWorkoutById(id)));
    }

    /**
     * Create a new workout.
     *
     * @param workout the workout to create
     * @return the created workout
     */
    @PostMapping
    public ResponseEntity<WorkoutResponseDto> createWorkout(@RequestBody WorkoutRequestDto workout) {
        return new ResponseEntity<>(WorkoutResponseDto.fromEntity(workoutService.createWorkout(workout)), HttpStatus.CREATED);
    }

    /**
     * Update an existing workout.
     *
     * @param id      the id of the workout to update
     * @param workout the workout to update
     * @return the updated workout
     */
    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponseDto> updateWorkout(@PathVariable Long id, @RequestBody WorkoutRequestDto workout) {
        return new ResponseEntity<>(WorkoutResponseDto.fromEntity(workoutService.updateWorkout(id, workout)), HttpStatus.CREATED);
    }

    /**
     * Delete a workout.
     *
     * @param id the id of the workout to delete
     * @return a response entity with no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all exercises of a workout by its id.
     *
     * @param id the id of the workout
     * @return a list of exercises
     */
    @GetMapping("/{id}/exercises")
    public ResponseEntity<List<ExerciseResponseDto>> getExercisesByWorkoutId(@PathVariable Long id) {
        return ResponseEntity.ok(workoutService.getExercisesByWorkoutId(id).stream()
                .map(ExerciseResponseDto::fromEntity)
                .toList());
    }

    /**
     * Create a new exercise and add it to a workout.
     *
     * @param id       the id of the workout
     * @param exercise the exercise to create
     * @return the created exercise
     */
    @PostMapping("/{id}/exercises")
    public ResponseEntity<ExerciseResponseDto> addExerciseToWorkout(@PathVariable Long id, @RequestBody ExerciseRequestDto exercise) {
        return new ResponseEntity<>(ExerciseResponseDto.fromEntity(exerciseService.createExercise(id, exercise)), HttpStatus.CREATED);
    }

    /**
     * Patch the latest workout date.
     *
     * @param id the id of the workout
     * @return a response entity with no content
     */
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updateLastWorkoutAt(@PathVariable Long id) {
        workoutService.updateLastWorkoutAt(id);
        return ResponseEntity.noContent().build();
    }
}
