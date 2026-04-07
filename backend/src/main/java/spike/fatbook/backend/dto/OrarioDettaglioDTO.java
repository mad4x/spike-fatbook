package spike.fatbook.backend.dto;

import java.util.List;

import spike.fatbook.backend.enums.GiornoSettimana;
import spike.fatbook.backend.model.Materia;

public record OrarioDettaglioDTO(
    Long oraId,
    Long classeId,
    String classe,
    GiornoSettimana giorno,
    int ora,
    Materia materia,
    String aula,
    List<String> docenti
) {}
