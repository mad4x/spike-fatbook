package spike.fatbook.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import spike.fatbook.backend.model.DocenteOraCanonica;

@Repository
public interface DocenteOraCanonicaRepository extends JpaRepository<DocenteOraCanonica, Long> {

    @Query("""
    SELECT d
    FROM DocenteOraCanonica d
    JOIN FETCH d.docente doc
    JOIN FETCH doc.utente
    WHERE d.oraCanonica.id IN :oraIds
    """)
    List<DocenteOraCanonica> findByOraCanonicaIdsWithDocente(@Param("oraIds") List<Long> oraIds);
}
