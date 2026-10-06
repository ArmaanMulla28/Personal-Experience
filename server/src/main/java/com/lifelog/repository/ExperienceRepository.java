package com.lifelog.repository;

import com.lifelog.model.Experience;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperienceRepository extends JpaRepository<Experience, Long> {

    List<Experience> findAllByOrderByCreatedAtDesc();

    List<Experience> findByCategoryIgnoreCaseOrderByExperienceDateDesc(String category);

    List<Experience> findByRatingOrderByExperienceDateDesc(Integer rating);

    @Query("SELECT e FROM Experience e WHERE " +
           "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(e.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(e.description, '')) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(COALESCE(e.location, '')) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY e.experienceDate DESC NULLS LAST")
    List<Experience> searchByKeyword(@Param("query") String query);
}
