package spike.fatbook.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import spike.fatbook.backend.enums.GiornoSettimana;
import spike.fatbook.backend.enums.VersioneOrario;
import spike.fatbook.backend.model.*;
import spike.fatbook.backend.repository.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ClasseRepository classeRepo;
    private final DocenteRepository docenteRepo;
    private final AulaRepository aulaRepo;
    private final OraCanonicaRepository oraRepo;

    public DataSeeder(ClasseRepository classeRepo, DocenteRepository docenteRepo, 
                      AulaRepository aulaRepo, OraCanonicaRepository oraRepo) {
        this.classeRepo = classeRepo;
        this.docenteRepo = docenteRepo;
        this.aulaRepo = aulaRepo;
        this.oraRepo = oraRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        if (oraRepo.count() > 0) {
            System.out.println("✅ Orario già presente nel DB. Skip seeding.");
            return;
        }

        System.out.println("⏳ Lettura CSV 100% automatica in corso...");

        ClassPathResource resource = new ClassPathResource("orari.csv");
        BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));

        String line;
        boolean isFirstLine = true;
        List<OraCanonica> lezioniDaSalvare = new ArrayList<>();
        
        Map<String, Classe> classiMap = new HashMap<>();
        Map<String, Docente> docentiMap = new HashMap<>();
        Map<String, Aula> auleMap = new HashMap<>();

        while ((line = reader.readLine()) != null) {
            if (isFirstLine) { isFirstLine = false; continue; }

            String[] data = line.split(",");
            if (data.length < 6) continue;

            // Pulizia stringhe
            String nomeClasse = data[0].replace("\uFEFF", "").trim();
            String giorno = data[1].trim().toUpperCase();
            int numeroOra = Integer.parseInt(data[2].trim());
            String materia = data[3].trim();
            String nomeDocente = data[4].trim();
            String nomeAula = data[5].trim();

            // 1. CLASSE
            Classe classe = classiMap.computeIfAbsent(nomeClasse, k -> {
                Classe c = new Classe();
                c.setAnno(5);
                c.setSezione(k.startsWith("5") ? k.substring(1).trim() : k.trim());
                return classeRepo.save(c);
            });

            // 2. DOCENTE
            Docente docente = docentiMap.computeIfAbsent(nomeDocente, k -> {
                Docente d = new Docente();
                d.setNome("");
                d.setCognome(k);
                return docenteRepo.save(d);
            });

            // 3. AULA
            Aula aula = auleMap.computeIfAbsent(nomeAula, k -> {
                Aula a = new Aula();
                a.setNumero(k);
                a.setLaboratorio(k.startsWith("G") || k.startsWith("B") || k.startsWith("Lab"));
                a.setPiano(0);
                return aulaRepo.save(a);
            });

            // 4. SALVATAGGIO ORA
            OraCanonica ora = new OraCanonica();
            ora.setNumeroOra(numeroOra);
            ora.setMateria(materia);
            ora.setGiorno(GiornoSettimana.valueOf(giorno));
            ora.setClasse(classe);
            ora.setDocenteTeoria(docente); // Tutto viene salvato qui, anche "Hu / Zambon"
            ora.setAula(aula);
            ora.setAlternativa(false);
            ora.setVersione(VersioneOrario.DEFINITIVO);
            
            lezioniDaSalvare.add(ora);
        }
        reader.close();

        oraRepo.saveAll(lezioniDaSalvare);
        System.out.println("✅ Seeding completato: " + lezioniDaSalvare.size() + " ore inserite!");
    }
}