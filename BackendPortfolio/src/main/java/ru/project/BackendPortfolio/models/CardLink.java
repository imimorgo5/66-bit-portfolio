package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;

@Entity
@Table(name = "card_link")
public class CardLink {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "card_id", referencedColumnName = "id")
    private Card card;

    @Column(name = "link")
    private String link;

    @Column(name = "description")
    private String description;

    public CardLink() {}

    public CardLink(int id, String link, String description) {
        this.id = id;
        this.link = link;
        this.description = description;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
