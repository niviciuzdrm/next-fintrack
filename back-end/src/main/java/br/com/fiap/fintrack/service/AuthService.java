package br.com.fiap.fintrack.service;

import br.com.fiap.fintrack.model.User;
import br.com.fiap.fintrack.repository.UserRepository;
import br.com.fiap.fintrack.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.jwtUtil = jwtUtil;
    }

    public String authenticate(String email, String rawPassword) {
        Optional<User> opt = userRepository.findByEmail(email);
        if (opt.isEmpty()) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        User user = opt.get();
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new IllegalArgumentException("Credenciais inválidas");
        }
        return jwtUtil.generateToken(user.getId());
    }

    @Transactional
    public User create(User user) {
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }
}
