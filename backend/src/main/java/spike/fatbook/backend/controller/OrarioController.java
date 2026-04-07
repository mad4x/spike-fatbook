package spike.fatbook.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import spike.fatbook.backend.dto.OrarioClasseCompletoDTO;
import spike.fatbook.backend.dto.OrarioDettaglioDTO;
import spike.fatbook.backend.dto.OrarioSinteticoDTO;
import spike.fatbook.backend.service.OrarioService;

@RestController
@RequestMapping("/api/orario")
@CrossOrigin(origins = "http://localhost:3000") // Cruciale per il tuo stack Next.js
public class OrarioController {

    private final OrarioService orarioService;

    public OrarioController(OrarioService orarioService) {
        this.orarioService = orarioService;
    }

    /**
     * GET /api/orario/
     * Restituisce, per ogni classe in cui il docente insegna almeno un'ora,
     * l'orario sintetico completo della classe.
     */
    @GetMapping({"", "/"})
    public ResponseEntity<List<OrarioClasseCompletoDTO>> getOrarioCompletoClassi(Authentication auth) {
        return ResponseEntity.ok(orarioService.getOrarioCompletoClassiByDocente(auth.getName()));
    }

    /**
     * GET /api/orario/weekly
     * Consegna la lista sintetica delle ore relative a un docente settimanale
     */
    @GetMapping("/weekly")
    public ResponseEntity<List<OrarioSinteticoDTO>> getOrario(Authentication auth) {
        return ResponseEntity.ok(orarioService.getOrarioWeeklyByDocente(auth.getName()));
    }

    /**
     * GET /api/orario/5
     * Consegna il dettaglio completo di una singola entry dell'orario
     */
    @GetMapping("/{id}")
    public ResponseEntity<List<OrarioDettaglioDTO>> getDettaglio(@PathVariable Integer id) {
        return ResponseEntity.ok(orarioService.getOrarioByClasse(id));
    }
}