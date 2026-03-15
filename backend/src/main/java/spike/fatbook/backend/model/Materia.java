package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "materia")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Materia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false)
    private String descrizione;

    // Aggiungi questo
    public Materia(String nome, String descrizione) {
        this.nome = nome;
        this.descrizione = descrizione;
    }
}