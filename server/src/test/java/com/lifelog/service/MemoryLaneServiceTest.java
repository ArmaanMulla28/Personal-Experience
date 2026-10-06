package com.lifelog.service;

import com.lifelog.dto.MemoryLaneDTO;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@DisplayName("MemoryLaneService Tests")
class MemoryLaneServiceTest {

    private ExperienceRepository repository;
    private MemoryLaneService service;

    @BeforeEach
    void setUp() {
        repository = Mockito.mock(ExperienceRepository.class);
        service = new MemoryLaneService(repository);
    }

    @Test
    @DisplayName("Empty repository returns empty list")
    void testEmptyMemoryLane() {
        when(repository.findAll()).thenReturn(Collections.emptyList());

        List<MemoryLaneDTO> memories = service.getMemoryLane(LocalDate.of(2026, 10, 6));
        assertNotNull(memories);
        assertTrue(memories.isEmpty());
    }

    @Test
    @DisplayName("Detects exact day anniversary from previous year")
    void testExactDayAnniversary() {
        LocalDate today = LocalDate.of(2026, 10, 6);
        LocalDate oneYearAgo = LocalDate.of(2025, 10, 6);

        Experience anniversaryExp = new Experience(
                "Smart India Hackathon", "Hackathons", "Won grand finale", "Bhopal", oneYearAgo, 5
        );
        anniversaryExp.setId(10L);

        when(repository.findAll()).thenReturn(List.of(anniversaryExp));

        List<MemoryLaneDTO> memories = service.getMemoryLane(today);
        assertFalse(memories.isEmpty());

        MemoryLaneDTO memory = memories.get(0);
        assertEquals(10L, memory.getExperienceId());
        assertEquals("EXACT_DAY_ANNIVERSARY", memory.getMemoryType());
        assertEquals("1 Year Ago Today", memory.getMilestoneLabel());
        assertEquals(1L, memory.getYearsAgo());
        assertEquals("Smart India Hackathon", memory.getTitle());
    }

    @Test
    @DisplayName("Detects genesis experience and standout 5-star flashbacks")
    void testGenesisAndHighlights() {
        LocalDate today = LocalDate.of(2026, 10, 6);
        Experience genesis = new Experience("First Coding Workshop", "Workshops", "Intro to Java", "Campus", LocalDate.of(2024, 1, 15), 4);
        genesis.setId(1L);

        Experience highlight = new Experience("Best Paper Award", "Achievements", "IEEE conference", "Virtual", LocalDate.of(2026, 5, 20), 5);
        highlight.setId(2L);

        when(repository.findAll()).thenReturn(List.of(genesis, highlight));

        List<MemoryLaneDTO> memories = service.getMemoryLane(today);
        assertTrue(memories.size() >= 2);

        boolean hasGenesis = memories.stream().anyMatch(m -> "ORIGIN_MILESTONE".equals(m.getMemoryType()));
        boolean hasHighlight = memories.stream().anyMatch(m -> "STANDOUT_ACHIEVEMENT".equals(m.getMemoryType()));

        assertTrue(hasGenesis, "Should contain origin genesis memory");
        assertTrue(hasHighlight, "Should contain standout 5-star highlight");
    }
}
