package ch.zhaw.skibidicoders.fittrack.controller;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseRequestDto;
import ch.zhaw.skibidicoders.fittrack.dto.request.WorkoutRequestDto;
import ch.zhaw.skibidicoders.fittrack.exception.WorkoutNotFoundException;
import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.Workout;
import ch.zhaw.skibidicoders.fittrack.service.ExerciseService;
import ch.zhaw.skibidicoders.fittrack.service.WorkoutService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.DayOfWeek;
import java.util.Collections;
import java.util.Set;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class WorkoutControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private WorkoutService workoutService;

    @MockitoBean
    private ExerciseService exerciseService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetAllWorkouts() throws Exception {
        Workout workout = new Workout();
        workout.setId(1L);

        Mockito.when(workoutService.getAllWorkouts())
                .thenReturn(Collections.singletonList(workout));

        mockMvc.perform(get("/api/workouts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void shouldGetWorkoutById() throws Exception {
        Workout workout = new Workout();
        workout.setId(1L);

        Mockito.when(workoutService.getWorkoutById(1L))
                .thenReturn(workout);

        mockMvc.perform(get("/api/workouts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldCreateWorkout() throws Exception {
        Workout workout = new Workout();
        workout.setId(1L);

        WorkoutRequestDto requestDto = new WorkoutRequestDto(
                "Chest Day",
                Set.of(DayOfWeek.MONDAY, DayOfWeek.THURSDAY),
                "notes"
        );

        Mockito.when(workoutService.createWorkout(any(WorkoutRequestDto.class)))
                .thenReturn(workout);

        mockMvc.perform(post("/api/workouts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldUpdateWorkout() throws Exception {
        Workout existingWorkout = new Workout();
        existingWorkout.setId(1L);
        existingWorkout.setName("Chest Day");
        existingWorkout.setWorkoutDays(Set.of(DayOfWeek.MONDAY));

        Mockito.when(workoutService.updateWorkout(eq(1L), any(WorkoutRequestDto.class)))
                .thenAnswer(invocation -> {
                    WorkoutRequestDto dto = invocation.getArgument(1);
                    existingWorkout.setName(dto.name());
                    existingWorkout.setWorkoutDays(dto.workoutDays());
                    return existingWorkout;
                });

        WorkoutRequestDto requestDto = new WorkoutRequestDto(
                "Chest Day Updated",
                Set.of(DayOfWeek.TUESDAY, DayOfWeek.THURSDAY),
                "notes"
        );

        mockMvc.perform(put("/api/workouts/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Chest Day Updated"))
                .andExpect(jsonPath("$.workoutDays", containsInAnyOrder("TUESDAY", "THURSDAY")));
    }

    @Test
    void shouldDeleteWorkout() throws Exception {
        mockMvc.perform(delete("/api/workouts/1"))
                .andExpect(status().isNoContent());

        Mockito.verify(workoutService).deleteWorkout(1L);
    }

    @Test
    void shouldNotDeleteWorkoutWithWrongId() throws Exception {
        Mockito.doThrow(new WorkoutNotFoundException())
                .when(workoutService).deleteWorkout(2L);

        mockMvc.perform(delete("/api/workouts/2"))
                .andExpect(status().isNotFound());

        Mockito.verify(workoutService).deleteWorkout(2L);
    }

    @Test
    void shouldUpdateLastWorkoutAt() throws Exception {
        mockMvc.perform(patch("/api/workouts/1"))
                .andExpect(status().isNoContent());

        Mockito.verify(workoutService).updateLastWorkoutAt(1L);
    }

    @Test
    void shouldGetExercisesByWorkoutId() throws Exception {
        Exercise exercise = new Exercise();
        exercise.setId(1L);

        Mockito.when(workoutService.getExercisesByWorkoutId(1L))
                .thenReturn(Collections.singletonList(exercise));

        mockMvc.perform(get("/api/workouts/1/exercises"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));
    }

    @Test
    void shouldAddExerciseToWorkout() throws Exception {
        Exercise exercise = new Exercise();
        exercise.setId(1L);

        ExerciseRequestDto requestDto = new ExerciseRequestDto("Bench Press", "notes");

        Mockito.when(exerciseService.createExercise(eq(1L), any(ExerciseRequestDto.class)))
                .thenReturn(exercise);

        mockMvc.perform(post("/api/workouts/1/exercises")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }
}