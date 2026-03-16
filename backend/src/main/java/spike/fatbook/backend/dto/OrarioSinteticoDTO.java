package spike.fatbook.backend.dto;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import spike.fatbook.backend.model.Materia;

@AllArgsConstructor
@NoArgsConstructor
public class OrarioSinteticoDTO {
    
    private String classe;
    private int ora;
    private Materia materia;
    private String aula;

}
