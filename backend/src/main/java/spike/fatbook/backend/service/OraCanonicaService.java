package spike.fatbook.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import spike.fatbook.backend.dto.OraCanonicaDTO;
import spike.fatbook.backend.model.*;
import spike.fatbook.backend.repository.*;
import spike.fatbook.backend.enums.GiornoSettimana;
import spike.fatbook.backend.enums.VersioneOrario;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OraCanonicaService {

    private final OraCanonicaRepository oraCanonicaRepository;
    private final ClasseRepository classeRepository;
    private final MateriaRepository materiaRepository;
    private final AulaRepository aulaRepository;

    public List<OraCanonicaDTO> getOrarioPerClasse(Integer anno, String sezione) {
        List<OraCanonica> oreEntity = oraCanonicaRepository.findByClasseAnnoAndClasseSezione(anno, sezione);
        return oreEntity.stream().map(ora -> new OraCanonicaDTO(
                ora.getGiorno().name(),
                ora.getNumeroOra(),
                ora.getMateria() != null ? ora.getMateria().getNome() : "N/D",
                "Da Assegnare", "Esempio", // Il docente andrà mappato qui in futuro se decidi di salvarlo
                ora.getAula() != null ? ora.getAula().getNumero() : "N/D",
                false
        )).collect(Collectors.toList());
    }

    @Transactional
    public void importaDaCSV(MultipartFile file) throws Exception {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = br.readLine()) != null) {
                if (isFirstLine) { isFirstLine = false; continue; } // Salta l'intestazione "classe,giorno..."
                if (line.trim().isEmpty()) continue; // Salta le righe vuote
                
                // Il -1 serve a non perdere le colonne finali se sono vuote
                String[] columns = line.split(",", -1); 
                if (columns.length < 6) continue; // Assicuriamoci che ci siano tutte le 6 colonne

                try {
                    // 1. Parsing Classe (Es: "5A CD" -> Anno 5, Sezione "A CD")
                    String rawClasse = columns[0].trim();
                    if (rawClasse.length() < 2) continue;
                    Integer anno = Character.getNumericValue(rawClasse.charAt(0));
                    String sezione = rawClasse.substring(1).trim();

                    Classe classe = classeRepository.findByAnnoAndSezione(anno, sezione)
                        .orElseGet(() -> classeRepository.save(new Classe(anno, sezione)));

                    // 2. Parsing Giorno e Ora
                    GiornoSettimana giorno = GiornoSettimana.valueOf(columns[1].trim().toUpperCase());
                    Integer numeroOra = Integer.parseInt(columns[2].trim());

                    // 3. Parsing Materia
                    String nomeMateria = columns[3].trim();
                    Materia materia = materiaRepository.findByNome(nomeMateria)
                        .orElseGet(() -> materiaRepository.save(new Materia(nomeMateria, "Descrizione " + nomeMateria)));

                    // 4. Il Docente (columns[4]) per ora lo ignoriamo lato salvataggio DB,
                    // in quanto non presente in OraCanonica. Ma leggiamo correttamente la riga.

                    // 5. Parsing Aula (se c'è "-", mettiamo "N/D")
                    String nomeAula = columns[5].trim();
                    if (nomeAula.equals("-") || nomeAula.isEmpty()) {
                        nomeAula = "N/D";
                    }
                    String finalNomeAula = nomeAula; // Serve per la Lambda qui sotto
                    Aula aula = aulaRepository.findByNumero(finalNomeAula)
                        .orElseGet(() -> aulaRepository.save(new Aula(finalNomeAula, 0, false)));

                    // 6. Salvataggio Ora Canonica
                    OraCanonica ora = new OraCanonica();
                    ora.setClasse(classe);
                    ora.setGiorno(giorno);
                    ora.setNumeroOra(numeroOra);
                    ora.setMateria(materia);
                    ora.setAula(aula);
                    ora.setVersione(VersioneOrario.DEFINITIVO);

                    oraCanonicaRepository.save(ora);
                    
                } catch (Exception e) {
                    // Se una riga ha un errore strano, la salta e va avanti con il resto del file!
                    System.err.println("Ignoro riga malformata: " + line + " -> " + e.getMessage());
                }
            }
        }
    }
}