package ru.project.BackendPortfolio.models;

import jakarta.persistence.*;

@Entity
@Table(name = "link")
public class Link {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "person_id", referencedColumnName = "id")
    private Person person;

    @Column(name = "link")
    private String link;

    @Column(name = "description")
    private String description;

    public Link(int id, Person person, String link, String description) {
        this.id = id;
        this.person = person;
        this.link = link;
        this.description = description;
    }

    public Link() {}

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Person getPerson() {
        return person;
    }

    public void setPerson(Person person) {
        this.person = person;
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
