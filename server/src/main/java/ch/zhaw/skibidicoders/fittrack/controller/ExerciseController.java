package ch.zhaw.skibidicoders.fittrack.controller;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseRequestDto;
import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseSetRequestDto;
import ch.zhaw.skibidicoders.fittrack.dto.response.ExerciseResponseDto;
import ch.zhaw.skibidicoders.fittrack.dto.response.ExerciseSetResponseDto;
import ch.zhaw.skibidicoders.fittrack.service.ExerciseService;
import ch.zhaw.skibidicoders.fittrack.service.ExerciseSetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for managing exercises.
 */
@RestController
@RequestMapping("/api/exercises")
public class ExerciseController {
    private final ExerciseService exerciseService;
    private final ExerciseSetService exerciseSetService;

    /**
     * Constructor for ExerciseController.
     *
     * @param exerciseService    the exercise service
     * @param exerciseSetService the exercise set service
     */
    public ExerciseController(ExerciseService exerciseService, ExerciseSetService exerciseSetService) {
        this.exerciseService = exerciseService;
        this.exerciseSetService = exerciseSetService;
    }

    /**
     * Get an exercise.
     *
     * @param id       the id of the exercise
     * @return the exercise
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseResponseDto> getExercise(@PathVariable Long id) {
        return ResponseEntity.ok(ExerciseResponseDto.fromEntity(exerciseService.getExerciseById(id)));
    }

    /**
     * Update an exercise.
     *
     * @param id       the id of the exercise
     * @param exercise the exercise to update
     * @return the updated exercise
     */
    @PutMapping("/{id}")
    public ResponseEntity<ExerciseResponseDto> updateExercise(@PathVariable Long id, @RequestBody ExerciseRequestDto exercise) {
        return new ResponseEntity<>(ExerciseResponseDto.fromEntity(exerciseService.updateExercise(id, exercise)), HttpStatus.CREATED);
    }

    /**
     * Delete an exercise.
     *
     * @param id the id of the exercise
     * @return a response entity with no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long id) {
        exerciseService.deleteExercise(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all sets of an exercise by its id.
     *
     * @param id the id of the exercise
     * @return a list of exercise sets
     */
    @GetMapping("/{id}/sets")
    public ResponseEntity<List<ExerciseSetResponseDto>> getExerciseSetsByExerciseId(@PathVariable Long id) {
        return ResponseEntity.ok(exerciseService.getExerciseSetsByExerciseId(id).stream()
                .map(ExerciseSetResponseDto::fromEntity)
                .toList());
    }

    /**
     * Create a new exercise set
     *
     * @param id          the id of the exercise
     * @param exerciseSet the exercise set to create
     * @return the created exercise set
     */
    @PostMapping("{id}/sets")
    public ResponseEntity<ExerciseSetResponseDto> createExerciseSet(@PathVariable Long id, @RequestBody ExerciseSetRequestDto exerciseSet) {
        return new ResponseEntity<>(ExerciseSetResponseDto.fromEntity(exerciseSetService.createExerciseSet(id, exerciseSet)), HttpStatus.CREATED);
    }
}
