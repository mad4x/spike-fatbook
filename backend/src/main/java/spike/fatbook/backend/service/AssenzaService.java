package spike.fatbook.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import spike.fatbook.backend.dto.AssenzaRequestDTO;
import spike.fatbook.backend.dto.AssenzaResponseDTO;
import spike.fatbook.backend.model.Assenza;
import spike.fatbook.backend.model.Docente;
import spike.fatbook.backend.model.Utente;
import spike.fatbook.backend.repository.AssenzaRepository;
import spike.fatbook.backend.repository.DocenteRepository;
import spike.fatbook.backend.repository.UtenteRepository;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssenzaService {

    private final AssenzaRepository assenzaRepository;
    private final DocenteRepository docenteRepository;
    private final UtenteRepository utenteRepository;

    @Transactional(readOnly = true)
    public List<AssenzaResponseDTO> getAssenze(LocalDate data) {
        Authentication authentication = currentAuthentication();
        String email = requireAuthenticatedEmail(authentication);
        boolean canManage = hasManagementRole(authentication);

        List<Assenza> assenze;
        if (canManage) {
            assenze = data == null
                    ? assenzaRepository.findAllByOrderByDataInizioDescIdDesc()
                    : assenzaRepository.findByDataInizioLessThanEqualAndDataFineGreaterThanEqualOrderByDataInizioDescIdDesc(data, data);
        } else {
            Docente docente = docenteRepository.findByUtente_Email(email)
                    .orElse(null);

            if (docente == null) {
                return List.of();
            }

            assenze = data == null
                    ? assenzaRepository.findByDocenteIdOrderByDataInizioDescIdDesc(docente.getId())
                    : assenzaRepository.findByDocenteIdAndDataInizioLessThanEqualAndDataFineGreaterThanEqualOrderByDataInizioDescIdDesc(docente.getId(), data, data);
        }

        return assenze.stream().map(this::toResponse).toList();
    }

    @Transactional
    public AssenzaResponseDTO registraAssenza(AssenzaRequestDTO request) {
        Authentication authentication = currentAuthentication();
        String emailVicepreside = requireManagementUser(authentication);
        validateRequest(request);

        Docente docente = docenteRepository.findById(request.docenteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Docente non trovato"));
        validateDocenteAttivo(docente);

        if (assenzaRepository.existsByDocenteIdAndDataInizioLessThanEqualAndDataFineGreaterThanEqual(
                request.docenteId(), request.dataFine(), request.dataInizio())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Esiste già un'assenza sovrapposta per questo docente");
        }

        Utente vicepreside = utenteRepository.findByEmail(emailVicepreside)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Utente non autorizzato"));

        Assenza assenza = new Assenza();
        assenza.setDocente(docente);
        assenza.setRegistratoDa(vicepreside);
        assenza.setDataInizio(request.dataInizio());
        assenza.setDataFine(request.dataFine());
        assenza.setTipologia(request.tipologia());
        assenza.setNote(normalizeNote(request.note()));
        assenza.setOreScoperte(calculateOreScoperte(request.dataInizio(), request.dataFine()));
        assenza.setLegacyData(request.dataInizio());
        assenza.setLegacyMotivazione(normalizeNote(request.note()));
        assenza.setLegacyGiornaliera(request.dataInizio().equals(request.dataFine()));
        assenza.setLegacyOra(1);

        return toResponse(assenzaRepository.save(assenza));
    }

    @Transactional
    public AssenzaResponseDTO aggiornaAssenza(Long id, AssenzaRequestDTO request) {
        Authentication authentication = currentAuthentication();
        requireManagementUser(authentication);
        validateRequest(request);

        Assenza assenza = assenzaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assenza non trovata"));

        Docente docente = docenteRepository.findById(request.docenteId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Docente non trovato"));
        validateDocenteAttivo(docente);

        if (assenzaRepository.existsByDocenteIdAndDataInizioLessThanEqualAndDataFineGreaterThanEqualAndIdNot(
                request.docenteId(), request.dataFine(), request.dataInizio(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Esiste già un'assenza sovrapposta per questo docente");
        }

        assenza.setDocente(docente);
        assenza.setDataInizio(request.dataInizio());
        assenza.setDataFine(request.dataFine());
        assenza.setTipologia(request.tipologia());
        assenza.setNote(normalizeNote(request.note()));
        assenza.setOreScoperte(calculateOreScoperte(request.dataInizio(), request.dataFine()));
        assenza.setLegacyData(request.dataInizio());
        assenza.setLegacyMotivazione(normalizeNote(request.note()));
        assenza.setLegacyGiornaliera(request.dataInizio().equals(request.dataFine()));
        assenza.setLegacyOra(1);

        return toResponse(assenzaRepository.save(assenza));
    }

    @Transactional
    public void eliminaAssenza(Long id) {
        Authentication authentication = currentAuthentication();
        requireManagementUser(authentication);

        if (!assenzaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Assenza non trovata");
        }

        assenzaRepository.deleteById(id);
    }

    private void validateRequest(AssenzaRequestDTO request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Payload assenza mancante");
        }

        if (request.docenteId() == null || request.docenteId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "docenteId non valido");
        }

        if (request.dataInizio() == null || request.dataFine() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Date assenza obbligatorie");
        }

        if (request.dataFine().isBefore(request.dataInizio())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "dataFine non può essere precedente a dataInizio");
        }

        if (request.tipologia() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tipologia assenza obbligatoria");
        }

        String note = normalizeNote(request.note());
        if (note.length() > 1000) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Le note non possono superare 1000 caratteri");
        }
    }

    private String normalizeNote(String note) {
        return note == null ? "" : note.trim();
    }

    private void validateDocenteAttivo(Docente docente) {
        if (docente.isEliminato() || docente.getUtente() == null || docente.getUtente().isEliminato()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Docente non attivo");
        }
    }

    private Integer calculateOreScoperte(LocalDate dataInizio, LocalDate dataFine) {
        long giorni = ChronoUnit.DAYS.between(dataInizio, dataFine) + 1;
        if (giorni < 1) {
            giorni = 1;
        }
        long ore = giorni * 6;
        return (int) Math.min(ore, Integer.MAX_VALUE);
    }

    private Authentication currentAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    private String requireAuthenticatedEmail(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new AccessDeniedException("Utente non autenticato");
        }
        return authentication.getName();
    }

    private String requireManagementUser(Authentication authentication) {
        String email = requireAuthenticatedEmail(authentication);
        if (!hasManagementRole(authentication)) {
            throw new AccessDeniedException("Permesso negato");
        }
        return email;
    }

    private boolean hasManagementRole(Authentication authentication) {
        if (authentication == null) {
            return false;
        }

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        return authorities.stream().anyMatch(authority -> {
            String role = authority.getAuthority();
            return "ROLE_VICEPRESIDE".equals(role)
                    || "ROLE_VICEPRESIDENZA".equals(role)
                    || "ROLE_ADMIN".equals(role);
        });
    }

    private AssenzaResponseDTO toResponse(Assenza assenza) {
        return new AssenzaResponseDTO(
                assenza.getId(),
                assenza.getDocente() != null ? assenza.getDocente().getId() : null,
                assenza.getDocente() != null && assenza.getDocente().getUtente() != null ? assenza.getDocente().getUtente().getNome() : "",
                assenza.getDocente() != null && assenza.getDocente().getUtente() != null ? assenza.getDocente().getUtente().getCognome() : "",
                assenza.getDocente() != null && assenza.getDocente().getUtente() != null ? assenza.getDocente().getUtente().getEmail() : "",
                assenza.getDataInizio(),
                assenza.getDataFine(),
                assenza.getTipologia(),
                assenza.getNote() == null ? "" : assenza.getNote(),
                assenza.getOreScoperte() == null ? 0 : assenza.getOreScoperte()
        );
    }
}