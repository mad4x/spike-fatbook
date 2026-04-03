package spike.fatbook.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import spike.fatbook.backend.enums.TipologiaAssenza;

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
    @Column(name = "data_inizio", nullable = false, columnDefinition = "date default CURRENT_DATE")
    private LocalDate dataInizio;

    @Setter
    @Column(name = "data_fine", nullable = false, columnDefinition = "date default CURRENT_DATE")
    private LocalDate dataFine;

    @Setter
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "varchar(20) default 'MALATTIA'")
    private TipologiaAssenza tipologia = TipologiaAssenza.MALATTIA;

    @Setter
    @Column(nullable = false, columnDefinition = "text default ''")
    private String note = "";

    @Setter
    @Column(name = "ore_scoperte", nullable = false, columnDefinition = "integer default 0")
    private Integer oreScoperte = 0;

    @Setter
    @Column(name = "data", nullable = false, columnDefinition = "date default CURRENT_DATE")
    private LocalDate legacyData;

    @Setter
    @Column(name = "ora", nullable = false, columnDefinition = "integer default 1")
    private Integer legacyOra = 1;

    @Setter
    @Column(name = "motivazione", nullable = false, columnDefinition = "text default ''")
    private String legacyMotivazione = "";

    @Setter
    @Column(name = "giornaliera", nullable = false, columnDefinition = "boolean default true")
    private boolean legacyGiornaliera = true;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uscita_didattica_id")
    private UscitaDidattica uscitaDidattica;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "docente_id", nullable = false) // Non può esistere un'assenza senza docente
    private Docente docente;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registrato_da_id", nullable = false)
    private Utente registratoDa;
}