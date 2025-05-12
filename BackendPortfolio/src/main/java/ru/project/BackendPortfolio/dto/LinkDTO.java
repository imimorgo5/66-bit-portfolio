package ru.project.BackendPortfolio.dto;

public class LinkDTO {

    private int id;

    private String link;

    private String description;

    public LinkDTO() {}

    public LinkDTO(int id, String link, String description) {
        this.id = id;
        this.link = link;
        this.description = description;
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
