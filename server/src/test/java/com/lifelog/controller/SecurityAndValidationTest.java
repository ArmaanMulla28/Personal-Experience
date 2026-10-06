package com.lifelog.controller;

import com.lifelog.exception.GlobalExceptionHandler;
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

import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@DisplayName("Security, Validation & Error Handling Tests")
class SecurityAndValidationTest {

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
    @DisplayName("Input validation rejects blank title with 400 Bad Request and validationErrors payload")
    void testBlankTitleRejected() throws Exception {
        String invalidPayload = """
                {
                    "title": "",
                    "category": "Projects",
                    "rating": 5
                }
                """;

        mockMvc.perform(post("/api/experiences")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Input validation failed"))
                .andExpect(jsonPath("$.validationErrors.title").exists());
    }

    @Test
    @DisplayName("Input validation rejects out-of-range rating (> 5) with 400 Bad Request")
    void testInvalidRatingRejected() throws Exception {
        String invalidPayload = """
                {
                    "title": "Valid Title",
                    "category": "Projects",
                    "rating": 10
                }
                """;

        mockMvc.perform(post("/api/experiences")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.validationErrors.rating").exists());
    }

    @Test
    @DisplayName("GET non-existing ID returns 404 Not Found")
    void testNonExistingIdReturns404() throws Exception {
        when(repository.findById(9999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/experiences/9999"))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("Updating non-existing experience throws ResourceNotFoundException returning 404 with ErrorResponseDTO")
    void testUpdateNonExistingThrows404() throws Exception {
        when(repository.findById(9999L)).thenReturn(Optional.empty());

        String updatePayload = """
                {
                    "title": "Update Title",
                    "category": "Projects",
                    "rating": 4
                }
                """;

        mockMvc.perform(put("/api/experiences/9999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatePayload))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Experience not found with id: 9999"));
    }

    @Test
    @DisplayName("Type mismatch on non-numeric ID path variable returns 400 Bad Request")
    void testTypeMismatchReturns400() throws Exception {
        mockMvc.perform(get("/api/experiences/invalid-numeric-id"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Parameter 'id' should be of type Long"));
    }
}
