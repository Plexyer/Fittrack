package ch.zhaw.skibidicoders.fittrack.controller;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseSetRequestDto;
import ch.zhaw.skibidicoders.fittrack.dto.response.ExerciseSetResponseDto;
import ch.zhaw.skibidicoders.fittrack.service.ExerciseSetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for managing exercise sets.
 */
@RestController
@RequestMapping("/api/sets")
public class ExerciseSetController {
    private final ExerciseSetService exerciseSetService;

    /**
     * Constructor for ExerciseSetController.
     *
     * @param exerciseSetService the exercise set service
     */
    public ExerciseSetController(ExerciseSetService exerciseSetService) {
        this.exerciseSetService = exerciseSetService;
    }

    /**
     * Get an exercise set by id.
     *
     * @param id the id of the exercise set
     * @return the exercise set
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExerciseSetResponseDto> getExerciseSet(@PathVariable long id) {
        return new ResponseEntity<>(ExerciseSetResponseDto.fromEntity(exerciseSetService.getExerciseSet(id)), HttpStatus.CREATED);

    }

    /**
     * Delete an exercise set.
     *
     * @param id the id of the exercise set
     * @return a response entity with no content
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExerciseSet(@PathVariable long id) {
        exerciseSetService.deleteExerciseSet(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Update an exercise set.
     *
     * @param id             the id of the exercise set
     * @param exerciseSetDto the exercise set to update
     * @return the updated exercise set
     */
    @PutMapping("/{id}")
    public ResponseEntity<ExerciseSetResponseDto> updateExerciseSet(@PathVariable long id, @RequestBody ExerciseSetRequestDto exerciseSetDto) {
        return new ResponseEntity<>(ExerciseSetResponseDto.fromEntity(exerciseSetService.updateExerciseSet(id, exerciseSetDto)), HttpStatus.CREATED);
    }
}
