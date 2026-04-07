package spike.fatbook.backend.dto;

import java.util.List;

public record OrarioClasseCompletoDTO(
    Long classeId,
    String classe,
    List<OrarioSinteticoDTO> ore
) {}