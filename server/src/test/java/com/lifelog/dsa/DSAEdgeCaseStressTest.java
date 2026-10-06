package com.lifelog.dsa;

import com.lifelog.dsa.bst.ExperienceBST;
import com.lifelog.dsa.linkedlist.CustomLinkedList;
import com.lifelog.dsa.model.ExperienceItem;
import com.lifelog.dsa.priorityqueue.ExperienceMaxHeap;
import com.lifelog.dsa.queue.ExperienceQueue;
import com.lifelog.dsa.stack.ExperienceStack;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Phase 8: Comprehensive DSA Edge Cases & Stress Tests")
class DSAEdgeCaseStressTest {

    // =========================================================================
    // 1. LINKED LIST: STRESS & EDGE CASES
    // =========================================================================

    @Test
    @DisplayName("Linked List - Rapid 500 node insertion, middle deletions, and traversal integrity")
    void testLinkedListStressAndDeletions() {
        CustomLinkedList list = new CustomLinkedList();

        for (long i = 1; i <= 500; i++) {
            list.insertAtEnd(new ExperienceItem(i, "Exp " + i, "Category", LocalDate.now(), 4));
        }
        assertEquals(500, list.size());

        // Delete head
        assertTrue(list.deleteById(1L));
        assertEquals(499, list.size());
        assertEquals(2L, list.getHead().getData().getId());

        // Delete tail
        assertTrue(list.deleteById(500L));
        assertEquals(498, list.size());
        assertNull(list.searchById(500L));

        // Delete 100 middle nodes
        for (long i = 100; i < 200; i++) {
            assertTrue(list.deleteById(i), "Failed deleting node " + i);
        }
        assertEquals(398, list.size());

        // Traversal order verification
        List<ExperienceItem> items = list.traverse();
        assertEquals(398, items.size());
        for (int i = 0; i < items.size() - 1; i++) {
            assertTrue(items.get(i).getId() < items.get(i + 1).getId(),
                    "Nodes should remain strictly ordered");
        }
    }

    // =========================================================================
    // 2. STACK: LIFO STRESS & REVISIT BEHAVIOR
    // =========================================================================

    @Test
    @DisplayName("Stack - High volume push, pop, clear, and LIFO order preservation")
    void testStackStressAndLIFO() {
        ExperienceStack stack = new ExperienceStack();

        for (long i = 1; i <= 1000; i++) {
            stack.push(new ExperienceItem(i, "Item " + i, "Cat", LocalDate.now(), 3));
        }
        assertEquals(1000, stack.size());
        assertFalse(stack.isEmpty());

        // Pop all and verify exact reverse order (LIFO)
        for (long expected = 1000; expected >= 1; expected--) {
            assertEquals(expected, stack.peek().getId());
            ExperienceItem popped = stack.pop();
            assertEquals(expected, popped.getId());
        }

        assertTrue(stack.isEmpty());
        assertEquals(0, stack.size());
        assertThrows(EmptyStackException.class, () -> stack.peek());
        assertThrows(EmptyStackException.class, () -> stack.pop());
    }

    // =========================================================================
    // 3. QUEUE: FIFO STRESS & INTERLEAVED OPERATIONS
    // =========================================================================

    @Test
    @DisplayName("Queue - Interleaved enqueue and dequeue workloads preserve FIFO order")
    void testQueueInterleavedFIFO() {
        ExperienceQueue queue = new ExperienceQueue();

        long enqueueCounter = 1;
        long dequeueCounter = 1;

        // Perform 200 rounds of 3 enqueues followed by 2 dequeues
        for (int round = 0; round < 200; round++) {
            for (int e = 0; e < 3; e++) {
                queue.enqueue(new ExperienceItem(enqueueCounter, "Task " + enqueueCounter, "Pending", LocalDate.now(), 4));
                enqueueCounter++;
            }

            for (int d = 0; d < 2; d++) {
                ExperienceItem item = queue.dequeue();
                assertNotNull(item);
                assertEquals(dequeueCounter, item.getId(), "FIFO order violated");
                dequeueCounter++;
            }
        }

        // Remaining elements should be 200 * (3 - 2) = 200
        assertEquals(200, queue.size());
        while (!queue.isEmpty()) {
            ExperienceItem item = queue.dequeue();
            assertEquals(dequeueCounter++, item.getId());
        }
        assertEquals(0, queue.size());
    }

    // =========================================================================
    // 4. BST: COMPLEX BALANCING, TWO-CHILD SUCCESSOR, & TRAVERSALS
    // =========================================================================

    @Test
    @DisplayName("BST - Inorder successor two-child deletion on complex tree")
    void testBSTComplexDeletionsAndSuccessors() {
        ExperienceBST bst = new ExperienceBST();

        // Build a balanced tree with various subtree structures
        long[] keys = {50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45, 65, 75, 85};
        for (long k : keys) {
            bst.insert(new ExperienceItem(k, "Node " + k, "Cat", LocalDate.now(), 5));
        }

        assertEquals(14, bst.size());

        // 1. Delete leaf node (10)
        assertTrue(bst.delete(10L));
        assertNull(bst.search(10L));
        assertEquals(13, bst.size());

        // 2. Delete one-child node (20 now has only child 25)
        assertTrue(bst.delete(20L));
        assertNull(bst.search(20L));
        assertNotNull(bst.search(25L));
        assertEquals(12, bst.size());

        // 3. Delete two-child node (root 50)
        assertTrue(bst.delete(50L));
        assertNull(bst.search(50L));
        assertEquals(11, bst.size());

        // Inorder traversal must remain strictly sorted
        List<ExperienceItem> inorder = bst.inorderTraversal();
        assertEquals(11, inorder.size());
        for (int i = 0; i < inorder.size() - 1; i++) {
            assertTrue(inorder.get(i).getId() < inorder.get(i + 1).getId(),
                    "BST inorder must remain strictly ascending after deletions");
        }
    }

    // =========================================================================
    // 5. MAX HEAP: PRIORITY ORDERING, TIES, & CAPACITY AUTO-RESIZE
    // =========================================================================

    @Test
    @DisplayName("Max Heap - 200 random priorities extract strictly in non-increasing order")
    void testMaxHeapRandomPriorities() {
        ExperienceMaxHeap heap = new ExperienceMaxHeap();
        Random rng = new Random(42);

        for (long i = 1; i <= 200; i++) {
            int rating = 1 + rng.nextInt(5); // 1 to 5
            heap.insert(new ExperienceItem(i, "Exp " + i, "Cat", LocalDate.now(), rating));
        }

        assertEquals(200, heap.size());

        int prevRating = 5;
        while (!heap.isEmpty()) {
            ExperienceItem max = heap.extractMax();
            assertTrue(max.getRating() <= prevRating,
                    "Heap extracted rating " + max.getRating() + " which exceeds previous " + prevRating);
            prevRating = max.getRating();
        }

        assertEquals(0, heap.size());
    }
}
