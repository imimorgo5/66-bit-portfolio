package ru.project.BackendPortfolio.dto;

import jakarta.validation.constraints.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationDTO {

    @Email(message = "Введите корректный Email")
    private String email;

    private String password;
}
