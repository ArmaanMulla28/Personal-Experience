package com.lifelog.service;

import com.lifelog.dsa.model.ExperienceItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("RecentlyViewedService Integration Tests")
class RecentlyViewedServiceTest {

    private RecentlyViewedService service;

    @BeforeEach
    void setUp() {
        service = new RecentlyViewedService();
    }

    @Test
    @DisplayName("Record view pushes to stack and respects limit")
    void testRecordViewAndLimit() {
        ExperienceItem item1 = new ExperienceItem(1L, "First", "Cat", LocalDate.now(), 4);
        ExperienceItem item2 = new ExperienceItem(2L, "Second", "Cat", LocalDate.now(), 5);
        ExperienceItem item3 = new ExperienceItem(3L, "Third", "Cat", LocalDate.now(), 3);

        service.recordView(item1);
        service.recordView(item2);
        service.recordView(item3);

        assertEquals(3, service.size());

        List<ExperienceItem> top2 = service.getRecentlyViewed(2);
        assertEquals(2, top2.size());
        assertEquals(3L, top2.get(0).getId()); // Most recently viewed at top
        assertEquals(2L, top2.get(1).getId());
    }

    @Test
    @DisplayName("Viewing an existing item brings it to the top of the stack")
    void testRevisitBringsToTop() {
        ExperienceItem item1 = new ExperienceItem(1L, "Item 1", "Cat", LocalDate.now(), 4);
        ExperienceItem item2 = new ExperienceItem(2L, "Item 2", "Cat", LocalDate.now(), 4);

        service.recordView(item1);
        service.recordView(item2);
        service.recordView(item1); // Re-view item 1

        assertEquals(2, service.size());
        List<ExperienceItem> recent = service.getRecentlyViewed(10);
        assertEquals(1L, recent.get(0).getId());
        assertEquals(2L, recent.get(1).getId());
    }

    @Test
    @DisplayName("Clear history empties the stack")
    void testClearHistory() {
        service.recordView(new ExperienceItem(1L, "Item 1", "Cat", LocalDate.now(), 4));
        assertEquals(1, service.size());

        service.clearHistory();
        assertEquals(0, service.size());
        assertTrue(service.getRecentlyViewed(10).isEmpty());
    }
}
