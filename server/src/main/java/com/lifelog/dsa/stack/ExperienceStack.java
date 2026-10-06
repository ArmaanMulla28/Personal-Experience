package com.lifelog.dsa.stack;

import com.lifelog.dsa.model.ExperienceItem;
import java.util.ArrayList;
import java.util.EmptyStackException;
import java.util.List;

/**
 * Custom LIFO (Last-In-First-Out) Stack implementation for tracking recently viewed experiences.
 * Node-based design guarantees O(1) push, pop, and peek without capacity constraints.
 */
public class ExperienceStack {

    private StackNode top;
    private int size;

    public ExperienceStack() {
        this.top = null;
        this.size = 0;
    }

    /**
     * Pushes an experience onto the top of the stack in O(1) time.
     */
    public void push(ExperienceItem data) {
        if (data == null) {
            return;
        }
        StackNode newNode = new StackNode(data, top);
        top = newNode;
        size++;
    }

    /**
     * Removes and returns the experience from the top of the stack in O(1) time.
     * Throws EmptyStackException if the stack is empty.
     */
    public ExperienceItem pop() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        ExperienceItem data = top.getData();
        top = top.getNext();
        size--;
        return data;
    }

    /**
     * Returns the experience at the top of the stack without removing it in O(1) time.
     * Throws EmptyStackException if the stack is empty.
     */
    public ExperienceItem peek() {
        if (isEmpty()) {
            throw new EmptyStackException();
        }
        return top.getData();
    }

    /**
     * Checks if the stack contains no elements.
     */
    public boolean isEmpty() {
        return top == null;
    }

    /**
     * Returns the number of experiences currently in the stack.
     */
    public int size() {
        return size;
    }

    /**
     * Clears all elements from the stack.
     */
    public void clear() {
        top = null;
        size = 0;
    }

    /**
     * Returns all elements ordered from most recently viewed (TOP) to oldest.
     */
    public List<ExperienceItem> traverse() {
        List<ExperienceItem> list = new ArrayList<>();
        StackNode current = top;
        while (current != null) {
            if (current.getData() != null) {
                list.add(current.getData());
            }
            current = current.getNext();
        }
        return list;
    }

    public StackNode getTop() {
        return top;
    }
}
