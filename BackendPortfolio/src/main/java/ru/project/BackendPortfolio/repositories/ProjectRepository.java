package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.Project;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Integer> {

    List<Project> findByOwner(Person person);

    List<Project> findByTitle(String itemName);
}
