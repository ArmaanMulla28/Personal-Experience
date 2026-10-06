package com.lifelog.dsa;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dsa.priorityqueue.ExperienceMaxHeap;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ExperienceMaxHeap Tests")
class ExperienceMaxHeapTest {

    private ExperienceMaxHeap heap;

    @BeforeEach
    void setUp() {
        heap = new ExperienceMaxHeap();
    }

    @Test
    @DisplayName("Empty heap - initial state and underflow behavior")
    void testEmptyHeap() {
        assertTrue(heap.isEmpty());
        assertEquals(0, heap.size());
        assertThrows(NoSuchElementException.class, () -> heap.peek());
        assertThrows(NoSuchElementException.class, () -> heap.extractMax());
        assertTrue(heap.toList().isEmpty());
    }

    @Test
    @DisplayName("Single element insertion, peek, and extractMax")
    void testSingleElement() {
        ExperienceItem item = new ExperienceItem(1L, "Hackathon", "Hackathons", LocalDate.now(), 5);
        heap.insert(item);

        assertFalse(heap.isEmpty());
        assertEquals(1, heap.size());
        assertEquals(item, heap.peek());

        ExperienceItem extracted = heap.extractMax();
        assertEquals(item, extracted);
        assertTrue(heap.isEmpty());
        assertEquals(0, heap.size());
    }

    @Test
    @DisplayName("Multiple elements - extracts in descending order of rating/importance")
    void testMultipleElementsPriority() {
        ExperienceItem item1 = new ExperienceItem(1L, "Workshop", "Workshops", LocalDate.of(2026, 1, 1), 3);
        ExperienceItem item2 = new ExperienceItem(2L, "Hackathon", "Hackathons", LocalDate.of(2026, 2, 1), 5);
        ExperienceItem item3 = new ExperienceItem(3L, "Internship", "Internships", LocalDate.of(2026, 3, 1), 4);
        ExperienceItem item4 = new ExperienceItem(4L, "Milestone", "Personal", LocalDate.of(2026, 4, 1), 2);

        heap.insert(item1);
        heap.insert(item2);
        heap.insert(item3);
        heap.insert(item4);

        assertEquals(4, heap.size());
        assertEquals(5, heap.peek().getEffectiveRating());

        List<ExperienceItem> sorted = heap.extractAllSorted();
        assertEquals(4, sorted.size());
        assertEquals(5, sorted.get(0).getEffectiveRating()); // Hackathon
        assertEquals(4, sorted.get(1).getEffectiveRating()); // Internship
        assertEquals(3, sorted.get(2).getEffectiveRating()); // Workshop
        assertEquals(2, sorted.get(3).getEffectiveRating()); // Milestone
        assertTrue(heap.isEmpty());
    }

    @Test
    @DisplayName("Duplicate ratings - tie broken by date or id")
    void testDuplicateRatingsTieBreak() {
        ExperienceItem older5 = new ExperienceItem(1L, "Older 5-star", "Category", LocalDate.of(2025, 1, 1), 5);
        ExperienceItem newer5 = new ExperienceItem(2L, "Newer 5-star", "Category", LocalDate.of(2026, 1, 1), 5);

        heap.insert(older5);
        heap.insert(newer5);

        ExperienceItem first = heap.extractMax();
        ExperienceItem second = heap.extractMax();

        // Newer date has higher priority among equal ratings
        assertEquals(2L, first.getId());
        assertEquals(1L, second.getId());
    }

    @Test
    @DisplayName("Build heap from array (Floyd's algorithm)")
    void testBuildHeap() {
        ExperienceItem[] items = new ExperienceItem[] {
                new ExperienceItem(1L, "A", "Category", LocalDate.now(), 2),
                new ExperienceItem(2L, "B", "Category", LocalDate.now(), 5),
                new ExperienceItem(3L, "C", "Category", LocalDate.now(), 4),
                new ExperienceItem(4L, "D", "Category", LocalDate.now(), 1),
                new ExperienceItem(5L, "E", "Category", LocalDate.now(), 3),
        };

        heap.buildHeap(items);
        assertEquals(5, heap.size());
        assertEquals(5, heap.peek().getEffectiveRating());

        List<ExperienceItem> sorted = heap.extractAllSorted();
        assertEquals(5, sorted.get(0).getEffectiveRating());
        assertEquals(4, sorted.get(1).getEffectiveRating());
        assertEquals(3, sorted.get(2).getEffectiveRating());
        assertEquals(2, sorted.get(3).getEffectiveRating());
        assertEquals(1, sorted.get(4).getEffectiveRating());
    }

    @Test
    @DisplayName("Dynamic array capacity expansion (overflow prevention)")
    void testDynamicResizing() {
        ExperienceMaxHeap smallHeap = new ExperienceMaxHeap(4);
        for (long i = 1; i <= 50; i++) {
            int rating = (int) ((i % 5) + 1); // ratings 1 to 5
            smallHeap.insert(new ExperienceItem(i, "Exp " + i, "Category", LocalDate.now(), rating));
        }

        assertEquals(50, smallHeap.size());
        assertEquals(5, smallHeap.peek().getEffectiveRating());

        int prevRating = 6;
        while (!smallHeap.isEmpty()) {
            ExperienceItem item = smallHeap.extractMax();
            assertTrue(item.getEffectiveRating() <= prevRating, "Ratings must be non-increasing");
            prevRating = item.getEffectiveRating();
        }
        assertEquals(0, smallHeap.size());
    }

    @Test
    @DisplayName("Clear heap")
    void testClear() {
        heap.insert(new ExperienceItem(1L, "A", "Category", LocalDate.now(), 4));
        heap.insert(new ExperienceItem(2L, "B", "Category", LocalDate.now(), 5));
        heap.clear();

        assertTrue(heap.isEmpty());
        assertEquals(0, heap.size());
        assertThrows(NoSuchElementException.class, () -> heap.extractMax());
    }
}
