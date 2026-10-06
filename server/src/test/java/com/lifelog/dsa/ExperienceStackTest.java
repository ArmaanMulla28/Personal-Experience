package com.lifelog.dsa;

import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dsa.stack.ExperienceStack;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.EmptyStackException;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ExperienceStack Tests")
class ExperienceStackTest {

    private ExperienceStack stack;

    @BeforeEach
    void setUp() {
        stack = new ExperienceStack();
    }

    @Test
    @DisplayName("Empty stack - initial state and underflow behavior")
    void testEmptyStack() {
        assertTrue(stack.isEmpty());
        assertEquals(0, stack.size());
        assertThrows(EmptyStackException.class, () -> stack.pop());
        assertThrows(EmptyStackException.class, () -> stack.peek());
        assertTrue(stack.traverse().isEmpty());
    }

    @Test
    @DisplayName("Single element push, peek, and pop")
    void testSingleElement() {
        ExperienceItem item = new ExperienceItem(1L, "Internship", "Internships", LocalDate.now(), 5);
        stack.push(item);

        assertFalse(stack.isEmpty());
        assertEquals(1, stack.size());
        assertEquals(item, stack.peek());

        ExperienceItem popped = stack.pop();
        assertEquals(item, popped);
        assertTrue(stack.isEmpty());
        assertEquals(0, stack.size());
    }

    @Test
    @DisplayName("Multiple elements - LIFO ordering")
    void testMultipleElementsLIFO() {
        ExperienceItem item1 = new ExperienceItem(1L, "First", "Category", LocalDate.now(), 3);
        ExperienceItem item2 = new ExperienceItem(2L, "Second", "Category", LocalDate.now(), 4);
        ExperienceItem item3 = new ExperienceItem(3L, "Third", "Category", LocalDate.now(), 5);

        stack.push(item1);
        stack.push(item2);
        stack.push(item3);

        assertEquals(3, stack.size());
        assertEquals(3L, stack.peek().getId());

        List<ExperienceItem> items = stack.traverse();
        assertEquals(3L, items.get(0).getId());
        assertEquals(2L, items.get(1).getId());
        assertEquals(1L, items.get(2).getId());

        assertEquals(3L, stack.pop().getId());
        assertEquals(2L, stack.pop().getId());
        assertEquals(1L, stack.pop().getId());
        assertTrue(stack.isEmpty());
    }

    @Test
    @DisplayName("Push null element is ignored")
    void testPushNull() {
        stack.push(null);
        assertTrue(stack.isEmpty());
        assertEquals(0, stack.size());
    }

    @Test
    @DisplayName("Clear stack")
    void testClear() {
        stack.push(new ExperienceItem(1L, "A", "Category", LocalDate.now(), 4));
        stack.push(new ExperienceItem(2L, "B", "Category", LocalDate.now(), 5));
        stack.clear();

        assertTrue(stack.isEmpty());
        assertEquals(0, stack.size());
        assertThrows(EmptyStackException.class, () -> stack.pop());
    }

    @Test
    @DisplayName("Large input - push and pop integrity")
    void testLargeInput() {
        for (long i = 1; i <= 500; i++) {
            stack.push(new ExperienceItem(i, "Exp " + i, "Category", LocalDate.now(), 4));
        }
        assertEquals(500, stack.size());
        assertEquals(500L, stack.peek().getId());

        for (long i = 500; i >= 1; i--) {
            assertEquals(i, stack.pop().getId());
        }
        assertTrue(stack.isEmpty());
    }
}
