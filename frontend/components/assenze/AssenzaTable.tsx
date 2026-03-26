import { Button } from '@/components/ui/button';
import { Assenza } from '@/constants/types';
import { formatDateRange } from '@/lib/assenze';

interface AssenzaTableProps {
  assenze: Assenza[];
  canManageAssenze: boolean;
  onEdit: (assenza: Assenza) => void;
  onDelete: (id: number) => void;
  isDeleting: boolean;
}

export function AssenzaTable({
  assenze,
  canManageAssenze,
  onEdit,
  onDelete,
  isDeleting
}: AssenzaTableProps) {
  if (assenze.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center text-gray-500">
        Nessuna assenza trovata con i filtri selezionati.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Docente</th>
              <th className="px-4 py-3 text-left">Periodo</th>
              <th className="px-4 py-3 text-left">Tipologia</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-left">Ore Scoperte</th>
              {canManageAssenze && <th className="px-4 py-3 text-right">Azioni</th>}
            </tr>
          </thead>
          <tbody>
            {assenze.map((assenza) => (
              <tr key={assenza.id} className="border-t border-gray-100 align-top">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800">
                    {assenza.docenteNome || '-'} {assenza.docenteCognome || ''}
                  </p>
                  <p className="text-xs text-gray-500">{assenza.docenteEmail || '-'}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{formatDateRange(assenza.dataInizio, assenza.dataFine)}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-md border border-gray-200 px-2 py-1 text-xs font-medium bg-gray-50">
                    {assenza.tipologia}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 max-w-xs break-words">{assenza.note || '-'}</td>
                <td className="px-4 py-3">
                  <span className={
                    assenza.oreScoperte > 0
                      ? 'inline-flex rounded-md bg-red-100 text-red-700 px-2 py-1 text-xs font-semibold'
                      : 'inline-flex rounded-md bg-green-100 text-green-700 px-2 py-1 text-xs font-semibold'
                  }>
                    {assenza.oreScoperte}
                  </span>
                </td>
                {canManageAssenze && (
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => onEdit(assenza)}>
                        Modifica
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(assenza.id)}
                        disabled={isDeleting}
                      >
                        Elimina
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
