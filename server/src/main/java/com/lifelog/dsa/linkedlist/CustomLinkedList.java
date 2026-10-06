package com.lifelog.dsa.linkedlist;

import com.lifelog.dsa.model.ExperienceItem;
import java.util.ArrayList;
import java.util.List;

/**
 * Custom singly linked list implementation for maintaining experience timelines.
 * Uses head and tail pointers for O(1) insertion at both beginning and end.
 * Search, deletion, and traversal operate in O(n) time.
 */
public class CustomLinkedList {

    private ExperienceNode head;
    private ExperienceNode tail;
    private int size;

    public CustomLinkedList() {
        this.head = null;
        this.tail = null;
        this.size = 0;
    }

    /**
     * Inserts an item at the head of the linked list in O(1) time.
     */
    public void insertAtBeginning(ExperienceItem data) {
        if (data == null) {
            return;
        }
        ExperienceNode newNode = new ExperienceNode(data, head);
        head = newNode;
        if (tail == null) {
            tail = newNode;
        }
        size++;
    }

    /**
     * Inserts an item at the end of the linked list in O(1) time using tail pointer.
     */
    public void insertAtEnd(ExperienceItem data) {
        if (data == null) {
            return;
        }
        ExperienceNode newNode = new ExperienceNode(data);
        if (isEmpty()) {
            head = newNode;
            tail = newNode;
        } else {
            tail.setNext(newNode);
            tail = newNode;
        }
        size++;
    }

    /**
     * Inserts an item at the specified 0-based index.
     * Index 0 inserts at beginning, index == size inserts at end.
     */
    public void insertAtPosition(int index, ExperienceItem data) {
        if (data == null) {
            return;
        }
        if (index < 0 || index > size) {
            throw new IndexOutOfBoundsException("Invalid index " + index + " for size " + size);
        }
        if (index == 0) {
            insertAtBeginning(data);
            return;
        }
        if (index == size) {
            insertAtEnd(data);
            return;
        }

        ExperienceNode prev = head;
        for (int i = 0; i < index - 1; i++) {
            prev = prev.getNext();
        }
        ExperienceNode newNode = new ExperienceNode(data, prev.getNext());
        prev.setNext(newNode);
        size++;
    }

    /**
     * Deletes the first node matching the specified experience ID.
     * Updates head, tail, and size appropriately.
     * Returns true if found and deleted, false otherwise.
     */
    public boolean deleteById(Long id) {
        if (id == null || isEmpty()) {
            return false;
        }

        // Case 1: Head node matches
        if (head.getData() != null && id.equals(head.getData().getId())) {
            head = head.getNext();
            size--;
            if (size == 0) {
                tail = null;
            }
            return true;
        }

        // Case 2: Middle or tail node matches
        ExperienceNode current = head;
        while (current.getNext() != null) {
            if (current.getNext().getData() != null && id.equals(current.getNext().getData().getId())) {
                // If deleting tail, update tail reference
                if (current.getNext() == tail) {
                    tail = current;
                }
                current.setNext(current.getNext().getNext());
                size--;
                return true;
            }
            current = current.getNext();
        }

        return false;
    }

    /**
     * Searches for an experience by its ID in O(n) time.
     * Returns the matching ExperienceItem, or null if not found.
     */
    public ExperienceItem searchById(Long id) {
        if (id == null) {
            return null;
        }
        ExperienceNode current = head;
        while (current != null) {
            if (current.getData() != null && id.equals(current.getData().getId())) {
                return current.getData();
            }
            current = current.getNext();
        }
        return null;
    }

    /**
     * Traverses the list from head to tail and returns an ordered List of ExperienceItems.
     */
    public List<ExperienceItem> traverse() {
        List<ExperienceItem> list = new ArrayList<>();
        ExperienceNode current = head;
        while (current != null) {
            if (current.getData() != null) {
                list.add(current.getData());
            }
            current = current.getNext();
        }
        return list;
    }

    public int size() {
        return size;
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public void clear() {
        head = null;
        tail = null;
        size = 0;
    }

    public ExperienceNode getHead() {
        return head;
    }

    public ExperienceNode getTail() {
        return tail;
    }
}
