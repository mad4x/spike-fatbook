"use client";

import { useEffect, useState } from "react";

import { getBaseUrl } from "@/lib/api-url";
import {
  normalizeOrarioEntry,
  SCHOOL_DAYS,
  type NormalizedOrarioEntry,
  type SchoolDay,
} from "@/lib/orario";

const HOURS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") {
    return {};
  }

  const token = window.localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCells(
  entries: NormalizedOrarioEntry[],
  day: SchoolDay,
  hour: number,
): NormalizedOrarioEntry[] {
  return entries.filter((entry) => entry.day === day && entry.hour === hour);
}

export default function DashboardPage() {
  const [entries, setEntries] = useState<NormalizedOrarioEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeeklyOrario = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${getBaseUrl()}/orario/weekly`, {
          cache: "no-store",
          headers: getAuthHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Errore API: ${response.status}`);
        }

        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Formato risposta non valido");
        }

        setEntries(data.map(normalizeOrarioEntry));
      } catch (e) {
        const message = e instanceof Error ? e.message : "Errore sconosciuto";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void fetchWeeklyOrario();
  }, []);

  return (
    <section className="mx-4 my-6 space-y-4">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-600">Orario settimanale docente.</p>
      </header>

      {loading && <p className="text-sm text-slate-600">Caricamento orario in corso...</p>}

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Impossibile caricare l&apos;orario: {error}
        </p>
      )}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-700">
                <th className="border border-slate-200 px-3 py-2 text-left">Ora</th>
                {SCHOOL_DAYS.map((day) => (
                  <th key={day} className="border border-slate-200 px-3 py-2 text-left">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {HOURS.map((hour) => (
                <tr key={`dashboard-${hour}`}>
                  <td className="border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-800">
                    {hour}
                  </td>

                  {SCHOOL_DAYS.map((day) => {
                    const cells = getCells(entries, day, hour);

                    return (
                      <td key={`dashboard-${day}-${hour}`} className="border border-slate-200 px-3 py-2 align-top">
                        {cells.length === 0 ? (
                          <p className="font-medium text-slate-400">-</p>
                        ) : (
                          <div className="space-y-2">
                            {cells.map((cell, index) => (
                              <div key={`${cell.className}-${cell.subject}-${index}`} className="rounded-md bg-slate-50 px-2 py-1">
                                <p className="font-medium text-slate-900">{cell.subject}</p>
                                <p className="text-xs text-slate-600">Classe {cell.className}</p>
                                {cell.classroom && <p className="text-xs text-slate-500">Aula {cell.classroom}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
