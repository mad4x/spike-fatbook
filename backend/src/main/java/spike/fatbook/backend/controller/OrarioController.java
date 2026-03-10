package spike.fatbook.backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import spike.fatbook.backend.dto.OraCanonicaDTO;
import spike.fatbook.backend.repository.OraCanonicaRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orario")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrarioController {

    private final OraCanonicaRepository oraCanonicaRepository;

    @GetMapping("/classe/{sezione}")
    public List<OraCanonicaDTO> getOrarioByClasse(@PathVariable String sezione) {
        return oraCanonicaRepository.findAll().stream()
                .filter(ora -> ora.getClasse().getSezione().equalsIgnoreCase(sezione))
                .map(ora -> new OraCanonicaDTO(
                        ora.getGiorno().name(),
                        ora.getNumeroOra(),
                        ora.getMateria(),
                        ora.getDocenteTeoria().getUtente().getCognome(),
                        ora.getDocenteLaboratorio() != null ? ora.getDocenteLaboratorio().getUtente().getCognome() : "-",
                        ora.getAula().getNumero(),
                        ora.isAlternativa()
                ))
                .collect(Collectors.toList());
    }
}