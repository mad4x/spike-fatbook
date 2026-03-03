package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "classi")
@Getter 
@Setter 
@NoArgsConstructor
@AllArgsConstructor
public class Classe {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int anno; 
    private String sezione; 

    // Costruttore manuale per il DataSeeder
    public Classe(int anno, String sezione) {
        this.anno = anno;
        this.sezione = sezione;
    }
}