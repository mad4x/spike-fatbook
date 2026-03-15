package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.*;
import spike.fatbook.backend.enums.RuoliDisponibili; // <-- Importante: l'import dell'Enum!

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "utente")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Utente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String nome;

    @Setter
    @Column(nullable = false)
    private String cognome;

    @Setter
    @Column(nullable = false, unique = true)
    private String email;

    @OneToMany(mappedBy = "utente", fetch = FetchType.LAZY)
    @ToString.Exclude
    private List<UtenteRuolo> ruoli = new ArrayList<>();

    // Metodo basato sulla Stringa
    public boolean hasRole(String nomeRuolo) {
        return ruoli.stream()
                .anyMatch(r -> r.getRuolo().getRuolo().name().equalsIgnoreCase(nomeRuolo));
    }

    // Metodo basato sull'Enum
    public boolean hasRole(RuoliDisponibili ruoloCercato) {
        return ruoli.stream()
                .anyMatch(r -> r.getRuolo().getRuolo() == ruoloCercato);
    }
} 