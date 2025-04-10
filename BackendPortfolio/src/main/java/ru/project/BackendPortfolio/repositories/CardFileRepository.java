package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.Card;
import ru.project.BackendPortfolio.models.CardFile;

import java.util.List;

@Repository
public interface CardFileRepository extends JpaRepository<CardFile, Long> {
    List<CardFile> findByCard(Card card);
}