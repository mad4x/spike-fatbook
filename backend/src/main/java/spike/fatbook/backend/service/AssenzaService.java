package spike.fatbook.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import spike.fatbook.backend.dto.AssenzaRequestDTO;
import spike.fatbook.backend.model.Assenza;
import spike.fatbook.backend.model.Docente;
import spike.fatbook.backend.model.Utente; // Adatta al nome della tua entità User
import spike.fatbook.backend.repository.AssenzaRepository;
import spike.fatbook.backend.repository.DocenteRepository;
import spike.fatbook.backend.repository.UtenteRepository; // Adatta al tuo repo

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssenzaService {

    private final AssenzaRepository assenzaRepository;
    private final DocenteRepository docenteRepository;
    private final UtenteRepository utenteRepository;

    // 1. Lettura: Ottieni tutte le assenze di una certa data
    public List<Assenza> getAssenzeDelGiorno(LocalDate data) {
        return assenzaRepository.findByData(data);
    }

    // 2. Scrittura: Crea una nuova assenza
    @Transactional
    public Assenza registraAssenza(AssenzaRequestDTO request, String emailVicepreside) {

        // Cerchiamo il docente
        Docente docente = docenteRepository.findById(request.docenteId())
                .orElseThrow(() -> new RuntimeException("Docente non trovato con ID: " + request.docenteId()));

        // Cerchiamo l'utente che sta facendo l'operazione (estratto dal JWT)
        Utente vicepreside = utenteRepository.findByEmail(emailVicepreside)
                .orElseThrow(() -> new RuntimeException("Utente non autorizzato o non trovato"));

        // Costruiamo l'entità
        Assenza assenza = new Assenza();
        assenza.setDocente(docente);
        assenza.setRegistratoDa(vicepreside);
        assenza.setData(request.data());
        assenza.setOra(request.ora());
        assenza.setMotivazione(request.motivazione());
        assenza.setGiornaliera(request.giornaliera());

        // Salviamo nel DB
        return assenzaRepository.save(assenza);
    }
}