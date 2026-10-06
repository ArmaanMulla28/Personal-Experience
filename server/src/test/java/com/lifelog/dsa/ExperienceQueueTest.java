package com.lifelog.dsa;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dsa.queue.ExperienceQueue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ExperienceQueue Tests")
class ExperienceQueueTest {

    private ExperienceQueue queue;

    @BeforeEach
    void setUp() {
        queue = new ExperienceQueue();
    }

    @Test
    @DisplayName("Empty queue - initial state and underflow behavior")
    void testEmptyQueue() {
        assertTrue(queue.isEmpty());
        assertEquals(0, queue.size());
        assertThrows(NoSuchElementException.class, () -> queue.dequeue());
        assertThrows(NoSuchElementException.class, () -> queue.peek());
        assertTrue(queue.traverse().isEmpty());
    }

    @Test
    @DisplayName("Single element enqueue, peek, and dequeue")
    void testSingleElement() {
        ExperienceItem item = new ExperienceItem(1L, "College Event", "College events", LocalDate.now(), 4);
        queue.enqueue(item);

        assertFalse(queue.isEmpty());
        assertEquals(1, queue.size());
        assertEquals(item, queue.peek());

        ExperienceItem dequeued = queue.dequeue();
        assertEquals(item, dequeued);
        assertTrue(queue.isEmpty());
        assertEquals(0, queue.size());
    }

    @Test
    @DisplayName("Multiple elements - FIFO ordering")
    void testMultipleElementsFIFO() {
        ExperienceItem item1 = new ExperienceItem(1L, "First", "Category", LocalDate.now(), 3);
        ExperienceItem item2 = new ExperienceItem(2L, "Second", "Category", LocalDate.now(), 4);
        ExperienceItem item3 = new ExperienceItem(3L, "Third", "Category", LocalDate.now(), 5);

        queue.enqueue(item1);
        queue.enqueue(item2);
        queue.enqueue(item3);

        assertEquals(3, queue.size());
        assertEquals(1L, queue.peek().getId());

        List<ExperienceItem> items = queue.traverse();
        assertEquals(1L, items.get(0).getId());
        assertEquals(2L, items.get(1).getId());
        assertEquals(3L, items.get(2).getId());

        assertEquals(1L, queue.dequeue().getId());
        assertEquals(2L, queue.dequeue().getId());
        assertEquals(3L, queue.dequeue().getId());
        assertTrue(queue.isEmpty());
    }

    @Test
    @DisplayName("Enqueue null item is ignored")
    void testEnqueueNull() {
        queue.enqueue(null);
        assertTrue(queue.isEmpty());
        assertEquals(0, queue.size());
    }

    @Test
    @DisplayName("Clear queue")
    void testClear() {
        queue.enqueue(new ExperienceItem(1L, "A", "Category", LocalDate.now(), 4));
        queue.enqueue(new ExperienceItem(2L, "B", "Category", LocalDate.now(), 5));
        queue.clear();

        assertTrue(queue.isEmpty());
        assertEquals(0, queue.size());
        assertThrows(NoSuchElementException.class, () -> queue.dequeue());
    }

    @Test
    @DisplayName("Large input - enqueue and dequeue integrity")
    void testLargeInput() {
        for (long i = 1; i <= 500; i++) {
            queue.enqueue(new ExperienceItem(i, "Pending " + i, "Category", LocalDate.now(), 4));
        }
        assertEquals(500, queue.size());
        assertEquals(1L, queue.peek().getId());

        for (long i = 1; i <= 500; i++) {
            assertEquals(i, queue.dequeue().getId());
        }
        assertTrue(queue.isEmpty());
    }
}
