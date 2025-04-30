package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.PersonTeam;

@Repository
public interface PersonTeamRepository extends JpaRepository<PersonTeam, Integer> {
}
