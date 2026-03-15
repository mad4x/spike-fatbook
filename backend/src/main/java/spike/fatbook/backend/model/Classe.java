package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "classe")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Classe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int anno;

    @Column(nullable = false)
    private String sezione;

    // Aggiungi questo: permette di creare la classe senza conoscere l'ID
    public Classe(int anno, String sezione) {
        this.anno = anno;
        this.sezione = sezione;
    }
}