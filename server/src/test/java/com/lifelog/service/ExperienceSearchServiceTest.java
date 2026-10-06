package com.lifelog.service;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@DisplayName("ExperienceSearchService Integration Tests")
class ExperienceSearchServiceTest {

    private ExperienceRepository repository;
    private ExperienceSearchService searchService;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ExperienceRepository.class);
        searchService = new ExperienceSearchService(repository);
    }

    @Test
    @DisplayName("Search by ID utilizes BST index")
    void testSearchById() {
        Experience e1 = new Experience("Hackathon", "Hackathons", "desc", "loc", LocalDate.now(), 5);
        e1.setId(50L);
        Experience e2 = new Experience("Internship", "Internships", "desc", "loc", LocalDate.now(), 4);
        e2.setId(25L);

        when(repository.findAll()).thenReturn(Arrays.asList(e1, e2));
        when(repository.findById(50L)).thenReturn(Optional.of(e1));

        searchService.reindex();

        ExperienceItem found = searchService.searchById(50L);
        assertNotNull(found);
        assertEquals(50L, found.getId());
        assertEquals("Hackathon", found.getTitle());

        ExperienceItem found25 = searchService.searchById(25L);
        assertNotNull(found25);
        assertEquals(25L, found25.getId());

        assertNull(searchService.searchById(999L));
    }

    @Test
    @DisplayName("BST Inorder traversal returns sorted IDs")
    void testInorderTraversalSorted() {
        Experience e1 = new Experience("P3", "Projects", "desc", "loc", LocalDate.now(), 4);
        e1.setId(75L);
        Experience e2 = new Experience("P1", "Projects", "desc", "loc", LocalDate.now(), 4);
        e2.setId(25L);
        Experience e3 = new Experience("P2", "Projects", "desc", "loc", LocalDate.now(), 4);
        e3.setId(50L);

        when(repository.findAll()).thenReturn(Arrays.asList(e1, e2, e3));

        List<ExperienceItem> inorder = searchService.getInorderList();
        assertEquals(3, inorder.size());
        assertEquals(25L, inorder.get(0).getId());
        assertEquals(50L, inorder.get(1).getId());
        assertEquals(75L, inorder.get(2).getId());
    }

    @Test
    @DisplayName("BST stats calculation")
    void testBSTStats() {
        Experience e1 = new Experience("P1", "Projects", "desc", "loc", LocalDate.now(), 4);
        e1.setId(50L);
        Experience e2 = new Experience("P2", "Projects", "desc", "loc", LocalDate.now(), 4);
        e2.setId(25L);

        when(repository.findAll()).thenReturn(Arrays.asList(e1, e2));

        Map<String, Object> stats = searchService.getBSTStats();
        assertEquals(2, stats.get("size"));
        assertEquals(25L, stats.get("minId"));
        assertEquals(50L, stats.get("maxId"));
        assertFalse((Boolean) stats.get("isEmpty"));
    }
}
