package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.Notification;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.models.Team;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    void deleteAllByTeam(Team team);

    boolean existsByPersonAndTeamAndAcceptedFalseAndReadFalse(Person person, Team team);

    List<Notification> findByTeamAndAcceptedFalseAndReadFalse(Team team);
}
