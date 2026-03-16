package spike.fatbook.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import spike.fatbook.backend.model.OraCanonica;
import org.springframework.stereotype.Repository;

@Repository
public interface OraCanonicaRepository extends JpaRepository<OraCanonica, Long> {
    // Recupera tutte le ore di tutte le classi dove insegna un determinato docente
    List<OraCanonica> findByDocenteEmail(@Param("docenteEmail") String docenteEmail);
    
    // Recupera l'orario completo di una specifica classe
    List<OraCanonica> findByClasseId(Integer classeId);
}