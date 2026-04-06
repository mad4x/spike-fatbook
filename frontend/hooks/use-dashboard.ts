'use client';

import { useCallback, useEffect, useState } from 'react';
import { Assenza } from '@/constants/types';
import { getBaseUrl } from '@/lib/api-url';
import {
  computeTodayCoverage,
  getFriendlyAssenzeError,
  isTodayCovered,
  normalizeAssenza
} from '@/lib/assenze';
import { fetchWithAuth, getRolesFromToken, hasDocenteRole, hasVicepresidenzaRole } from '@/lib/jwt';

interface UseDashboardResult {
  docentiAssentiCount: number;
  oreDaCoprire: number;
  loading: boolean;
  error: string | null;
  networkError: string | null;
  canManageAvvisi: boolean;
  canCreateAssenze: boolean;
}

export function useDashboard(): UseDashboardResult {
  const roles = getRolesFromToken();
  const canManageAvvisi = hasVicepresidenzaRole(roles);
  const canCreateAssenze = canManageAvvisi || hasDocenteRole(roles);

  const [assenze, setAssenze] = useState<Assenza[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  const fetchAssenzeOggi = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNetworkError(null);

      const oggi = new Date().toISOString().slice(0, 10);
      const response = await fetchWithAuth(
        `${getBaseUrl()}/assenze?data=${oggi}`,
        { method: 'GET', cache: 'no-store' }
      );

      if (!response.ok) {
        setError(getFriendlyAssenzeError(response.status));
        return;
      }

      const data = await response.json();
      const normalized = Array.isArray(data) ? data.map(normalizeAssenza) : [];
      setAssenze(normalized);
    } catch (err) {
      console.error('Errore caricamento assenze dashboard:', err);
      setNetworkError('NetworkError: impossibile contattare il backend.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAssenzeOggi();
  }, [fetchAssenzeOggi]);

  const assenzeDiOggi = assenze.filter((a) =>
    isTodayCovered(a.dataInizio, a.dataFine)
  );

  const docentiUnici = new Set(
    assenzeDiOggi.map((a) => a.docenteId).filter((id): id is number => id !== null)
  );

  const oreDaCoprire = computeTodayCoverage(assenzeDiOggi);

  return {
    docentiAssentiCount: docentiUnici.size,
    oreDaCoprire,
    loading,
    error,
    networkError,
    canManageAvvisi,
    canCreateAssenze
  };
}
