package spike.fatbook.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OraCanonicaDTO {
    private String giorno;
    private int numeroOra;
    private String materia;
    private String docenteTeoria;
    private String docenteLab; 
    private String aula;
    private boolean alternativa;
}   