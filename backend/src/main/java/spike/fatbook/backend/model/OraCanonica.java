package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import spike.fatbook.backend.enums.GiornoSettimana;
import spike.fatbook.backend.enums.VersioneOrario;

@Entity
@Table(name = "ore_canoniche")
@Data
public class OraCanonica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private GiornoSettimana giorno;

    private int numeroOra;
    private String materia;

    @Enumerated(EnumType.STRING)
    private VersioneOrario versione;

    @ManyToOne
    private Classe classe;

    @ManyToOne
    private Aula aula;

    @ManyToOne
    private Docente docenteTeoria;

    @ManyToOne
    private Docente docenteLaboratorio; // Può essere null se non c'è laboratorio

    private boolean isAlternativa = false; // true se è l'ora per chi non fa religione
}