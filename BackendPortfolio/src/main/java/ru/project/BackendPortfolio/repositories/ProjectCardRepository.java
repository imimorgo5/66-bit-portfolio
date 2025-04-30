package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.ProjectCard;

@Repository
public interface ProjectCardRepository extends JpaRepository<ProjectCard, Integer> {
}
