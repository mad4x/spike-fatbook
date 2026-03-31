package spike.fatbook.backend.dto;

import java.time.LocalDate;

public record AssenzaRequestDTO(
    Long docenteId,
    LocalDate data,
    Integer ora,
    String motivazione,
    boolean giornaliera
) {}