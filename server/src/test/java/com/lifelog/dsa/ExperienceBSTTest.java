package com.lifelog.dsa;

import com.lifelog.dsa.bst.ExperienceBST;
import com.lifelog.dsa.model.ExperienceItem;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("ExperienceBST Tests")
class ExperienceBSTTest {

    private ExperienceBST bst;

    @BeforeEach
    void setUp() {
        bst = new ExperienceBST();
    }

    @Test
    @DisplayName("Empty BST - initial state")
    void testEmptyBST() {
        assertTrue(bst.isEmpty());
        assertEquals(0, bst.size());
        assertEquals(0, bst.height());
        assertNull(bst.search(1L));
        assertNull(bst.findMin());
        assertNull(bst.findMax());
        assertFalse(bst.delete(1L));
        assertTrue(bst.inorderTraversal().isEmpty());
    }

    @Test
    @DisplayName("Single element insertion, search, and deletion")
    void testSingleElement() {
        ExperienceItem item = new ExperienceItem(50L, "Central Project", "Projects", LocalDate.now(), 5);
        bst.insert(item);

        assertFalse(bst.isEmpty());
        assertEquals(1, bst.size());
        assertEquals(1, bst.height());
        assertEquals(item, bst.search(50L));
        assertEquals(item, bst.findMin());
        assertEquals(item, bst.findMax());

        assertTrue(bst.delete(50L));
        assertTrue(bst.isEmpty());
        assertEquals(0, bst.size());
        assertNull(bst.search(50L));
    }

    @Test
    @DisplayName("Multiple elements - In-order traversal produces sorted IDs")
    void testInorderTraversalSorted() {
        // Insert values: 50, 25, 75, 10, 40, 60, 90
        long[] ids = {50L, 25L, 75L, 10L, 40L, 60L, 90L};
        for (long id : ids) {
            bst.insert(new ExperienceItem(id, "Exp " + id, "Category", LocalDate.now(), 4));
        }

        assertEquals(7, bst.size());
        assertEquals(3, bst.height());

        List<ExperienceItem> inorder = bst.inorderTraversal();
        assertEquals(7, inorder.size());
        assertEquals(10L, inorder.get(0).getId());
        assertEquals(25L, inorder.get(1).getId());
        assertEquals(40L, inorder.get(2).getId());
        assertEquals(50L, inorder.get(3).getId());
        assertEquals(60L, inorder.get(4).getId());
        assertEquals(75L, inorder.get(5).getId());
        assertEquals(90L, inorder.get(6).getId());

        assertEquals(10L, bst.findMin().getId());
        assertEquals(90L, bst.findMax().getId());
    }

    @Test
    @DisplayName("Pre-order and Post-order traversals")
    void testPreAndPostorderTraversals() {
        long[] ids = {50L, 25L, 75L};
        for (long id : ids) {
            bst.insert(new ExperienceItem(id, "Exp " + id, "Category", LocalDate.now(), 4));
        }

        List<ExperienceItem> preorder = bst.preorderTraversal();
        assertEquals(3, preorder.size());
        assertEquals(50L, preorder.get(0).getId()); // Root first
        assertEquals(25L, preorder.get(1).getId());
        assertEquals(75L, preorder.get(2).getId());

        List<ExperienceItem> postorder = bst.postorderTraversal();
        assertEquals(3, postorder.size());
        assertEquals(25L, postorder.get(0).getId());
        assertEquals(75L, postorder.get(1).getId());
        assertEquals(50L, postorder.get(2).getId()); // Root last
    }

    @Test
    @DisplayName("Duplicate ID insertion updates data without incrementing size")
    void testDuplicateInsertion() {
        bst.insert(new ExperienceItem(10L, "Initial Title", "Projects", LocalDate.now(), 3));
        assertEquals(1, bst.size());

        bst.insert(new ExperienceItem(10L, "Updated Title", "Projects", LocalDate.now(), 5));
        assertEquals(1, bst.size());
        assertEquals("Updated Title", bst.search(10L).getTitle());
        assertEquals(5, bst.search(10L).getRating());
    }

    @Test
    @DisplayName("Delete leaf node (no children)")
    void testDeleteLeafNode() {
        long[] ids = {50L, 25L, 75L, 10L, 40L};
        for (long id : ids) {
            bst.insert(new ExperienceItem(id, "Exp " + id, "Category", LocalDate.now(), 4));
        }

        assertTrue(bst.delete(10L));
        assertEquals(4, bst.size());
        assertNull(bst.search(10L));
    }

    @Test
    @DisplayName("Delete node with one child (left child or right child)")
    void testDeleteNodeWithOneChild() {
        long[] ids = {50L, 25L, 75L, 10L};
        for (long id : ids) {
            bst.insert(new ExperienceItem(id, "Exp " + id, "Category", LocalDate.now(), 4));
        }

        // Node 25 has only left child 10
        assertTrue(bst.delete(25L));
        assertEquals(3, bst.size());
        assertNull(bst.search(25L));
        assertNotNull(bst.search(10L));
        assertEquals(10L, bst.inorderTraversal().get(0).getId());
    }

    @Test
    @DisplayName("Delete node with two children (replaces with in-order successor)")
    void testDeleteNodeWithTwoChildren() {
        long[] ids = {50L, 25L, 75L, 60L, 90L};
        for (long id : ids) {
            bst.insert(new ExperienceItem(id, "Exp " + id, "Category", LocalDate.now(), 4));
        }

        // Node 75 has two children: 60 and 90. Successor is 90 or min of right subtree.
        assertTrue(bst.delete(75L));
        assertEquals(4, bst.size());
        assertNull(bst.search(75L));
        assertNotNull(bst.search(60L));
        assertNotNull(bst.search(90L));

        List<ExperienceItem> inorder = bst.inorderTraversal();
        assertEquals(4, inorder.size());
        assertEquals(25L, inorder.get(0).getId());
        assertEquals(50L, inorder.get(1).getId());
        assertEquals(60L, inorder.get(2).getId());
        assertEquals(90L, inorder.get(3).getId());
    }

    @Test
    @DisplayName("Delete root node with two children")
    void testDeleteRoot() {
        long[] ids = {50L, 25L, 75L};
        for (long id : ids) {
            bst.insert(new ExperienceItem(id, "Exp " + id, "Category", LocalDate.now(), 4));
        }

        assertTrue(bst.delete(50L));
        assertEquals(2, bst.size());
        assertNull(bst.search(50L));
        assertEquals(25L, bst.inorderTraversal().get(0).getId());
        assertEquals(75L, bst.inorderTraversal().get(1).getId());
    }

    @Test
    @DisplayName("Delete non-existent ID")
    void testDeleteNonExistentId() {
        bst.insert(new ExperienceItem(50L, "Exp", "Category", LocalDate.now(), 4));
        assertFalse(bst.delete(999L));
        assertFalse(bst.delete(null));
        assertEquals(1, bst.size());
    }

    @Test
    @DisplayName("Large input - binary search tree insertion and lookup")
    void testLargeInput() {
        for (long i = 1; i <= 300; i++) {
            bst.insert(new ExperienceItem(i, "Title " + i, "Category", LocalDate.now(), 4));
        }
        assertEquals(300, bst.size());
        assertNotNull(bst.search(150L));
        assertTrue(bst.delete(150L));
        assertEquals(299, bst.size());
        assertNull(bst.search(150L));
    }
}
