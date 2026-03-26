export interface DocenteResponseDTO {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    laboratorio: boolean;
    materie: string[];
}

export type TipologiaAssenza = 'MALATTIA' | 'PERMESSO' | 'ALTRO';
export type FiltroTipologiaAssenza = 'TUTTE' | TipologiaAssenza;

export interface Assenza {
    id: number;
    docenteId: number | null;
    docenteNome: string;
    docenteCognome: string;
    docenteEmail: string;
    dataInizio: string;
    dataFine: string;
    tipologia: TipologiaAssenza;
    note: string;
    oreScoperte: number;
}

export interface AssenzaFormData {
    docenteId: number | null;
    dataInizio: string;
    dataFine: string;
    tipologia: TipologiaAssenza;
    note: string;
}

export interface AssenzaWritePayload {
    docenteId: number;
    dataInizio: string;
    dataFine: string;
    tipologia: TipologiaAssenza;
    note: string;
}

export const ASSENZA_INITIAL_FORM_DATA: AssenzaFormData = {
    docenteId: null,
    dataInizio: '',
    dataFine: '',
    tipologia: 'MALATTIA',
    note: ''
};

export type PrioritaAvviso = 'NORMALE' | 'ALTA';
export type StatoAvviso = 'BOZZA' | 'PUBBLICATO';
export type FiltroPrioritaAvviso = 'TUTTE' | PrioritaAvviso;

export interface Avviso {
    id: number;
    titolo: string;
    contenuto: string;
    dataCreazione: string;
    dataAggiornamento?: string | null;
    autore: string;
    priorita: PrioritaAvviso;
    stato: StatoAvviso;
    categoria: string;
    tags: string[];
    allegati: string[];
    creatoDa?: string | null;
    aggiornatoDa?: string | null;
}

export interface AvvisoFormData {
    titolo: string;
    contenuto: string;
    autore: string;
    categoria: string;
    priorita: PrioritaAvviso;
    stato: StatoAvviso;
    tagsInput: string;
    allegatiInput: string;
}

export interface AvvisoWritePayload {
    titolo: string;
    contenuto: string;
    autore: string;
    categoria: string;
    priorita: PrioritaAvviso;
    stato: StatoAvviso;
    tags: string[];
    allegati: string[];
}

export const AVVISO_INITIAL_FORM_DATA: AvvisoFormData = {
    titolo: '',
    contenuto: '',
    autore: '',
    categoria: 'Generale',
    priorita: 'NORMALE',
    stato: 'PUBBLICATO',
    tagsInput: '',
    allegatiInput: ''
};