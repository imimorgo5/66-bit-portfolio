package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.ProjectFile;

@Repository
public interface ProjectFileRepository extends JpaRepository<ProjectFile, Integer> {
}
