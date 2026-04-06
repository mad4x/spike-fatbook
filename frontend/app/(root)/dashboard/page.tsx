'use client';

import Link from 'next/link';
import { AlertTriangle, CalendarDays, Clock, Plus, Search, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboard } from '@/hooks/use-dashboard';

export default function DashboardPage() {
  const {
    docentiAssentiCount,
    oreDaCoprire,
    loading,
    error,
    networkError,
    canManageAvvisi,
    canCreateAssenze
  } = useDashboard();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Panoramica del giorno e azioni rapide</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Widget 1: Docenti Assenti Oggi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Docenti Assenti Oggi</h2>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-800">{docentiAssentiCount}</p>
              )}
            </div>
          </div>
          {(error || networkError) && (
            <p className="text-xs text-red-600 mt-2">{error || networkError}</p>
          )}
        </div>

        {/* Widget 2: Ore da Coprire Oggi */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Clock size={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-500">Ore da Coprire Oggi</h2>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-800">{oreDaCoprire}</p>
              )}
            </div>
          </div>
          {!loading && oreDaCoprire > 0 && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-orange-700 bg-orange-50 rounded-md px-2 py-1">
              <AlertTriangle size={12} />
              <span>Da coprire manualmente</span>
            </div>
          )}
          {(error || networkError) && (
            <p className="text-xs text-red-600 mt-2">{error || networkError}</p>
          )}
        </div>

        {/* Widget 3: Azioni Rapide */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <CalendarDays size={24} />
            </div>
            <h2 className="text-sm font-medium text-gray-500">Azioni Rapide</h2>
          </div>
          <div className="flex flex-col gap-2">
            {canCreateAssenze && (
              <Link href="/assenze">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                  <Plus size={16} className="text-gray-500" />
                  <span>{canManageAvvisi ? 'Nuova Assenza' : 'Segnala Malattia'}</span>
                </button>
              </Link>
            )}
            {canManageAvvisi && (
              <Link href="/vicepresidenza">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                  <Plus size={16} className="text-gray-500" />
                  <span>Nuovo Avviso</span>
                </button>
              </Link>
            )}
            <Link href="/orario">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left">
                <Search size={16} className="text-gray-500" />
                <span>Cerca Orario</span>
              </button>
            </Link>
            {!canCreateAssenze && !canManageAvvisi && (
              <p className="text-xs text-gray-500 mt-1">Nessuna azione rapida disponibile per il tuo profilo.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
