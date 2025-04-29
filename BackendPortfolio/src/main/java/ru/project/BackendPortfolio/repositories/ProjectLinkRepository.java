package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.ProjectLink;

@Repository
public interface ProjectLinkRepository extends JpaRepository<ProjectLink, Integer> {
}
