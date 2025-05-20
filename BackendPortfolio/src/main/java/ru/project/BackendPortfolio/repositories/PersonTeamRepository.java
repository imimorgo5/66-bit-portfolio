package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.PersonTeam;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonTeamRepository extends JpaRepository<PersonTeam, Integer> {
    List<PersonTeam> findByPerson(Person person);
}
