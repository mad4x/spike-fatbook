package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import spike.fatbook.backend.enums.MotivoDisposizione;

import java.time.LocalDate;

@Entity
@Table(name = "disposizione")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Disposizione {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private LocalDate data;

    @Setter
    private int ora;

    @Setter
    private boolean giornaliera;

    @Setter
    @Enumerated(EnumType.STRING)
    private MotivoDisposizione motivo;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id")
    private Docente docente;
}
