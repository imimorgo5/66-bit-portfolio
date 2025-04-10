package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "card")
public class Card {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "title")
    @NotEmpty(message = "Название не должно быть пустым")
    private String title;

    @Column(name = "description")
    @NotEmpty(message = "Описание не должно быть пустым")
    private String description;

    @OneToMany(mappedBy = "card")
    private List<CardFile> cardFiles;

    @ElementCollection
    @CollectionTable(name = "card_links", joinColumns = @JoinColumn(name = "card_id"))
    @Column(name = "link")
    private List<String> links = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person owner;

    public Card() {
    }

    public Card(int id, String title, String description, Person owner) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.owner = owner;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public @NotEmpty(message = "Название не должно быть пустым") String getTitle() {
        return title;
    }

    public void setTitle(@NotEmpty(message = "Название не должно быть пустым") String title) {
        this.title = title;
    }

    public @NotEmpty(message = "Описание не должно быть пустым") String getDescription() {
        return description;
    }

    public void setDescription(@NotEmpty(message = "Описание не должно быть пустым") String description) {
        this.description = description;
    }

    public Person getOwner() {
        return owner;
    }

    public void setOwner(Person owner) {
        this.owner = owner;
    }

    public List<String> getLinks() {
        return links;
    }

    public void setLinks(List<String> links) {
        this.links = links;
    }

    public List<CardFile> getCardFiles() {
        return cardFiles;
    }

    public void setCardFiles(List<CardFile> cardFiles) {
        this.cardFiles = cardFiles;
    }
}
