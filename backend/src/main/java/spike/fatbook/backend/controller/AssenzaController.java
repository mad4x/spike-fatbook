package spike.fatbook.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import spike.fatbook.backend.dto.AssenzaRequestDTO;
import spike.fatbook.backend.dto.AssenzaResponseDTO;
import spike.fatbook.backend.service.AssenzaService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/assenze")
@RequiredArgsConstructor
public class AssenzaController {

    private final AssenzaService assenzaService;

    @GetMapping
    public ResponseEntity<List<AssenzaResponseDTO>> getAssenze(
            @RequestParam(name = "data", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate data
    ) {
        return ResponseEntity.ok(assenzaService.getAssenze(data));
    }

    @PostMapping
    public ResponseEntity<AssenzaResponseDTO> creaAssenza(@RequestBody AssenzaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assenzaService.registraAssenza(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssenzaResponseDTO> aggiornaAssenza(
            @PathVariable Long id,
            @RequestBody AssenzaRequestDTO dto
    ) {
        return ResponseEntity.ok(assenzaService.aggiornaAssenza(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminaAssenza(@PathVariable Long id) {
        assenzaService.eliminaAssenza(id);
        return ResponseEntity.noContent().build();
    }
}
