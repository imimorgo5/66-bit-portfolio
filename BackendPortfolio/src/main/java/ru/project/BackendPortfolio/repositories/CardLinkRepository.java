package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.CardLink;

@Repository
public interface CardLinkRepository extends JpaRepository<CardLink, Integer> {
}
