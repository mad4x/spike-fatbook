package spike.fatbook.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import spike.fatbook.backend.dto.AssenzaRequestDTO;
import spike.fatbook.backend.model.Assenza;
import spike.fatbook.backend.service.AssenzaService;

import java.security.Principal;

@RestController
@RequestMapping("/api/assenza")
@RequiredArgsConstructor
public class AssenzaController {

    private final AssenzaService assenzaService;

    @PostMapping
    public ResponseEntity<?> creaAssenza(@RequestBody AssenzaRequestDTO dto, Principal principal) {
        // principal.getName() restituisce il "subject" del JWT, che di solito è l'email!
        String emailVicepreside = principal.getName();

        Assenza salvata = assenzaService.registraAssenza(dto, emailVicepreside);
        return ResponseEntity.ok(salvata);
    }
}
