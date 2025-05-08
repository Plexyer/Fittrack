package ch.zhaw.skibidicoders.fittrack.controller;

import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseRequestDto;
import ch.zhaw.skibidicoders.fittrack.dto.request.ExerciseSetRequestDto;
import ch.zhaw.skibidicoders.fittrack.exception.ExerciseNotFoundException;
import ch.zhaw.skibidicoders.fittrack.model.Exercise;
import ch.zhaw.skibidicoders.fittrack.model.ExerciseSet;
import ch.zhaw.skibidicoders.fittrack.service.ExerciseService;
import ch.zhaw.skibidicoders.fittrack.service.ExerciseSetService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ExerciseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private ExerciseService exerciseService;

    @MockitoBean
    private ExerciseSetService exerciseSetService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldUpdateExerciseAndReturnUpdatedExercise() throws Exception {
        Exercise existingExercise = new Exercise();
        existingExercise.setId(1L);
        existingExercise.setName("Chest Fly");

        Mockito.when(exerciseService.updateExercise(eq(1L), any(ExerciseRequestDto.class)))
                .thenAnswer(invocation -> {
                    ExerciseRequestDto dto = invocation.getArgument(1);
                    existingExercise.setName(dto.name());
                    return existingExercise;
                });

        ExerciseRequestDto requestDto = new ExerciseRequestDto("Chest Press", "notes");

        mockMvc.perform(put("/api/exercises/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Chest Press"));
    }

    @Test
    void shouldReturnNotFoundWhenUpdatingNonexistentExercise() throws Exception {
        Mockito.when(exerciseService.updateExercise(eq(2L), any(ExerciseRequestDto.class)))
                .thenThrow(new ExerciseNotFoundException());

        ExerciseRequestDto requestDto = new ExerciseRequestDto("Chest Press", "notes");

        mockMvc.perform(put("/api/exercises/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldDeleteExerciseAndReturnNoContent() throws Exception {
        mockMvc.perform(delete("/api/exercises/1"))
                .andExpect(status().isNoContent());

        Mockito.verify(exerciseService).deleteExercise(1L);
    }

    @Test
    void shouldNotDeleteExerciseWithWrongId() throws Exception {
        Mockito.doThrow(new ExerciseNotFoundException())
                .when(exerciseService).deleteExercise(2L);

        mockMvc.perform(delete("/api/exercises/2"))
                .andExpect(status().isNotFound());

        Mockito.verify(exerciseService).deleteExercise(2L);
    }

    @Test
    void shouldReturnExerciseList() throws Exception {
        ExerciseSet exerciseSet = new ExerciseSet();
        exerciseSet.setId(1L);

        Mockito.when(exerciseService.getExerciseSetsByExerciseId(1L))
                .thenReturn(Collections.singletonList(exerciseSet));

        mockMvc.perform(get("/api/exercises/1/sets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1));

        Mockito.verify(exerciseService).getExerciseSetsByExerciseId(1L);
    }

    @Test
    void shouldNotReturnExerciseListWithWrongId() throws Exception {
        Mockito.when(exerciseService.getExerciseSetsByExerciseId(2L))
                .thenThrow(new ExerciseNotFoundException());

        mockMvc.perform(get("/api/exercises/2/sets"))
                .andExpect(status().isNotFound());

        Mockito.verify(exerciseService).getExerciseSetsByExerciseId(2L);
    }

    @Test
    void shouldCreateExerciseSet() throws Exception {
        ExerciseSet exerciseSet = new ExerciseSet();
        exerciseSet.setId(1L);

        ExerciseSetRequestDto requestDto = new ExerciseSetRequestDto(12, 80.0, "notes");

        Mockito.when(exerciseSetService.createExerciseSet(eq(1L), any(ExerciseSetRequestDto.class)))
                .thenReturn(exerciseSet);

        mockMvc.perform(post("/api/exercises/1/sets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldReturnNotFoundWhenCreatingExerciseSetForNonexistentExercise() throws Exception {
        ExerciseSetRequestDto requestDto = new ExerciseSetRequestDto(12, 80.0, "notes");

        Mockito.when(exerciseSetService.createExerciseSet(eq(99L), any(ExerciseSetRequestDto.class)))
                .thenThrow(new ExerciseNotFoundException());

        mockMvc.perform(post("/api/exercises/99/sets")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldReturnExerciseById() throws Exception {
        Exercise exercise = new Exercise();
        exercise.setId(1L);
        exercise.setName("Deadlift");

        Mockito.when(exerciseService.getExerciseById(1L)).thenReturn(exercise);

        mockMvc.perform(get("/api/exercises/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Deadlift"));
    }

    @Test
    void shouldReturnNotFoundWhenExerciseDoesNotExist() throws Exception {
        Mockito.when(exerciseService.getExerciseById(99L))
                .thenThrow(new ExerciseNotFoundException());

        mockMvc.perform(get("/api/exercises/99"))
                .andExpect(status().isNotFound());
    }
}