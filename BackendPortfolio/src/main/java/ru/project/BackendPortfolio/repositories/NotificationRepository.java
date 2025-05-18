package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
}
