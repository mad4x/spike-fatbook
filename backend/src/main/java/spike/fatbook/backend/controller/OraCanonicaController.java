package spike.fatbook.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import spike.fatbook.backend.dto.OraCanonicaDTO;
import spike.fatbook.backend.service.OraCanonicaService;
import java.util.List;

@RestController
@RequestMapping("/api/orario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OraCanonicaController {

    private final OraCanonicaService oraCanonicaService;

    @GetMapping("/classe/{anno}/{sezione}")
    public ResponseEntity<List<OraCanonicaDTO>> getOrario(@PathVariable Integer anno, @PathVariable String sezione) {
        List<OraCanonicaDTO> orario = oraCanonicaService.getOrarioPerClasse(anno, sezione);
        if (orario.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(orario);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadCSV(@RequestParam("file") MultipartFile file) {
        try {
            oraCanonicaService.importaDaCSV(file);
            return ResponseEntity.ok("Importazione completata con successo!");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Errore durante l'importazione: " + e.getMessage());
        }
    }
}