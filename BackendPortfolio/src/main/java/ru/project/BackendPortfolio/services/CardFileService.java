package ru.project.BackendPortfolio.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.project.BackendPortfolio.dto.CardFileDTO;
import ru.project.BackendPortfolio.models.Card;
import ru.project.BackendPortfolio.models.CardFile;
import ru.project.BackendPortfolio.repositories.CardFileRepository;

import java.util.List;


@Service
public class CardFileService {

    private final CardFileRepository cardFileRepository;
    private final FileStorageService fileStorageService;

    @Autowired
    public CardFileService(CardFileRepository cardFileRepository, FileStorageService fileStorageService) {
        this.cardFileRepository = cardFileRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public CardFile create(CardFileDTO cardFileDTO, Card card) {
        var file = cardFileDTO.getFile();
        var fileTitle = fileStorageService.save(file);
        var description = cardFileDTO.getDescription();
        var cardFile = new CardFile();
        cardFile.setDescription(description);
        cardFile.setFileTitle(fileTitle);
        cardFile.setCard(card);
        return cardFileRepository.save(cardFile);
    }

    @Transactional
    public void update(Card card, List<CardFileDTO> newCardFileDTOs) {
        var existingFiles = cardFileRepository.findByCard(card);
        for (CardFile existingFile : existingFiles) {
            fileStorageService.delete(existingFile.getFileTitle());
            cardFileRepository.delete(existingFile);
        }

        if (newCardFileDTOs != null) {
            for (CardFileDTO cardFileDTO : newCardFileDTOs) {
                create(cardFileDTO, card);
            }
        }
    }

    @Transactional
    public void delete(CardFile cardFile) {
        fileStorageService.delete(cardFile.getFileTitle());
        cardFileRepository.delete(cardFile);
    }
}
