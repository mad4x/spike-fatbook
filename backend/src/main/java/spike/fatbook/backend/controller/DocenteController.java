package spike.fatbook.backend.controller;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import spike.fatbook.backend.dto.DocenteResponseDTO;
import spike.fatbook.backend.service.DocenteService;

import java.util.List;

@RestController
@RequestMapping("/api/docenti") // L'URL base per le API dei docenti lato vicepreside
@RequiredArgsConstructor
public class DocenteController {

    private final DocenteService docenteService;

    @GetMapping()
    @PreAuthorize("hasRole('VICEPRESIDE')")
    public ResponseEntity<@NonNull List<DocenteResponseDTO>> getAllDocenti() {
        List<DocenteResponseDTO> listaDocenti = docenteService.getAllDocenti();
        return ResponseEntity.ok(listaDocenti);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('VICEPRESIDE')")
    public ResponseEntity<@NonNull Void> deleteDocente(@PathVariable Long id) {
        docenteService.deleteDocente(id);
        return ResponseEntity.noContent().build(); // Il 204 No Content è lo standard REST perfetto per una DELETE
    }
}
