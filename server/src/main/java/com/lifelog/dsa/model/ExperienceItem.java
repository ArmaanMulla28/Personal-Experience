package com.lifelog.dsa.model;

import com.lifelog.model.Experience;
import java.time.LocalDate;
import java.util.Objects;

/**
 * Lightweight, DSA-friendly model representing an experience.
 * Decoupled from JPA entities so custom DSA classes can operate
 * independently in memory.
 */
public class ExperienceItem implements Comparable<ExperienceItem> {

    private Long id;
    private String title;
    private String category;
    private String description;
    private String location;
    private LocalDate date;
    private Integer rating;
    private Integer importance;

    public ExperienceItem() {
    }

    public ExperienceItem(Long id, String title, String category, LocalDate date, Integer rating) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.date = date;
        this.rating = rating;
        this.importance = rating != null ? rating : 1;
    }

    public ExperienceItem(Long id, String title, String category, LocalDate date, Integer rating, Integer importance) {
        this.id = id;
        this.title = title;
        this.category = category;
        this.date = date;
        this.rating = rating;
        this.importance = importance != null ? importance : (rating != null ? rating : 1);
    }

    public static ExperienceItem fromEntity(Experience exp) {
        if (exp == null) {
            return null;
        }
        ExperienceItem item = new ExperienceItem(
                exp.getId(),
                exp.getTitle(),
                exp.getCategory(),
                exp.getExperienceDate(),
                exp.getRating(),
                exp.getRating()
        );
        item.setDescription(exp.getDescription());
        item.setLocation(exp.getLocation());
        return item;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
        if (this.importance == null) {
            this.importance = rating;
        }
    }

    public Integer getImportance() {
        return importance;
    }

    public void setImportance(Integer importance) {
        this.importance = importance;
    }

    public int getEffectiveRating() {
        return rating != null ? rating : 0;
    }

    public int getEffectiveImportance() {
        return importance != null ? importance : (rating != null ? rating : 0);
    }

    /**
     * Natural ordering for Priority / Max Heap sorting:
     * Higher importance/rating comes first, tie-break by date descending, then ID.
     */
    @Override
    public int compareTo(ExperienceItem other) {
        if (other == null) {
            return 1;
        }
        int cmp = Integer.compare(this.getEffectiveImportance(), other.getEffectiveImportance());
        if (cmp != 0) {
            return cmp;
        }
        if (this.date != null && other.date != null) {
            int dateCmp = this.date.compareTo(other.date);
            if (dateCmp != 0) {
                return dateCmp;
            }
        }
        if (this.id != null && other.id != null) {
            return this.id.compareTo(other.id);
        }
        return 0;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ExperienceItem that = (ExperienceItem) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ExperienceItem{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", category='" + category + '\'' +
                ", date=" + date +
                ", rating=" + rating +
                ", importance=" + importance +
                '}';
    }
}
