package ch.zhaw.skibidicoders.fittrack.repository;

import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing exercises.
 */
@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    /**
     * Finds all exercises associated with a given workout ID.
     *
     * @param workoutId the ID of the workout
     * @return a list of exercises
     */
    List<Exercise> findByWorkoutId(Long workoutId);
}
