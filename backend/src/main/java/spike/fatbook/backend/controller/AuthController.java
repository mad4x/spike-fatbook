package spike.fatbook.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import spike.fatbook.backend.security.JwtService;
import spike.fatbook.backend.service.CustomUserDetailsService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    // Iniettiamo gli strumenti che abbiamo configurato finora
    public AuthController(AuthenticationManager authenticationManager,
                          CustomUserDetailsService userDetailsService,
                          JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtService = jwtService;
    }

    // Usiamo i "Record" di Java per creare DTO (Data Transfer Object) velocissimi,
    // senza dover scrivere getter, setter e costruttori.
    public record LoginRequest(String email, String password) {}
    public record AuthResponse(String token) {}

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        // 1. Il "Buttafuori" (AuthenticationManager) prende email e password
        // e controlla se combaciano. Se sono sbagliate, blocca tutto e lancia un errore 403.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        // 2. Se arriviamo a questa riga, significa che le credenziali erano corrette!
        // Carichiamo i dettagli dell'utente.
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.email());

        // 3. Fabbrichiamo il token JWT
        String jwtToken = jwtService.generateToken(userDetails);

        // 4. Lo impacchettiamo nella risposta e lo inviamo al client (il frontend)
        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }
}