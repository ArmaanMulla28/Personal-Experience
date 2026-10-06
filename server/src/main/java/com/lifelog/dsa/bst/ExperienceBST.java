package com.lifelog.dsa.bst;

import com.lifelog.dsa.model.ExperienceItem;
import java.util.ArrayList;
import java.util.List;

/**
 * Custom Binary Search Tree implementation for fast numeric ID-based lookup.
 *
 * Primary Key: Experience ID (Long)
 * Time Complexity:
 *   Average: Insert O(log n), Search O(log n), Delete O(log n)
 *   Worst (skewed tree): O(n)
 */
public class ExperienceBST {

    private BSTNode root;
    private int size;

    public ExperienceBST() {
        this.root = null;
        this.size = 0;
    }

    /**
     * Inserts an experience into the BST ordered by ID.
     * If an experience with the same ID exists, its data is updated.
     */
    public void insert(ExperienceItem data) {
        if (data == null || data.getId() == null) {
            return;
        }
        int initialSize = size;
        root = insertRecursive(root, data);
    }

    private BSTNode insertRecursive(BSTNode current, ExperienceItem data) {
        if (current == null) {
            size++;
            return new BSTNode(data);
        }

        long newId = data.getId();
        long currentId = current.getData().getId();

        if (newId < currentId) {
            current.setLeft(insertRecursive(current.getLeft(), data));
        } else if (newId > currentId) {
            current.setRight(insertRecursive(current.getRight(), data));
        } else {
            // Duplicate ID: update existing record without incrementing size
            current.setData(data);
        }
        return current;
    }

    /**
     * Searches for an experience by its ID in average O(log n) time.
     * Returns matching ExperienceItem, or null if not found.
     */
    public ExperienceItem search(Long id) {
        if (id == null || root == null) {
            return null;
        }
        BSTNode resultNode = searchRecursive(root, id);
        return resultNode != null ? resultNode.getData() : null;
    }

    private BSTNode searchRecursive(BSTNode current, long targetId) {
        if (current == null || current.getData() == null) {
            return null;
        }
        long currentId = current.getData().getId();
        if (targetId == currentId) {
            return current;
        }
        if (targetId < currentId) {
            return searchRecursive(current.getLeft(), targetId);
        }
        return searchRecursive(current.getRight(), targetId);
    }

    /**
     * Deletes an experience by its ID.
     * Handles 3 cases: leaf node, single-child node, and two-children node.
     * Returns true if deleted, false if ID not found.
     */
    public boolean delete(Long id) {
        if (id == null || root == null) {
            return false;
        }
        int oldSize = size;
        root = deleteRecursive(root, id);
        return size < oldSize;
    }

    private BSTNode deleteRecursive(BSTNode current, long targetId) {
        if (current == null || current.getData() == null) {
            return null;
        }

        long currentId = current.getData().getId();
        if (targetId < currentId) {
            current.setLeft(deleteRecursive(current.getLeft(), targetId));
            return current;
        } else if (targetId > currentId) {
            current.setRight(deleteRecursive(current.getRight(), targetId));
            return current;
        }

        // Node to delete found:
        size--;

        // Case 1 & 2: Node has 0 or 1 child
        if (current.getLeft() == null) {
            return current.getRight();
        } else if (current.getRight() == null) {
            return current.getLeft();
        }

        // Case 3: Node has 2 children
        // Find in-order successor (minimum value in right subtree)
        BSTNode successor = findMinNode(current.getRight());
        current.setData(successor.getData());

        // Increment size back temporarily because deleting the successor will decrement it
        size++;
        current.setRight(deleteRecursive(current.getRight(), successor.getData().getId()));
        return current;
    }

    private BSTNode findMinNode(BSTNode node) {
        BSTNode current = node;
        while (current != null && current.getLeft() != null) {
            current = current.getLeft();
        }
        return current;
    }

    private BSTNode findMaxNode(BSTNode node) {
        BSTNode current = node;
        while (current != null && current.getRight() != null) {
            current = current.getRight();
        }
        return current;
    }

    /**
     * Returns the experience with the minimum ID in the tree.
     */
    public ExperienceItem findMin() {
        if (root == null) {
            return null;
        }
        BSTNode minNode = findMinNode(root);
        return minNode != null ? minNode.getData() : null;
    }

    /**
     * Returns the experience with the maximum ID in the tree.
     */
    public ExperienceItem findMax() {
        if (root == null) {
            return null;
        }
        BSTNode maxNode = findMaxNode(root);
        return maxNode != null ? maxNode.getData() : null;
    }

    /**
     * Performs In-Order traversal (Left -> Node -> Right).
     * Returns a list sorted ascending by ID.
     */
    public List<ExperienceItem> inorderTraversal() {
        List<ExperienceItem> list = new ArrayList<>();
        inorderHelper(root, list);
        return list;
    }

    private void inorderHelper(BSTNode node, List<ExperienceItem> list) {
        if (node != null) {
            inorderHelper(node.getLeft(), list);
            if (node.getData() != null) {
                list.add(node.getData());
            }
            inorderHelper(node.getRight(), list);
        }
    }

    /**
     * Performs Pre-Order traversal (Node -> Left -> Right).
     */
    public List<ExperienceItem> preorderTraversal() {
        List<ExperienceItem> list = new ArrayList<>();
        preorderHelper(root, list);
        return list;
    }

    private void preorderHelper(BSTNode node, List<ExperienceItem> list) {
        if (node != null) {
            if (node.getData() != null) {
                list.add(node.getData());
            }
            preorderHelper(node.getLeft(), list);
            preorderHelper(node.getRight(), list);
        }
    }

    /**
     * Performs Post-Order traversal (Left -> Right -> Node).
     */
    public List<ExperienceItem> postorderTraversal() {
        List<ExperienceItem> list = new ArrayList<>();
        postorderHelper(root, list);
        return list;
    }

    private void postorderHelper(BSTNode node, List<ExperienceItem> list) {
        if (node != null) {
            postorderHelper(node.getLeft(), list);
            postorderHelper(node.getRight(), list);
            if (node.getData() != null) {
                list.add(node.getData());
            }
        }
    }

    /**
     * Computes the height of the tree (0 for empty tree, 1 for single node).
     */
    public int height() {
        return heightRecursive(root);
    }

    private int heightRecursive(BSTNode node) {
        if (node == null) {
            return 0;
        }
        int leftH = heightRecursive(node.getLeft());
        int rightH = heightRecursive(node.getRight());
        return 1 + Math.max(leftH, rightH);
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public void clear() {
        root = null;
        size = 0;
    }

    public BSTNode getRoot() {
        return root;
    }
}
