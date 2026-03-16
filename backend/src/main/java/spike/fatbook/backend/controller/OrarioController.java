package spike.fatbook.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import spike.fatbook.backend.dto.OrarioSinteticoDTO;
import spike.fatbook.backend.model.OraCanonica;
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
     * GET /api/orario?docenteId=1
     * Consegna la lista sintetica delle ore relative a un docente
     */
    @GetMapping
    public ResponseEntity<List<OrarioSinteticoDTO>> getOrario(@RequestParam String docenteEmail) {
        return ResponseEntity.ok(orarioService.getOrarioByDocente(docenteEmail));
    }

    /**
     * GET /api/orario/5
     * Consegna il dettaglio completo di una singola entry dell'orario
     */
    @GetMapping("/{id}")
    public ResponseEntity<List<OraCanonica>> getDettaglio(@PathVariable Integer id) {
        return ResponseEntity.ok(orarioService.getOrarioByClasse(id));
    }
}