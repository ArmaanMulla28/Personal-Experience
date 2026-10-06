package com.lifelog.service;

import com.lifelog.dto.ExperienceRequestDTO;
import com.lifelog.exception.ResourceNotFoundException;
import com.lifelog.model.Experience;
import com.lifelog.repository.ExperienceRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ExperienceService {

    private final ExperienceRepository experienceRepository;

    public ExperienceService(ExperienceRepository experienceRepository) {
        this.experienceRepository = experienceRepository;
    }

    /**
     * Retrieves all experiences with optional sorting by date or rating.
     */
    @Transactional(readOnly = true)
    public List<Experience> getAllExperiences(String sortBy, String direction) {
        Sort.Direction sortDirection = "asc".equalsIgnoreCase(direction) ? Sort.Direction.ASC : Sort.Direction.DESC;

        if ("date".equalsIgnoreCase(sortBy)) {
            return experienceRepository.findAll(Sort.by(sortDirection, "experienceDate"));
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            return experienceRepository.findAll(Sort.by(sortDirection, "rating"));
        } else if ("title".equalsIgnoreCase(sortBy)) {
            return experienceRepository.findAll(Sort.by(sortDirection, "title"));
        }

        // Default sorting: created_at descending
        return experienceRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional(readOnly = true)
    public List<Experience> getAllExperiences() {
        return getAllExperiences(null, null);
    }

    @Transactional(readOnly = true)
    public Optional<Experience> getExperienceById(Long id) {
        return experienceRepository.findById(id);
    }

    @Transactional
    public Experience createExperience(ExperienceRequestDTO dto) {
        Experience experience = new Experience(
                dto.getTitle(),
                dto.getCategory(),
                dto.getDescription(),
                dto.getLocation(),
                dto.getExperienceDate(),
                dto.getRating()
        );
        return experienceRepository.save(experience);
    }

    /**
     * Updates an existing experience by ID.
     */
    @Transactional
    public Experience updateExperience(Long id, ExperienceRequestDTO dto) {
        Experience existing = experienceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Experience not found with id: " + id));

        existing.setTitle(dto.getTitle());
        existing.setCategory(dto.getCategory());
        existing.setDescription(dto.getDescription());
        existing.setLocation(dto.getLocation());
        existing.setExperienceDate(dto.getExperienceDate());
        existing.setRating(dto.getRating());

        return experienceRepository.save(existing);
    }

    @Transactional
    public boolean deleteExperience(Long id) {
        if (experienceRepository.existsById(id)) {
            experienceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    /**
     * Searches experiences by keyword in title, category, description, or location.
     */
    @Transactional(readOnly = true)
    public List<Experience> searchExperiences(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllExperiences();
        }
        return experienceRepository.searchByKeyword(query.trim());
    }

    /**
     * Filters experiences by category.
     */
    @Transactional(readOnly = true)
    public List<Experience> getExperiencesByCategory(String category) {
        if (category == null || category.trim().isEmpty() || "all".equalsIgnoreCase(category)) {
            return getAllExperiences();
        }
        return experienceRepository.findByCategoryIgnoreCaseOrderByExperienceDateDesc(category.trim());
    }

    /**
     * Filters experiences by star rating.
     */
    @Transactional(readOnly = true)
    public List<Experience> getExperiencesByRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating filter must be between 1 and 5");
        }
        return experienceRepository.findByRatingOrderByExperienceDateDesc(rating);
    }
}
