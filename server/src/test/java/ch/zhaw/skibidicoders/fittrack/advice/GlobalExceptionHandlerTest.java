package ch.zhaw.skibidicoders.fittrack.advice;

import ch.zhaw.skibidicoders.fittrack.exception.ExerciseNotFoundException;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseSetNotFoundException;
import ch.zhaw.skibidicoders.fittrack.exception.WorkoutNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Import(GlobalExceptionHandlerTest.TestControllerConfiguration.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @TestConfiguration
    static class TestControllerConfiguration {
        @Bean
        public TestController testController() {
            return new TestController();
        }
    }

    @RestController
    static class TestController {

        @GetMapping("/test/workout")
        public void triggerWorkoutException() {
            throw new WorkoutNotFoundException();
        }

        @GetMapping("/test/exercise")
        public void triggerExerciseException() {
            throw new ExerciseNotFoundException();
        }

        @GetMapping("/test/exercise-set")
        public void triggerExerciseSetException() {
            throw new ExerciseSetNotFoundException();
        }
    }

    @Test
    void givenWorkoutNotFound_whenCallingEndpoint_thenReturns404() throws Exception {
        mockMvc.perform(get("/test/workout"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.body.detail").value("Workout not found"));
    }

    @Test
    void givenExerciseNotFound_whenCallingEndpoint_thenReturns404() throws Exception {
        mockMvc.perform(get("/test/exercise"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.body.detail").value("Exercise not found"));
    }

    @Test
    void givenExerciseSetNotFound_whenCallingEndpoint_thenReturns404() throws Exception {
        mockMvc.perform(get("/test/exercise-set"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.body.detail").value("Exercise Set not found"));
    }
}