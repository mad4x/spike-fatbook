package spike.fatbook.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import spike.fatbook.backend.dto.OrarioSinteticoDTO;
import spike.fatbook.backend.model.OraCanonica;
import spike.fatbook.backend.repository.OraCanonicaRepository;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class OrarioService {
    private final OraCanonicaRepository repository;

    public OrarioService(OraCanonicaRepository repository) {
        this.repository = repository;
    }

    public List<OrarioSinteticoDTO> getOrarioByDocente(String docenteEmail) {
        return repository.findByDocenteEmail(docenteEmail).stream()
            .map(o -> new OrarioSinteticoDTO(
                o.getClasse().getAnno() + o.getClasse().getSezione(),
                o.getNumeroOra(),
                o.getMateria(),
                o.getAula().getNumero()
            ))
            .collect(Collectors.toList());
    }

    public List<OraCanonica> getOrarioByClasse(Integer id) {
        List<OraCanonica> orari = repository.findByClasseId(id);
        if (orari == null || orari.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orario non trovato");
        }
        return orari;
    }
}