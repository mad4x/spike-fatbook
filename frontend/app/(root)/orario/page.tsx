"use client";

import React, { useState, useEffect } from 'react';

export interface OraCanonicaDTO {
    id?: number; // Importante per l'aggiornamento futuro
    giorno: string;
    numeroOra: number;
    materia: string;
    docenteTeoria?: any;
    docente_teoria?: any;
    docentePrincipale?: any;
    docente?: any;
    aula?: any;
    aula_id?: any;
    alternativa?: boolean;
}

type GiornoSettimana = 'LUNEDI' | 'MARTEDI' | 'MERCOLEDI' | 'GIOVEDI' | 'VENERDI';
type RigaOrario = Record<GiornoSettimana, OraCanonicaDTO[]>;

const Orario = () => {
    // --- 1. SIMULAZIONE AUTENTICAZIONE ---
    // In futuro questo arriverà dal Login (es. session.user.role)
    const [userRole, setUserRole] = useState<'ADMIN' | 'PROF'>('ADMIN'); 

    // --- 2. STATO DEL COMPONENTE ---
    const [selectedClass, setSelectedClass] = useState<string>('L');
    const [gridData, setGridData] = useState<RigaOrario[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // --- STATI PER IL POPUP DI MODIFICA (Solo Admin) ---
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCell, setEditingCell] = useState<{ giorno: string; ora: number; dati: Partial<OraCanonicaDTO> } | null>(null);

    const giorni: GiornoSettimana[] = ['LUNEDI', 'MARTEDI', 'MERCOLEDI', 'GIOVEDI', 'VENERDI'];
    const orariFasce = [
        "08:30 - 09:20", "09:20 - 10:10", "10:20 - 11:15", "11:15 - 12:10", 
        "12:20 - 13:10", "13:10 - 14:00", "14:30 - 15:20", "15:20 - 16:10"
    ];

    const getDocente = (lezione: OraCanonicaDTO) => {
        let doc = lezione.docenteTeoria || lezione.docente_teoria || lezione.docentePrincipale || lezione.docente || null;
        if (doc && typeof doc === 'object') return doc.cognome || doc.nome || "Da Assegnare";
        if (typeof doc === 'string' && doc !== "-" && doc !== "") return doc;
        return "Da Assegnare";
    };

    const getAula = (lezione: OraCanonicaDTO) => {
        let au = lezione.aula || lezione.aula_id || null;
        if (au && typeof au === 'object') return au.numero || au.nome || au.id || "Da Assegnare";
        if (typeof au === 'string' && au !== "-" && au !== "") return au;
        return "Da Assegnare";
    };

    // --- 3. FUNZIONE DI CHIAMATA AL BACKEND ---
    const fetchTimetable = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // CORRETTO: Aggiunto il "/5/" nell'URL per far combaciare il backend!
            const response = await fetch(`http://localhost:8080/api/orario/classe/5/${encodeURIComponent(selectedClass)}`);
            if (!response.ok) throw new Error("Errore di connessione al server");
            
            // Se non ci sono dati (204 No Content), data sarà vuoto
            const data: OraCanonicaDTO[] = response.status === 204 ? [] : await response.json();
            
            const newGrid: RigaOrario[] = Array.from({ length: 8 }, () => ({
                LUNEDI: [], MARTEDI: [], MERCOLEDI: [], GIOVEDI: [], VENERDI: []
            }));

            data.forEach((ora) => {
                if (ora.numeroOra >= 1 && ora.numeroOra <= 8) {
                    const giornoKey = ora.giorno as GiornoSettimana;
                    if (newGrid[ora.numeroOra - 1][giornoKey]) {
                        newGrid[ora.numeroOra - 1][giornoKey].push(ora);
                    }
                }
            });

            setGridData(newGrid);
        } catch (err: any) {
            console.error(err);
            setError("Impossibile caricare l'orario. Verifica che il backend sia acceso.");
        } finally {
            setIsLoading(false);
        }
    };

    // --- 4. FUNZIONI PER L'EDITING (ADMIN) ---
    const handleCellClick = (giorno: string, numeroOra: number, lezioneEsistente: OraCanonicaDTO | null) => {
        if (userRole !== 'ADMIN') return; // Se non sei admin, il click non fa nulla
        
        setEditingCell({
            giorno,
            ora: numeroOra,
            dati: lezioneEsistente ? { ...lezioneEsistente } : { materia: "", docente: "", aula: "" }
        });
        setIsEditModalOpen(true);
    };

    const handleSaveCell = async () => {
        // Qui nello Sprint 3 metteremo la chiamata PUT/POST al backend per salvare la singola ora
        console.log("Dati da salvare sul DB:", editingCell);
        alert(`Simulazione Salvataggio!\nMateria: ${editingCell?.dati.materia}\nGiorno: ${editingCell?.giorno}\nOra: ${editingCell?.ora}`);
        setIsEditModalOpen(false);
        // await fetchTimetable(); // Ricarica l'orario dopo il salvataggio
    };

    // --- INTERFACCIA GRAFICA ---
    return (
        <div className="w-full max-w-7xl mx-auto bg-white p-6 rounded-xl shadow-lg border border-slate-100 print:shadow-none print:border-none print:p-0 relative">
            
            {/* INTESTAZIONE */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 print:mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 print:text-lg">Orario Lezioni - Classe 5{selectedClass}</h1>
                    <p className="text-slate-500 text-sm print:text-xs">Indirizzo: ITTS C. Grassi | Accesso: <strong className={userRole === 'ADMIN' ? 'text-red-500' : 'text-blue-500'}>{userRole}</strong></p>
                </div>
                
                <div className="flex gap-2 print:hidden">
                    {/* Bottoncino temporaneo per farti provare lo switch di ruolo */}
                    <button 
                        onClick={() => setUserRole(userRole === 'ADMIN' ? 'PROF' : 'ADMIN')}
                        className="mr-4 text-sm underline text-gray-400"
                    >
                        Cambia in {userRole === 'ADMIN' ? 'Prof' : 'Admin'}
                    </button>

                    <select 
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border border-slate-300 rounded px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                    >
                        <option value="A CD">Classe 5A CD</option>
                        <option value="B CT">Classe 5B CT</option>
                        <option value="C CD - CT">Classe 5C CD - CT</option>
                        <option value="C-CD">Classe 5C-CD</option>
                        <option value="L">Classe 5L</option>
                    </select>
                    
                    <button onClick={fetchTimetable} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50">
                        {isLoading ? 'Carico...' : 'Cerca'}
                    </button>
                </div>
            </div>

            {/* TABELLA */}
            <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-center min-w-[800px] border-collapse">
                    <thead>
                        <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wide">
                            <th className="p-3 border border-slate-200 w-24">Ora</th>
                            {giorni.map(g => <th key={g} className="p-3 border border-slate-200 w-1/5">{g}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {error && (<tr><td colSpan={6} className="p-8 text-red-500 bg-red-50 font-bold">{error}</td></tr>)}
                        {!gridData && !error && (<tr><td colSpan={6} className="p-12 text-slate-500 text-lg">Seleziona una classe e clicca Cerca.</td></tr>)}

                        {gridData && gridData.map((riga, index) => (
                            <React.Fragment key={`riga-${index}`}>
                                <tr className="hover:bg-slate-50 transition-colors">
                                    <td className="p-2 border border-slate-200 bg-slate-50 font-bold text-slate-800">
                                        {index + 1}° Ora<br/><span className="text-xs font-normal text-slate-500">{orariFasce[index]}</span>
                                    </td>

                                    {giorni.map(giorno => {
                                        const lezioni = riga[giorno];
                                        const isEmpty = !lezioni || lezioni.length === 0 || lezioni[0].materia.includes("Ora libera");
                                        const isAdmin = userRole === 'ADMIN';

                                        return (
                                            <td 
                                                key={`${index}-${giorno}`} 
                                                onClick={() => handleCellClick(giorno, index + 1, isEmpty ? null : lezioni[0])}
                                                // Se sei admin, aggiungo gli stili per farti capire che è cliccabile
                                                className={`p-2 border border-slate-200 align-top transition-colors
                                                    ${isAdmin ? 'cursor-pointer hover:bg-blue-100 hover:border-blue-400' : ''} 
                                                    ${isEmpty ? 'bg-slate-50/50' : 'bg-white'}
                                                `}
                                                title={isAdmin ? "Clicca per modificare" : ""}
                                            >
                                                {!isEmpty && lezioni.map((lezione, i) => (
                                                    <div key={i} className="flex flex-col gap-1 text-sm pb-1">
                                                        <span className="font-bold text-slate-800">{lezione.materia}</span>
                                                        <span className="text-xs text-slate-700">👨‍🏫 {getDocente(lezione)}</span>
                                                        <span className="text-xs text-black font-semibold">📍 Aula: {getAula(lezione)}</span>
                                                    </div>
                                                ))}
                                                {isEmpty && isAdmin && <span className="text-xs text-slate-400 opacity-0 hover:opacity-100">+ Aggiungi</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODALE DI MODIFICA (Visibile solo all'Admin quando clicca una cella) */}
            {isEditModalOpen && editingCell && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h2 className="text-xl font-bold mb-4">Modifica Ora</h2>
                        <p className="text-sm text-gray-500 mb-4">{editingCell.giorno} - {editingCell.ora}° Ora</p>
                        
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-semibold text-gray-700">Materia</label>
                            <input 
                                type="text" 
                                value={editingCell.dati.materia || ''} 
                                onChange={(e) => setEditingCell({...editingCell, dati: {...editingCell.dati, materia: e.target.value}})}
                                className="border p-2 rounded" 
                                placeholder="es. MATEMATICA"
                            />

                            <label className="text-sm font-semibold text-gray-700">Aula</label>
                            <input 
                                type="text" 
                                value={editingCell.dati.aula || ''} 
                                onChange={(e) => setEditingCell({...editingCell, dati: {...editingCell.dati, aula: e.target.value}})}
                                className="border p-2 rounded" 
                                placeholder="es. A12"
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded">Annulla</button>
                            <button onClick={handleSaveCell} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded">Salva Modifica</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default Orario;