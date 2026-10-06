package com.lifelog.service;

import com.lifelog.dto.ExperienceRequestDTO;
import com.lifelog.exception.ResourceNotFoundException;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@DisplayName("ExperienceService Complete API Tests")
class ExperienceServiceTest {

    private ExperienceRepository repository;
    private ExperienceService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ExperienceRepository.class);
        service = new ExperienceService(repository);
    }

    @Test
    @DisplayName("Update existing experience")
    void testUpdateExistingExperience() {
        Experience existing = new Experience("Old Title", "Old Cat", "Old Desc", "Old Loc", LocalDate.now(), 3);
        existing.setId(1L);

        when(repository.findById(1L)).thenReturn(Optional.of(existing));
        when(repository.save(any(Experience.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ExperienceRequestDTO updateDTO = new ExperienceRequestDTO(
                "New Title", "New Cat", "New Desc", "New Loc", LocalDate.of(2026, 6, 1), 5
        );

        Experience updated = service.updateExperience(1L, updateDTO);
        assertEquals("New Title", updated.getTitle());
        assertEquals("New Cat", updated.getCategory());
        assertEquals(5, updated.getRating());
        assertEquals("New Loc", updated.getLocation());
    }

    @Test
    @DisplayName("Update non-existing experience throws ResourceNotFoundException")
    void testUpdateNonExistingThrows() {
        when(repository.findById(999L)).thenReturn(Optional.empty());

        ExperienceRequestDTO dto = new ExperienceRequestDTO("T", "C", "D", "L", LocalDate.now(), 4);
        assertThrows(ResourceNotFoundException.class, () -> service.updateExperience(999L, dto));
    }

    @Test
    @DisplayName("Sorting delegation - date, rating, and title")
    void testSortingDelegation() {
        when(repository.findAll(any(Sort.class))).thenReturn(List.of());

        service.getAllExperiences("date", "asc");
        ArgumentCaptor<Sort> sortCaptor = ArgumentCaptor.forClass(Sort.class);
        verify(repository).findAll(sortCaptor.capture());
        Sort sort = sortCaptor.getValue();
        assertNotNull(sort.getOrderFor("experienceDate"));
        assertEquals(Sort.Direction.ASC, sort.getOrderFor("experienceDate").getDirection());

        service.getAllExperiences("rating", "desc");
        verify(repository, times(2)).findAll(sortCaptor.capture());
    }

    @Test
    @DisplayName("Search experiences by keyword")
    void testSearchExperiences() {
        Experience exp = new Experience("Hackathon", "Hackathons", "desc", "loc", LocalDate.now(), 5);
        when(repository.searchByKeyword("hackathon")).thenReturn(List.of(exp));

        List<Experience> results = service.searchExperiences("hackathon");
        assertEquals(1, results.size());
        assertEquals("Hackathon", results.get(0).getTitle());
    }

    @Test
    @DisplayName("Filter experiences by category and rating")
    void testFilterByCategoryAndRating() {
        Experience exp = new Experience("Proj", "Projects", "desc", "loc", LocalDate.now(), 5);
        when(repository.findByCategoryIgnoreCaseOrderByExperienceDateDesc("Projects")).thenReturn(List.of(exp));
        when(repository.findByRatingOrderByExperienceDateDesc(5)).thenReturn(List.of(exp));

        List<Experience> byCat = service.getExperiencesByCategory("Projects");
        assertEquals(1, byCat.size());

        List<Experience> byRating = service.getExperiencesByRating(5);
        assertEquals(1, byRating.size());

        assertThrows(IllegalArgumentException.class, () -> service.getExperiencesByRating(0));
        assertThrows(IllegalArgumentException.class, () -> service.getExperiencesByRating(6));
    }
}
