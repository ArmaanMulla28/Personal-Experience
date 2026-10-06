package com.lifelog.dsa.stack;

import com.lifelog.dsa.model.ExperienceItem;

/**
 * Node for custom LIFO Stack.
 */
public class StackNode {

    private ExperienceItem data;
    private StackNode next;

    public StackNode(ExperienceItem data) {
        this.data = data;
        this.next = null;
    }

    public StackNode(ExperienceItem data, StackNode next) {
        this.data = data;
        this.next = next;
    }

    public ExperienceItem getData() {
        return data;
    }

    public void setData(ExperienceItem data) {
        this.data = data;
    }

    public StackNode getNext() {
        return next;
    }

    public void setNext(StackNode next) {
        this.next = next;
    }
}
