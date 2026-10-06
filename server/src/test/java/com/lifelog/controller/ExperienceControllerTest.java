package com.lifelog.controller;

import com.lifelog.exception.GlobalExceptionHandler;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import com.lifelog.service.ExperienceSearchService;
import com.lifelog.service.ExperienceService;
import com.lifelog.service.RecentlyViewedService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("ExperienceController Complete API Web Tests")
class ExperienceControllerTest {

    private MockMvc mockMvc;
    private ExperienceRepository repository;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ExperienceRepository.class);

        ExperienceService experienceService = new ExperienceService(repository);
        RecentlyViewedService recentlyViewedService = new RecentlyViewedService();
        ExperienceSearchService experienceSearchService = new ExperienceSearchService(repository);

        ExperienceController controller = new ExperienceController(
                experienceService,
                recentlyViewedService,
                experienceSearchService
        );

        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    @DisplayName("GET /api/experiences with sorting parameters")
    void testGetAllWithSorting() throws Exception {
        Experience exp = new Experience("Title", "Projects", "desc", "loc", LocalDate.now(), 4);
        exp.setId(1L);
        when(repository.findAll(any(org.springframework.data.domain.Sort.class))).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences?sortBy=date&direction=asc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    @DisplayName("POST /api/experiences with invalid payload returns 400 Bad Request with field errors")
    void testCreateValidationFailure() throws Exception {
        String invalidJson = """
                {
                    "title": "",
                    "category": "",
                    "rating": 10
                }
                """;

        mockMvc.perform(post("/api/experiences")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.validationErrors.title").exists())
                .andExpect(jsonPath("$.validationErrors.category").exists())
                .andExpect(jsonPath("$.validationErrors.rating").exists());
    }

    @Test
    @DisplayName("PUT /api/experiences/{id} updates experience successfully")
    void testUpdateExperience() throws Exception {
        Experience existing = new Experience("Old", "Projects", "desc", "loc", LocalDate.now(), 3);
        existing.setId(1L);
        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(Experience.class))).thenAnswer(inv -> inv.getArgument(0));

        String updateJson = """
                {
                    "title": "Updated Hackathon",
                    "category": "Hackathons",
                    "rating": 5
                }
                """;

        mockMvc.perform(put("/api/experiences/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updateJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Hackathon"))
                .andExpect(jsonPath("$.category").value("Hackathons"))
                .andExpect(jsonPath("$.rating").value(5));
    }

    @Test
    @DisplayName("PUT /api/experiences/{id} on non-existent ID returns 404 Not Found")
    void testUpdateNotFound() throws Exception {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        String json = """
                {
                    "title": "Valid Title",
                    "category": "Projects",
                    "rating": 4
                }
                """;

        mockMvc.perform(put("/api/experiences/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @DisplayName("GET /api/experiences/search?query=hackathon returns search results")
    void testSearchEndpoint() throws Exception {
        Experience exp = new Experience("Smart Hackathon", "Hackathons", "desc", "loc", LocalDate.now(), 5);
        exp.setId(1L);
        when(repository.searchByKeyword("hackathon")).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences/search?query=hackathon"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Smart Hackathon"));
    }

    @Test
    @DisplayName("GET /api/experiences/category/{category} returns filtered experiences")
    void testCategoryFilter() throws Exception {
        Experience exp = new Experience("My Internship", "Internships", "desc", "loc", LocalDate.now(), 5);
        exp.setId(1L);
        when(repository.findByCategoryIgnoreCaseOrderByExperienceDateDesc("Internships")).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences/category/Internships"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("My Internship"));
    }

    @Test
    @DisplayName("GET /api/experiences/rating/{rating} returns filtered experiences or 400 for invalid rating")
    void testRatingFilter() throws Exception {
        Experience exp = new Experience("5 Star Hackathon", "Hackathons", "desc", "loc", LocalDate.now(), 5);
        exp.setId(1L);
        when(repository.findByRatingOrderByExperienceDateDesc(5)).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/experiences/rating/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].rating").value(5));

        mockMvc.perform(get("/api/experiences/rating/9"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
