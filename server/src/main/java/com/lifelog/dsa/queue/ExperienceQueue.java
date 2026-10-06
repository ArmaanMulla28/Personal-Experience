package com.lifelog.dsa.queue;

import com.lifelog.dsa.model.ExperienceItem;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

/**
 * Custom FIFO (First-In-First-Out) Queue implementation for managing pending experiences.
 * Uses front and rear pointers to guarantee O(1) enqueue and dequeue operations.
 */
public class ExperienceQueue {

    private QueueNode front;
    private QueueNode rear;
    private int size;

    public ExperienceQueue() {
        this.front = null;
        this.rear = null;
        this.size = 0;
    }

    /**
     * Enqueues an experience at the rear of the queue in O(1) time.
     */
    public void enqueue(ExperienceItem data) {
        if (data == null) {
            return;
        }
        QueueNode newNode = new QueueNode(data);
        if (isEmpty()) {
            front = newNode;
            rear = newNode;
        } else {
            rear.setNext(newNode);
            rear = newNode;
        }
        size++;
    }

    /**
     * Dequeues and returns the experience at the front of the queue in O(1) time.
     * Throws NoSuchElementException if queue is empty.
     */
    public ExperienceItem dequeue() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        ExperienceItem data = front.getData();
        front = front.getNext();
        size--;
        if (size == 0) {
            rear = null;
        }
        return data;
    }

    /**
     * Returns the experience at the front of the queue without removing it in O(1) time.
     * Throws NoSuchElementException if queue is empty.
     */
    public ExperienceItem peek() {
        if (isEmpty()) {
            throw new NoSuchElementException("Queue is empty");
        }
        return front.getData();
    }

    /**
     * Checks if the queue is empty.
     */
    public boolean isEmpty() {
        return size == 0;
    }

    /**
     * Returns the number of items in the queue.
     */
    public int size() {
        return size;
    }

    /**
     * Clears all items in the queue.
     */
    public void clear() {
        front = null;
        rear = null;
        size = 0;
    }

    /**
     * Traverses the queue from front to rear and returns an ordered list.
     */
    public List<ExperienceItem> traverse() {
        List<ExperienceItem> list = new ArrayList<>();
        QueueNode current = front;
        while (current != null) {
            if (current.getData() != null) {
                list.add(current.getData());
            }
            current = current.getNext();
        }
        return list;
    }

    public QueueNode getFront() {
        return front;
    }

    public QueueNode getRear() {
        return rear;
    }
}
