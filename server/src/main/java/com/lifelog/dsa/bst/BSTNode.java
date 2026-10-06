package com.lifelog.dsa.bst;

import com.lifelog.dsa.model.ExperienceItem;

/**
 * Node for Binary Search Tree, ordered by Experience ID.
 */
public class BSTNode {

    private ExperienceItem data;
    private BSTNode left;
    private BSTNode right;

    public BSTNode(ExperienceItem data) {
        this.data = data;
        this.left = null;
        this.right = null;
    }

    public ExperienceItem getData() {
        return data;
    }

    public void setData(ExperienceItem data) {
        this.data = data;
    }

    public BSTNode getLeft() {
        return left;
    }

    public void setLeft(BSTNode left) {
        this.left = left;
    }

    public BSTNode getRight() {
        return right;
    }

    public void setRight(BSTNode right) {
        this.right = right;
    }
}
