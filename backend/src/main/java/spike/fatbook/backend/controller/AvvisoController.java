package spike.fatbook.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/avvisi")
@CrossOrigin(origins = "http://localhost:3000")
public class AvvisoController {

    private static final DateTimeFormatter IT_FORMAT = DateTimeFormatter.ofPattern("dd-MM-yyyy");

    @GetMapping
    public ResponseEntity<List<AvvisoResponse>> getAvvisi() {
        List<AvvisoResponse> avvisi = List.of(
                new AvvisoResponse(
                        1L,
                        "1368 - Avvisi per il giorno",
                        "Comunicazione - Circolare",
                        LocalDate.now().format(IT_FORMAT),
                        false,
                        "Si comunica che per la giornata odierna sono previste variazioni di orario."
                ),
                new AvvisoResponse(
                        2L,
                        "Ricevimento famiglie secondo quadrimestre",
                        "Comunicazione - Scuola/famiglia",
                        LocalDate.now().minusDays(1).format(IT_FORMAT),
                        true,
                        "Il ricevimento pomeridiano avrà luogo su prenotazione."
                )
        );

        return ResponseEntity.ok(avvisi);
    }

    public record AvvisoResponse(
            Long id,
            String titolo,
            String categoria,
            String data,
            boolean letto,
            String descrizione
    ) {}
}
