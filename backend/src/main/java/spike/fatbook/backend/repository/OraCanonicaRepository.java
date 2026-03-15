package spike.fatbook.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spike.fatbook.backend.model.OraCanonica;

import java.util.List;

@Repository
public interface OraCanonicaRepository extends JpaRepository<OraCanonica, Long> {
    
    // Recupera l'orario in base all'ID della classe
    List<OraCanonica> findByClasseId(Long classeId);

    // In alternativa, se il frontend ti passa Anno e Sezione (es. 3 A)
    List<OraCanonica> findByClasseAnnoAndClasseSezione(Integer anno, String sezione);
}