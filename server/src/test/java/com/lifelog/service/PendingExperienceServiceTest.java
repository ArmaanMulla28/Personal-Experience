package com.lifelog.service;

import com.lifelog.dsa.model.ExperienceItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("PendingExperienceService Integration Tests")
class PendingExperienceServiceTest {

    private PendingExperienceService service;

    @BeforeEach
    void setUp() {
        service = new PendingExperienceService();
    }

    @Test
    @DisplayName("Enqueue pending maintains FIFO order")
    void testEnqueueAndFifoOrder() {
        ExperienceItem a = new ExperienceItem(1L, "Pending A", "Projects", LocalDate.now(), 4);
        ExperienceItem b = new ExperienceItem(2L, "Pending B", "Hackathons", LocalDate.now(), 5);

        service.enqueuePending(a);
        service.enqueuePending(b);

        assertEquals(2, service.size());
        assertEquals(1L, service.peekNext().getId());

        List<ExperienceItem> all = service.getAllPending();
        assertEquals(1L, all.get(0).getId());
        assertEquals(2L, all.get(1).getId());

        ExperienceItem dequeued = service.dequeueNext();
        assertEquals(1L, dequeued.getId());
        assertEquals(1, service.size());
        assertEquals(2L, service.peekNext().getId());
    }

    @Test
    @DisplayName("Delete pending by ID")
    void testDeletePendingById() {
        ExperienceItem a = new ExperienceItem(10L, "Task A", "Projects", LocalDate.now(), 4);
        ExperienceItem b = new ExperienceItem(20L, "Task B", "Projects", LocalDate.now(), 4);
        ExperienceItem c = new ExperienceItem(30L, "Task C", "Projects", LocalDate.now(), 4);

        service.enqueuePending(a);
        service.enqueuePending(b);
        service.enqueuePending(c);

        assertTrue(service.deletePendingById(20L));
        assertEquals(2, service.size());

        List<ExperienceItem> all = service.getAllPending();
        assertEquals(10L, all.get(0).getId());
        assertEquals(30L, all.get(1).getId());

        assertFalse(service.deletePendingById(999L));
    }
}
