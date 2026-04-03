package spike.fatbook.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import spike.fatbook.backend.model.Assenza;

import java.time.LocalDate;
import java.util.List;

public interface AssenzaRepository extends JpaRepository<Assenza, Long> {
    List<Assenza> findAllByOrderByDataInizioDescIdDesc();

    List<Assenza> findByDataInizioLessThanEqualAndDataFineGreaterThanEqualOrderByDataInizioDescIdDesc(LocalDate dataInizio, LocalDate dataFine);

    List<Assenza> findByDocenteIdOrderByDataInizioDescIdDesc(Long docenteId);

    List<Assenza> findByDocenteIdAndDataInizioLessThanEqualAndDataFineGreaterThanEqualOrderByDataInizioDescIdDesc(Long docenteId, LocalDate dataInizio, LocalDate dataFine);

    boolean existsByDocenteIdAndDataInizioLessThanEqualAndDataFineGreaterThanEqual(Long docenteId, LocalDate dataFine, LocalDate dataInizio);

    boolean existsByDocenteIdAndDataInizioLessThanEqualAndDataFineGreaterThanEqualAndIdNot(Long docenteId, LocalDate dataFine, LocalDate dataInizio, Long id);
}
