package ch.zhaw.skibidicoders.fittrack.advice;

import ch.zhaw.skibidicoders.fittrack.exception.ExerciseNotFoundException;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseSetNotFoundException;
import ch.zhaw.skibidicoders.fittrack.exception.WorkoutNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Global exception handler for the application.
 */
@ControllerAdvice
public class GlobalExceptionHandler {
    /**
     * Handles WorkoutNotFoundException.
     *
     * @param e the exception
     * @return the response entity with error details
     */
    @ExceptionHandler(WorkoutNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleWorkoutNotFound(WorkoutNotFoundException e) {
        ErrorResponse error = ErrorResponse.builder(e, HttpStatus.NOT_FOUND, "Workout not found")
                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles ExerciseNotFoundException.
     *
     * @param e the exception
     * @return the response entity with error details
     */
    @ExceptionHandler(ExerciseNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleExerciseNotFound(ExerciseNotFoundException e) {
        ErrorResponse error = ErrorResponse.builder(e, HttpStatus.NOT_FOUND, "Exercise not found")
                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handles ExerciseSetNotFoundException.
     *
     * @param e the exception
     * @return the response entity with error details
     */
    @ExceptionHandler(ExerciseSetNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleExerciseSetNotFound(ExerciseSetNotFoundException e) {
        ErrorResponse error = ErrorResponse.builder(e, HttpStatus.NOT_FOUND, "Exercise Set not found")
                .build();

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}
