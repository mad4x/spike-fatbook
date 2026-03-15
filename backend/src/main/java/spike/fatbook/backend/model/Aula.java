package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "aula")
@Getter 
@Setter // Aggiungiamo Setter per sicurezza
@NoArgsConstructor
@AllArgsConstructor
public class Aula {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int piano;

    @Column(nullable = false)
    private String numero;

    private boolean laboratorio;

    // COSTRUTTORE FONDAMENTALE: 
    // Deve rispecchiare ESATTAMENTE l'ordine usato nel Service: (String, int, boolean)
    public Aula(String numero, int piano, boolean laboratorio) {
        this.numero = numero;
        this.piano = piano;
        this.laboratorio = laboratorio;
    }
}