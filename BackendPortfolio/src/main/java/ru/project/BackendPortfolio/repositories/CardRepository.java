package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.Card;
import ru.project.BackendPortfolio.models.Person;

import java.util.List;
import java.util.Optional;

@Repository
public interface CardRepository extends JpaRepository<Card, Integer> {
    List<Card> findByOwner(Person owner);

    Optional<Card> findById(int id);

    Optional<Card> findByShareToken(String token);
}