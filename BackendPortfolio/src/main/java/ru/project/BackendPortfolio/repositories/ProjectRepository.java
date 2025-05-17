package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.Project;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByTeamId(int teamId);

    List<Project> findByOwner(Person person);

    Optional<Project> findById(int id);

    Optional<Project> findByShareToken(String token);
}
