'use client';

import { useEffect, useState } from 'react';
import { getBaseUrl } from '@/lib/api-url';

interface Avviso {
  id: number;
  titolo: string;
  categoria: string;
  data: string;
  letto: boolean;
  descrizione?: string;
}

interface FormData {
  titolo: string;
  descrizione: string;
  categoria: string;
}

export default function AvvisiPage() {
  const [avvisi, setAvvisi] = useState<Avviso[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userRole = 'vicepreside';
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('Tutte');

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    titolo: '',
    descrizione: '',
    categoria: 'Comunicazione - Circolare'
  });

  useEffect(() => {
    const fetchAvvisi = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${getBaseUrl()}/avvisi`, { cache: 'no-store' });

        if (!response.ok) {
          throw new Error(`Errore del server: ${response.status}`);
        }

        const data = await response.json();
        setAvvisi(data);
      } catch (err) {
        console.error('Errore di connessione:', err);
        setError('Impossibile contattare il server. Verifica che il backend Spring Boot sia acceso.');
      } finally {
        setLoading(false);
      }
    };

    fetchAvvisi();
  }, []);

  const segnaTuttiComeLetti = () => {
    setAvvisi(avvisi.map((avviso) => ({ ...avviso, letto: true })));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nuovoAvviso: Avviso = {
      id: Date.now(),
      titolo: formData.titolo,
      categoria: formData.categoria,
      data: new Date().toLocaleDateString('it-IT').replace(/\//g, '-'),
      letto: false,
      descrizione: formData.descrizione
    };

    setAvvisi([nuovoAvviso, ...avvisi]);
    setIsModalOpen(false);
    setFormData({ titolo: '', descrizione: '', categoria: 'Comunicazione - Circolare' });
  };

  const avvisiFiltrati = avvisi.filter((avviso) => {
    const matchRicerca = avviso.titolo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = filtroCategoria === 'Tutte' || avviso.categoria?.includes(filtroCategoria);
    return matchRicerca && matchCategoria;
  });

  const daLeggere = avvisiFiltrati.filter((a) => !a.letto);
  const tuttiGliAltri = avvisiFiltrati.filter((a) => a.letto);

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Avvisi</h1>
          <p className="text-gray-500 mt-1">Istituto C. GRASSI - A.S. 2025/2026</p>
        </div>
        <button
          onClick={segnaTuttiComeLetti}
          className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg transition"
        >
          <span>✓</span> Segna come già letti
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 shadow-sm">
          <p className="font-bold flex items-center gap-2">⚠️ Attenzione</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-xl mb-8 flex flex-wrap gap-4 items-center border border-gray-100 shadow-sm">
        <div className="flex-1 min-w-[250px]">
          <input
            type="text"
            placeholder="Cerca nella bacheca..."
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-64">
          <select
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="Tutte">Tipologia comunicazione</option>
            <option value="Comunicazione - Circolare">Circolari</option>
            <option value="Comunicazione - Scuola/famiglia">Scuola/Famiglia</option>
          </select>
        </div>

        {userRole === 'vicepreside' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow transition"
          >
            + Nuovo Avviso
          </button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
          {[1, 2].map((n) => (
            <div key={n} className="h-16 bg-gray-100 rounded-lg w-full"></div>
          ))}
        </div>
      ) : (
        !error && (
          <div className="space-y-8">
            {avvisi.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500 text-lg">Nessun avviso presente nel database.</p>
                <p className="text-gray-400 text-sm mt-2">Usa il tasto "+ Nuovo Avviso" per crearne uno.</p>
              </div>
            )}

            {daLeggere.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white bg-yellow-500 px-4 py-2 rounded-t-lg inline-block">Da leggere</h2>
                <div className="bg-white border border-yellow-200 rounded-b-lg rounded-tr-lg shadow-sm overflow-hidden">
                  {daLeggere.map((avviso) => (
                    <div
                      key={avviso.id}
                      className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-yellow-50 transition"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                        <div>
                          <p className="font-bold text-gray-800">{avviso.titolo}</p>
                          <p className="text-sm text-gray-500">{avviso.categoria}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-600 w-32 text-center">{avviso.data}</div>
                      <button className="text-blue-600 hover:text-blue-800 flex flex-col items-center justify-center p-2">
                        <span className="text-xl">👁️</span>
                        <span className="text-xs font-semibold">Visualizza</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tuttiGliAltri.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-white bg-gray-400 px-4 py-2 rounded-t-lg inline-block">
                  Tutte le comunicazioni
                </h2>
                <div className="bg-white border border-gray-200 rounded-b-lg rounded-tr-lg shadow-sm overflow-hidden">
                  {tuttiGliAltri.map((avviso) => (
                    <div
                      key={avviso.id}
                      className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-gray-50 transition opacity-80 hover:opacity-100"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-5 h-5 border-2 border-gray-300 rounded flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-gray-400 rounded-sm"></div>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-700">{avviso.titolo}</p>
                          <p className="text-sm text-gray-500">{avviso.categoria}</p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 w-32 text-center">{avviso.data}</div>
                      <button className="text-gray-500 hover:text-blue-600 flex flex-col items-center justify-center p-2">
                        <span className="text-xl">👁️</span>
                        <span className="text-xs font-semibold">Visualizza</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      )}

      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-gray-500/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Nuova Comunicazione</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titolo Comunicazione</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Es. 1368 - Avvisi per il giorno..."
                  value={formData.titolo}
                  onChange={(e) => setFormData({ ...formData, titolo: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                >
                  <option value="Comunicazione - Circolare">Circolare</option>
                  <option value="Comunicazione - Scuola/famiglia">Scuola/Famiglia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Testo Avviso</label>
                <textarea
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  placeholder="Scrivi il contenuto dell'avviso..."
                  value={formData.descrizione}
                  onChange={(e) => setFormData({ ...formData, descrizione: e.target.value })}
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition shadow"
                >
                  Pubblica
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
