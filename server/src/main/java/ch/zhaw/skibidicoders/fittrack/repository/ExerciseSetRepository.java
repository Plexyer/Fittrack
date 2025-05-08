package ch.zhaw.skibidicoders.fittrack.repository;

import ch.zhaw.skibidicoders.fittrack.model.ExerciseSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing exercise sets.
 */
@Repository
public interface ExerciseSetRepository extends JpaRepository<ExerciseSet, Long> {
    /**
     * Finds all exercise sets associated with a given exercise ID.
     *
     * @param exerciseId the ID of the exercise
     * @return a list of exercise sets
     */
    List<ExerciseSet> findByExerciseId(Long exerciseId);
}
