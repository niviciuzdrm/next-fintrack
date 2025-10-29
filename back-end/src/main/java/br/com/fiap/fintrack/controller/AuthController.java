package br.com.fiap.fintrack.controller;

import br.com.fiap.fintrack.dto.AuthRequest;
import br.com.fiap.fintrack.dto.AuthResponse;
import br.com.fiap.fintrack.dto.UserRegistrationRequest;
import br.com.fiap.fintrack.dto.UserResponse;
import br.com.fiap.fintrack.model.User;
import br.com.fiap.fintrack.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) { this.authService = authService; }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        String token = authService.authenticate(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegistrationRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setCpf(request.getCpf());
        user.setBirthDate(request.getBirthDate());
        user.setPassword(request.getPassword());

        User saved = authService.create(user);
        URI location = URI.create("/dashboard");
        return ResponseEntity.created(location).body(UserResponse.from(saved));
    }
}
