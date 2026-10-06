package com.lifelog.dsa;

import com.lifelog.dsa.linkedlist.CustomLinkedList;
import com.lifelog.dsa.model.ExperienceItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("CustomLinkedList Tests")
class CustomLinkedListTest {

    private CustomLinkedList list;

    @BeforeEach
    void setUp() {
        list = new CustomLinkedList();
    }

    @Test
    @DisplayName("Empty structure - initial state")
    void testEmptyStructure() {
        assertTrue(list.isEmpty());
        assertEquals(0, list.size());
        assertNull(list.searchById(1L));
        assertFalse(list.deleteById(1L));
        assertTrue(list.traverse().isEmpty());
    }

    @Test
    @DisplayName("Single element - insert at beginning and end")
    void testSingleElement() {
        ExperienceItem item = new ExperienceItem(1L, "Hackathon", "Hackathons", LocalDate.now(), 5);
        list.insertAtBeginning(item);

        assertFalse(list.isEmpty());
        assertEquals(1, list.size());
        assertEquals(item, list.searchById(1L));
        assertEquals(1, list.traverse().size());
        assertEquals("Hackathon", list.traverse().get(0).getTitle());

        boolean deleted = list.deleteById(1L);
        assertTrue(deleted);
        assertTrue(list.isEmpty());
        assertEquals(0, list.size());
    }

    @Test
    @DisplayName("Multiple elements - insertion order")
    void testMultipleElements() {
        ExperienceItem item1 = new ExperienceItem(1L, "Item 1", "Projects", LocalDate.now(), 4);
        ExperienceItem item2 = new ExperienceItem(2L, "Item 2", "Internships", LocalDate.now(), 5);
        ExperienceItem item3 = new ExperienceItem(3L, "Item 3", "Workshops", LocalDate.now(), 3);

        list.insertAtEnd(item1);
        list.insertAtEnd(item2);
        list.insertAtEnd(item3);

        assertEquals(3, list.size());
        List<ExperienceItem> items = list.traverse();
        assertEquals(1L, items.get(0).getId());
        assertEquals(2L, items.get(1).getId());
        assertEquals(3L, items.get(2).getId());
    }

    @Test
    @DisplayName("Insert at position - beginning, middle, end, and bounds checking")
    void testInsertAtPosition() {
        ExperienceItem a = new ExperienceItem(10L, "A", "Projects", LocalDate.now(), 4);
        ExperienceItem b = new ExperienceItem(20L, "B", "Projects", LocalDate.now(), 4);
        ExperienceItem c = new ExperienceItem(30L, "C", "Projects", LocalDate.now(), 4);

        list.insertAtPosition(0, a); // At beginning
        list.insertAtPosition(1, c); // At end
        list.insertAtPosition(1, b); // In middle

        assertEquals(3, list.size());
        List<ExperienceItem> items = list.traverse();
        assertEquals(10L, items.get(0).getId());
        assertEquals(20L, items.get(1).getId());
        assertEquals(30L, items.get(2).getId());

        assertThrows(IndexOutOfBoundsException.class, () -> list.insertAtPosition(-1, a));
        assertThrows(IndexOutOfBoundsException.class, () -> list.insertAtPosition(10, a));
    }

    @Test
    @DisplayName("Delete first element")
    void testDeleteFirstElement() {
        list.insertAtEnd(new ExperienceItem(1L, "First", "Projects", LocalDate.now(), 4));
        list.insertAtEnd(new ExperienceItem(2L, "Second", "Projects", LocalDate.now(), 4));
        list.insertAtEnd(new ExperienceItem(3L, "Third", "Projects", LocalDate.now(), 4));

        assertTrue(list.deleteById(1L));
        assertEquals(2, list.size());
        assertEquals(2L, list.traverse().get(0).getId());
    }

    @Test
    @DisplayName("Delete middle element")
    void testDeleteMiddleElement() {
        list.insertAtEnd(new ExperienceItem(1L, "First", "Projects", LocalDate.now(), 4));
        list.insertAtEnd(new ExperienceItem(2L, "Second", "Projects", LocalDate.now(), 4));
        list.insertAtEnd(new ExperienceItem(3L, "Third", "Projects", LocalDate.now(), 4));

        assertTrue(list.deleteById(2L));
        assertEquals(2, list.size());
        assertEquals(1L, list.traverse().get(0).getId());
        assertEquals(3L, list.traverse().get(1).getId());
    }

    @Test
    @DisplayName("Delete last element")
    void testDeleteLastElement() {
        list.insertAtEnd(new ExperienceItem(1L, "First", "Projects", LocalDate.now(), 4));
        list.insertAtEnd(new ExperienceItem(2L, "Second", "Projects", LocalDate.now(), 4));
        list.insertAtEnd(new ExperienceItem(3L, "Third", "Projects", LocalDate.now(), 4));

        assertTrue(list.deleteById(3L));
        assertEquals(2, list.size());
        assertEquals(1L, list.traverse().get(0).getId());
        assertEquals(2L, list.traverse().get(1).getId());
    }

    @Test
    @DisplayName("Invalid search and delete non-existing element")
    void testInvalidSearchAndDelete() {
        list.insertAtEnd(new ExperienceItem(1L, "Item", "Projects", LocalDate.now(), 4));

        assertNull(list.searchById(999L));
        assertNull(list.searchById(null));
        assertFalse(list.deleteById(999L));
        assertFalse(list.deleteById(null));
        assertEquals(1, list.size());
    }

    @Test
    @DisplayName("Clear list")
    void testClear() {
        list.insertAtEnd(new ExperienceItem(1L, "A", "Projects", LocalDate.now(), 4));
        list.insertAtEnd(new ExperienceItem(2L, "B", "Projects", LocalDate.now(), 4));
        list.clear();

        assertTrue(list.isEmpty());
        assertEquals(0, list.size());
        assertNull(list.getHead());
        assertNull(list.getTail());
    }

    @Test
    @DisplayName("Large input sequence")
    void testLargeInput() {
        for (long i = 1; i <= 1000; i++) {
            list.insertAtEnd(new ExperienceItem(i, "Title " + i, "Category", LocalDate.now(), 4));
        }
        assertEquals(1000, list.size());
        assertNotNull(list.searchById(500L));
        assertTrue(list.deleteById(500L));
        assertEquals(999, list.size());
        assertNull(list.searchById(500L));
    }
}
