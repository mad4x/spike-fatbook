import {
  Assenza,
  AssenzaFormData,
  AssenzaWritePayload,
  FiltroTipologiaAssenza,
  TipologiaAssenza
} from '@/constants/types';

const isValidDate = (value: string) => {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

const normalizeIsoDate = (value: unknown) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    return '';
  }

  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }

  return parsed.toISOString().slice(0, 10);
};

const normalizeTipologia = (value: unknown): TipologiaAssenza => {
  if (value === 'PERMESSO' || value === 'ALTRO') {
    return value;
  }
  return 'MALATTIA';
};

const toNumberOrNull = (value: unknown): number | null => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toInteger = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.floor(parsed)) : fallback;
};

export const normalizeAssenza = (raw: unknown): Assenza => {
  const value = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const docenteValue = typeof value.docente === 'object' && value.docente !== null
    ? (value.docente as Record<string, unknown>)
    : {};

  const rawDateStart = value.dataInizio ?? value.data;
  const rawDateEnd = value.dataFine ?? value.data;

  const dataInizio = normalizeIsoDate(rawDateStart);
  const dataFine = normalizeIsoDate(rawDateEnd) || dataInizio;

  const computedOreScoperte =
    value.oreScoperte !== undefined
      ? toInteger(value.oreScoperte)
      : value.giornaliera === true
        ? 6
        : value.ora !== undefined && value.ora !== null
          ? 1
          : 0;

  return {
    id: toInteger(value.id, Date.now()),
    docenteId: toNumberOrNull(value.docenteId ?? docenteValue.id),
    docenteNome: typeof value.docenteNome === 'string' ? value.docenteNome : (typeof docenteValue.nome === 'string' ? docenteValue.nome : ''),
    docenteCognome:
      typeof value.docenteCognome === 'string'
        ? value.docenteCognome
        : (typeof docenteValue.cognome === 'string' ? docenteValue.cognome : ''),
    docenteEmail:
      typeof value.docenteEmail === 'string'
        ? value.docenteEmail
        : (typeof docenteValue.email === 'string' ? docenteValue.email : ''),
    dataInizio,
    dataFine,
    tipologia: normalizeTipologia(value.tipologia),
    note: typeof value.note === 'string' ? value.note : (typeof value.motivazione === 'string' ? value.motivazione : ''),
    oreScoperte: computedOreScoperte
  };
};

export const filterAssenze = (
  assenze: Assenza[],
  searchTerm: string,
  filtroTipologia: FiltroTipologiaAssenza,
  selectedDate: string
) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return assenze.filter((assenza) => {
    const matchSearch =
      normalizedSearch.length === 0 ||
      `${assenza.docenteNome} ${assenza.docenteCognome}`.toLowerCase().includes(normalizedSearch) ||
      assenza.docenteEmail.toLowerCase().includes(normalizedSearch) ||
      assenza.note.toLowerCase().includes(normalizedSearch);

    const matchTipologia = filtroTipologia === 'TUTTE' || assenza.tipologia === filtroTipologia;

    const matchDate =
      selectedDate.trim().length === 0 ||
      (selectedDate >= assenza.dataInizio && selectedDate <= assenza.dataFine);

    return matchSearch && matchTipologia && matchDate;
  });
};

export const isTodayCovered = (dataInizio: string, dataFine: string) => {
  if (!dataInizio || !dataFine) {
    return false;
  }
  const today = new Date().toISOString().slice(0, 10);
  return today >= dataInizio && today <= dataFine;
};

export const computeTodayCoverage = (assenze: Assenza[]) => {
  return assenze.reduce((total, assenza) => {
    if (!isTodayCovered(assenza.dataInizio, assenza.dataFine)) {
      return total;
    }
    return total + assenza.oreScoperte;
  }, 0);
};

export const formatDateRange = (dataInizio: string, dataFine: string) => {
  if (!dataInizio || !isValidDate(dataInizio)) {
    return '-';
  }

  if (!dataFine || !isValidDate(dataFine)) {
    return dataInizio;
  }

  if (dataInizio === dataFine) {
    return dataInizio;
  }

  return `${dataInizio} → ${dataFine}`;
};

export const buildAssenzaPayload = (formData: AssenzaFormData): AssenzaWritePayload | null => {
  if (formData.docenteId === null || !formData.dataInizio || !formData.dataFine) {
    return null;
  }

  return {
    docenteId: formData.docenteId,
    dataInizio: formData.dataInizio,
    dataFine: formData.dataFine,
    tipologia: formData.tipologia,
    note: formData.note.trim()
  };
};

export const getFriendlyAssenzeError = (status?: number) => {
  if (status === 401 || status === 403) {
    return 'Accesso negato: non hai i permessi per visualizzare o modificare le assenze.';
  }

  if (status === 404) {
    return 'Endpoint assenze non disponibile sul backend. Verifica che il modulo API sia stato pubblicato.';
  }

  if (status && status >= 500) {
    return 'Errore interno del server durante il caricamento delle assenze.';
  }

  return 'Errore inatteso durante la gestione delle assenze.';
};
