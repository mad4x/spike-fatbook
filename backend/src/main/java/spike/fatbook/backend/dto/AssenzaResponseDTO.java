package spike.fatbook.backend.dto;

import spike.fatbook.backend.enums.TipologiaAssenza;

import java.time.LocalDate;

public record AssenzaResponseDTO(
        Long id,
        Long docenteId,
        String docenteNome,
        String docenteCognome,
        String docenteEmail,
        LocalDate dataInizio,
        LocalDate dataFine,
        TipologiaAssenza tipologia,
        String note,
        Integer oreScoperte
) {
}
