package spike.fatbook.backend.service;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import spike.fatbook.backend.dto.OrarioClasseCompletoDTO;
import spike.fatbook.backend.dto.OrarioDettaglioDTO;
import spike.fatbook.backend.dto.OrarioSinteticoDTO;
import spike.fatbook.backend.model.DocenteOraCanonica;
import spike.fatbook.backend.model.OraCanonica;
import spike.fatbook.backend.repository.DocenteOraCanonicaRepository;
import spike.fatbook.backend.repository.OraCanonicaRepository;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class OrarioService {
    private final OraCanonicaRepository repository;
    private final DocenteOraCanonicaRepository docenteOraCanonicaRepository;

    public OrarioService(OraCanonicaRepository repository, DocenteOraCanonicaRepository docenteOraCanonicaRepository) {
        this.repository = repository;
        this.docenteOraCanonicaRepository = docenteOraCanonicaRepository;
    }

    public List<OrarioSinteticoDTO> getOrarioWeeklyByDocente(String docenteEmail) {
        return repository.findOreByDocenteEmail(docenteEmail).stream()
            .map(o -> new OrarioSinteticoDTO(
                o.getClasse().getAnno() + o.getClasse().getSezione(),
                o.getGiorno(),
                o.getNumeroOra(),
                o.getMateria(),
                o.getAula() != null ? o.getAula().getNumero() : null
            ))
            .collect(Collectors.toList());
    }

    public List<OrarioClasseCompletoDTO> getOrarioCompletoClassiByDocente(String docenteEmail) {
        List<Long> classiDocente = repository.findOreByDocenteEmail(docenteEmail).stream()
            .map(o -> o.getClasse().getId())
            .distinct()
            .collect(Collectors.toList());

        if (classiDocente.isEmpty()) {
            return List.of();
        }

        List<OraCanonica> oreClassi = repository.findByClasseIdInOrderByClasseAnnoAscClasseSezioneAscNumeroOraAsc(classiDocente);
        Map<Long, List<OraCanonica>> orarioByClasse = oreClassi.stream()
            .collect(Collectors.groupingBy(o -> o.getClasse().getId(), LinkedHashMap::new, Collectors.toList()));

        return classiDocente.stream()
            .map(orarioByClasse::get)
            .filter(ore -> ore != null && !ore.isEmpty())
            .map(ore -> {
                OraCanonica primaOra = ore.get(0);
                String nomeClasse = primaOra.getClasse().getAnno() + primaOra.getClasse().getSezione();

                List<OrarioSinteticoDTO> orarioSintetico = ore.stream()
                    .map(o -> new OrarioSinteticoDTO(
                        o.getClasse().getAnno() + o.getClasse().getSezione(),
                        o.getGiorno(),
                        o.getNumeroOra(),
                        o.getMateria(),
                        o.getAula() != null ? o.getAula().getNumero() : null
                    ))
                    .collect(Collectors.toList());

                return new OrarioClasseCompletoDTO(primaOra.getClasse().getId(), nomeClasse, orarioSintetico);
            })
            .collect(Collectors.toList());
    }

    public List<OrarioDettaglioDTO> getOrarioByClasse(Integer id) {
        List<OraCanonica> orari = repository.findByClasseId(id);
        if (orari == null || orari.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orario non trovato");
        }

        List<Long> oraIds = orari.stream().map(OraCanonica::getId).toList();
        Map<Long, List<String>> docentiByOra = docenteOraCanonicaRepository.findByOraCanonicaIdsWithDocente(oraIds).stream()
            .collect(Collectors.groupingBy(
                d -> d.getOraCanonica().getId(),
                Collectors.mapping(this::toDocenteLabel, Collectors.toList())
            ));

        return orari.stream()
            .map(ora -> new OrarioDettaglioDTO(
                ora.getId(),
                ora.getClasse().getId(),
                ora.getClasse().getAnno() + ora.getClasse().getSezione(),
                ora.getGiorno(),
                ora.getNumeroOra(),
                ora.getMateria(),
                ora.getAula() != null ? ora.getAula().getNumero() : null,
                docentiByOra.getOrDefault(ora.getId(), List.of())
            ))
            .collect(Collectors.toList());
    }

    private String toDocenteLabel(DocenteOraCanonica link) {
        String nome = link.getDocente().getUtente().getNome();
        String cognome = link.getDocente().getUtente().getCognome();
        return (nome + " " + cognome).trim();
    }
}