package ru.project.BackendPortfolio.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ru.project.BackendPortfolio.models.Folder;

@Repository
public interface FolderRepository extends JpaRepository<Folder, Integer> {
}
