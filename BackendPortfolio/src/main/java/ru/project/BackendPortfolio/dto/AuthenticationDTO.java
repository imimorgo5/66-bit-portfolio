package ru.project.BackendPortfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public class AuthenticationDTO {

    @Email(message = "Введите корректный Email")
    private String email;

    private String password;

    public @Email(message = "Введите корректный Email") String getEmail() {
        return email;
    }

    public void setEmail(@Email(message = "Введите корректный Email") String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
