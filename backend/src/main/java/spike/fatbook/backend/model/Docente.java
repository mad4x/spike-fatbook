package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "docenti") // Plurale è meglio per le tabelle DB
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
public class Docente {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cognome;
    
    // Costruttore manuale per il DataSeeder
    public Docente(String nome, String cognome) {
        this.nome = nome;
        this.cognome = cognome;
    }
}