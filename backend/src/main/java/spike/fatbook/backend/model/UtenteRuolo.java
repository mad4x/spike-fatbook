package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "utente_ruolo",
    uniqueConstraints = {
            @UniqueConstraint(columnNames = {"utente_id", "ruolo_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class UtenteRuolo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utente_id", nullable = false)
    private Utente utente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ruolo_id", nullable = false)
    private Ruolo ruolo;
}
