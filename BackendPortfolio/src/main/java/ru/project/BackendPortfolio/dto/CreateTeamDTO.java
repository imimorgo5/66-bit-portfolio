package ru.project.BackendPortfolio.dto;

import java.util.List;

public class CreateTeamDTO {

    private String title;

    private List<String> emails;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<String> getEmails() {
        return emails;
    }

    public void setEmails(List<String> emails) {
        this.emails = emails;
    }
}
