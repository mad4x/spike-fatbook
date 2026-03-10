package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "assenza")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Assenza {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private LocalDate data;

    @Setter
    private int ora;

    @Setter
    @Column(nullable = false)
    private String motivazione;

    @Setter
    private boolean giornaliera;

    @Setter
    private boolean uscita_didattica;

    @Setter
    @ManyToOne
    @JoinColumn(name = "docente_id")
    private Docente docente;
}
