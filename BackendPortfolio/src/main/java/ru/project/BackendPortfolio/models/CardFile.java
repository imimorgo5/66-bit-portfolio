package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;

@Entity
@Table(name = "card_file")
public class CardFile {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "description")
    private String description;

    @Column(name = "file_title")
    private String fileTitle;

    @ManyToOne
    @JoinColumn(name = "card_id", referencedColumnName = "id")
    private Card card;

    public CardFile() {}

    public CardFile(String description, String fileTitle) {
        this.description = description;
        this.fileTitle = fileTitle;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileTitle() {
        return fileTitle;
    }

    public void setFileTitle(String fileTitle) {
        this.fileTitle = fileTitle;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }
}
