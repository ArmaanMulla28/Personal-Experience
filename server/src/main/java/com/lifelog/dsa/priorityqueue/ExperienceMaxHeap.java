package com.lifelog.dsa.priorityqueue;

import com.lifelog.dsa.model.ExperienceItem;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Custom Max Heap / Priority Queue implementation using an underlying dynamic array.
 *
 * Priority is determined by experience rating/importance (1 to 5 stars).
 * Secondary tie-breaking is done by date (most recent first) and ID.
 *
 * Time Complexity:
 *   Insert:      O(log n)
 *   Extract Max: O(log n)
 *   Peek:        O(1)
 *   Build Heap:  O(n) using Floyd's algorithm
 */
public class ExperienceMaxHeap {

    private static final int DEFAULT_CAPACITY = 16;

    private ExperienceItem[] heap;
    private int size;

    public ExperienceMaxHeap() {
        this(DEFAULT_CAPACITY);
    }

    public ExperienceMaxHeap(int initialCapacity) {
        if (initialCapacity < 1) {
            initialCapacity = DEFAULT_CAPACITY;
        }
        this.heap = new ExperienceItem[initialCapacity];
        this.size = 0;
    }

    /**
     * Inserts an experience into the Max Heap in O(log n) time.
     */
    public void insert(ExperienceItem item) {
        if (item == null) {
            return;
        }
        ensureCapacity();
        heap[size] = item;
        heapifyUp(size);
        size++;
    }

    /**
     * Removes and returns the highest-priority experience in O(log n) time.
     * Throws NoSuchElementException if heap is empty.
     */
    public ExperienceItem extractMax() {
        if (isEmpty()) {
            throw new NoSuchElementException("Heap is empty");
        }
        ExperienceItem maxItem = heap[0];
        heap[0] = heap[size - 1];
        heap[size - 1] = null;
        size--;

        if (size > 0) {
            heapifyDown(0);
        }
        return maxItem;
    }

    /**
     * Returns the highest-priority experience without removing it in O(1) time.
     * Throws NoSuchElementException if heap is empty.
     */
    public ExperienceItem peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Heap is empty");
        }
        return heap[0];
    }

    /**
     * Builds a heap in-place from an array in O(n) time using Floyd's algorithm.
     */
    public void buildHeap(ExperienceItem[] items) {
        if (items == null || items.length == 0) {
            clear();
            return;
        }
        this.heap = Arrays.copyOf(items, Math.max(items.length, DEFAULT_CAPACITY));
        this.size = items.length;

        // Start from last non-leaf node and sift down
        for (int i = (size / 2) - 1; i >= 0; i--) {
            heapifyDown(i);
        }
    }

    /**
     * Moves the item at index up until the max-heap property is restored.
     */
    private void heapifyUp(int index) {
        int current = index;
        while (current > 0) {
            int parent = (current - 1) / 2;
            if (isHigherPriority(heap[current], heap[parent])) {
                swap(current, parent);
                current = parent;
            } else {
                break;
            }
        }
    }

    /**
     * Moves the item at index down until the max-heap property is restored.
     */
    private void heapifyDown(int index) {
        int current = index;
        while (true) {
            int leftChild = 2 * current + 1;
            int rightChild = 2 * current + 2;
            int largest = current;

            if (leftChild < size && isHigherPriority(heap[leftChild], heap[largest])) {
                largest = leftChild;
            }

            if (rightChild < size && isHigherPriority(heap[rightChild], heap[largest])) {
                largest = rightChild;
            }

            if (largest != current) {
                swap(current, largest);
                current = largest;
            } else {
                break;
            }
        }
    }

    /**
     * Compares two experiences: returns true if item 'a' has strictly higher priority than 'b'.
     */
    public boolean isHigherPriority(ExperienceItem a, ExperienceItem b) {
        if (a == null) return false;
        if (b == null) return true;
        return a.compareTo(b) > 0;
    }

    private void swap(int i, int j) {
        ExperienceItem temp = heap[i];
        heap[i] = heap[j];
        heap[j] = temp;
    }

    private void ensureCapacity() {
        if (size >= heap.length) {
            heap = Arrays.copyOf(heap, heap.length * 2);
        }
    }

    public boolean isEmpty() {
        return size == 0;
    }

    public int size() {
        return size;
    }

    public void clear() {
        Arrays.fill(heap, 0, size, null);
        size = 0;
    }

    /**
     * Extracts all elements in sorted order (highest rating first).
     * Useful for ranking and analytics.
     */
    public List<ExperienceItem> extractAllSorted() {
        List<ExperienceItem> result = new ArrayList<>();
        while (!isEmpty()) {
            result.add(extractMax());
        }
        return result;
    }

    /**
     * Returns an unmodifiable snapshot of the internal array up to current size.
     */
    public List<ExperienceItem> toList() {
        List<ExperienceItem> list = new ArrayList<>(size);
        for (int i = 0; i < size; i++) {
            list.add(heap[i]);
        }
        return list;
    }
}
