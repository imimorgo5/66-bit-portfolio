package ru.project.BackendPortfolio.controllers;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.project.BackendPortfolio.dto.AuthenticationDTO;
import ru.project.BackendPortfolio.dto.PersonDTO;
import ru.project.BackendPortfolio.models.Person;
import ru.project.BackendPortfolio.services.RegistrationService;
import ru.project.BackendPortfolio.util.PersonValidator;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final PersonValidator personValidator;
    private final RegistrationService registrationService;
    private final ModelMapper modelMapper;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthController(PersonValidator personValidator, RegistrationService registrationService,
                          ModelMapper modelMapper, AuthenticationManager authenticationManager) {
        this.personValidator = personValidator;
        this.registrationService = registrationService;
        this.modelMapper = modelMapper;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping("/registration")
    public ResponseEntity<Void> registrationPage() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/registration")
    public ResponseEntity<?> performRegistration(@RequestBody @Valid PersonDTO personDTO,
                                                 BindingResult bindingResult){
        Person person = convertToPersonFromDTO(personDTO);

        personValidator.validate(person, bindingResult);

        if (bindingResult.hasErrors()) {
            List<String> errors = bindingResult.getAllErrors()
                    .stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());

            return ResponseEntity.badRequest().body(Map.of("errors", errors));
        }

        registrationService.register(person);
        return ResponseEntity.ok(Map.of("message", "Регистрация прошла успешно!"));
    }

    @GetMapping("/login")
    public ResponseEntity<Void> loginPage() {
        return ResponseEntity.ok().build();
    }

    @PostMapping("/login")
    public ResponseEntity<?> performLogin(@RequestBody @Valid AuthenticationDTO authenticationDTO,
                                            BindingResult bindingResult, HttpSession session){
        var authenticationInputToken = new UsernamePasswordAuthenticationToken(
                authenticationDTO.getEmail(), authenticationDTO.getPassword()
        );

        try {
            var authentication = authenticationManager.authenticate(authenticationInputToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
        } catch (BadCredentialsException e) {
            bindingResult.getAllErrors().forEach(error -> {
                System.out.println(error.getDefaultMessage());
            });
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
        }

        return ResponseEntity.ok(Map.of("message", "Login successful!"));
    }

    @PostMapping("/logout")
    public Map<String, String> performLogout(HttpSession session) {
        session.invalidate();
        SecurityContextHolder.clearContext();
        return Map.of("message", "Logout successful!");
    }

    public Person convertToPersonFromDTO(PersonDTO personDTO){
        return this.modelMapper.map(personDTO, Person.class);
    }
}