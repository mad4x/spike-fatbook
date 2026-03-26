import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  ASSENZA_INITIAL_FORM_DATA,
  Assenza,
  AssenzaFormData,
  DocenteResponseDTO,
  FiltroTipologiaAssenza
} from '@/constants/types';
import { getBaseUrl } from '@/lib/api-url';
import {
  buildAssenzaPayload,
  computeTodayCoverage,
  filterAssenze,
  getFriendlyAssenzeError,
  normalizeAssenza
} from '@/lib/assenze';
import { fetchWithAuth, getToken, getUserInfo, getRolesFromToken, hasVicepresidenzaRole } from '@/lib/jwt';

export function useAssenze() {
  const [assenze, setAssenze] = useState<Assenza[]>([]);
  const [docenti, setDocenti] = useState<DocenteResponseDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [filtroTipologia, setFiltroTipologia] = useState<FiltroTipologiaAssenza>('TUTTE');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedAssenza, setSelectedAssenza] = useState<Assenza | null>(null);

  const [createFormData, setCreateFormData] = useState<AssenzaFormData>(ASSENZA_INITIAL_FORM_DATA);
  const [editFormData, setEditFormData] = useState<AssenzaFormData>(ASSENZA_INITIAL_FORM_DATA);

  const canManageAssenze = hasVicepresidenzaRole(userRoles);

  useEffect(() => {
    const roles = getRolesFromToken();
    const token = getToken();
    const user = getUserInfo(token);

    setUserRoles(roles);
    setCurrentUserEmail(user.email.toLowerCase());
  }, []);

  const fetchAssenze = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNetworkError(null);

      const query = new URLSearchParams();
      if (selectedDate.trim()) {
        query.set('data', selectedDate);
      }

      const queryString = query.toString();
      const response = await fetchWithAuth(`${getBaseUrl()}/assenze${queryString ? `?${queryString}` : ''}`, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!response.ok) {
        setError(getFriendlyAssenzeError(response.status));
        setAssenze([]);
        return;
      }

      const data = await response.json();
      const normalized = Array.isArray(data) ? data.map(normalizeAssenza) : [];
      setAssenze(normalized);
    } catch (err) {
      console.error('Errore caricamento assenze:', err);
      setNetworkError('NetworkError: impossibile contattare il backend assenze.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  const fetchDocenti = useCallback(async () => {
    if (!canManageAssenze) {
      setDocenti([]);
      return;
    }

    try {
      const response = await fetchWithAuth(`${getBaseUrl()}/docenti`, {
        method: 'GET',
        cache: 'no-store'
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setDocenti(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Errore caricamento docenti:', err);
    }
  }, [canManageAssenze]);

  useEffect(() => {
    void fetchAssenze();
  }, [fetchAssenze]);

  useEffect(() => {
    void fetchDocenti();
  }, [fetchDocenti]);

  const ownAssenze = useMemo(() => {
    if (canManageAssenze) {
      return assenze;
    }

    if (!currentUserEmail) {
      return assenze;
    }

    return assenze.filter((item) => item.docenteEmail.toLowerCase() === currentUserEmail);
  }, [assenze, canManageAssenze, currentUserEmail]);

  const assenzeFiltrate = useMemo(
    () => filterAssenze(ownAssenze, searchTerm, filtroTipologia, selectedDate),
    [ownAssenze, searchTerm, filtroTipologia, selectedDate]
  );

  const oreDaCoprireOggi = useMemo(
    () => computeTodayCoverage(assenzeFiltrate),
    [assenzeFiltrate]
  );

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setCreateFormData(ASSENZA_INITIAL_FORM_DATA);
  };

  const openEditModal = (assenza: Assenza) => {
    setSelectedAssenza(assenza);
    setEditFormData({
      docenteId: assenza.docenteId,
      dataInizio: assenza.dataInizio,
      dataFine: assenza.dataFine,
      tipologia: assenza.tipologia,
      note: assenza.note
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedAssenza(null);
    setIsEditModalOpen(false);
    setEditFormData(ASSENZA_INITIAL_FORM_DATA);
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsSaving(true);
      setError(null);
      setNetworkError(null);

      const payload = buildAssenzaPayload(createFormData);
      if (!payload) {
        setError('Compila docente, data inizio e data fine prima di salvare.');
        return;
      }

      const response = await fetchWithAuth(`${getBaseUrl()}/assenze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setError(getFriendlyAssenzeError(response.status));
        return;
      }

      const created = normalizeAssenza(await response.json());
      setAssenze((previous) => [created, ...previous]);
      closeCreateModal();
    } catch (err) {
      console.error('Errore creazione assenza:', err);
      setNetworkError('NetworkError: impossibile registrare l\'assenza.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedAssenza) {
      return;
    }

    try {
      setIsUpdating(true);
      setError(null);
      setNetworkError(null);

      const payload = buildAssenzaPayload(editFormData);
      if (!payload) {
        setError('Compila docente, data inizio e data fine prima di salvare.');
        return;
      }

      const response = await fetchWithAuth(`${getBaseUrl()}/assenze/${selectedAssenza.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        setError(getFriendlyAssenzeError(response.status));
        return;
      }

      const updated = normalizeAssenza(await response.json());
      setAssenze((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
      closeEditModal();
    } catch (err) {
      console.error('Errore modifica assenza:', err);
      setNetworkError('NetworkError: impossibile aggiornare l\'assenza.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Confermi l\'eliminazione dell\'assenza selezionata?');
    if (!confirmed) {
      return;
    }

    try {
      setIsDeleting(true);
      setError(null);
      setNetworkError(null);

      const response = await fetchWithAuth(`${getBaseUrl()}/assenze/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok && response.status !== 204) {
        setError(getFriendlyAssenzeError(response.status));
        return;
      }

      setAssenze((previous) => previous.filter((item) => item.id !== id));
      if (selectedAssenza?.id === id) {
        closeEditModal();
      }
    } catch (err) {
      console.error('Errore eliminazione assenza:', err);
      setNetworkError('NetworkError: impossibile eliminare l\'assenza.');
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    assenzeFiltrate,
    docenti,
    loading,
    error,
    networkError,
    canManageAssenze,
    searchTerm,
    setSearchTerm,
    selectedDate,
    setSelectedDate,
    filtroTipologia,
    setFiltroTipologia,
    oreDaCoprireOggi,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    selectedAssenza,
    createFormData,
    setCreateFormData,
    editFormData,
    setEditFormData,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    handleCreateSubmit,
    handleEditSubmit,
    handleDelete,
    isSaving,
    isUpdating,
    isDeleting
  };
}
