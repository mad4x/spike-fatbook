package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "docente")
@SQLDelete(sql = "UPDATE docente SET eliminato = true WHERE id = ?")
@SQLRestriction("eliminato = false")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Docente {

    @Id
    private Long id;

    @Setter
    private boolean laboratorio;

    @Setter
    @OneToOne
    @MapsId // <-- LA MAGIA È QUI
    @JoinColumn(name = "id") // Nel database avrai solo la colonna 'id' (che fa sia da PK che da FK)
    private Utente utente;

    @Setter
    @Column(name = "eliminato", nullable = false, columnDefinition = "boolean default false")
    private boolean eliminato = false;

    @OneToMany(mappedBy = "docente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DocenteMateria> docenze = new ArrayList<>();
}