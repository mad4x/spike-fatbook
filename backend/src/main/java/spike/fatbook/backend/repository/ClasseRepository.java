package spike.fatbook.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import spike.fatbook.backend.model.Classe;
import java.util.Optional;

@Repository
public interface ClasseRepository extends JpaRepository<Classe, Long> {
    // Ci serve per vedere se la classe esiste già prima di crearla
    Optional<Classe> findByAnnoAndSezione(Integer anno, String sezione);
}