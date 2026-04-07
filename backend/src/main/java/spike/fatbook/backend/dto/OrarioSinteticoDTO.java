package spike.fatbook.backend.dto;

import spike.fatbook.backend.enums.GiornoSettimana;
import spike.fatbook.backend.model.Materia;

public record OrarioSinteticoDTO(
        String classe,
        GiornoSettimana giorno,
        int ora,
        Materia materia,
        String aula
) {}
