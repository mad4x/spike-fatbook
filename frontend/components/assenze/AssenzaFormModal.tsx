import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { AssenzaFormData, DocenteResponseDTO, TipologiaAssenza } from '@/constants/types';

interface AssenzaFormModalProps {
  isOpen: boolean;
  mode: 'create' | 'edit';
  formData: AssenzaFormData;
  onFormDataChange: (data: AssenzaFormData) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isSubmitting: boolean;
  docenti: DocenteResponseDTO[];
  canManageAssenze: boolean;
  onDelete?: () => void;
  isDeleting?: boolean;
}

const tipologie: TipologiaAssenza[] = ['MALATTIA', 'PERMESSO', 'ALTRO'];

export function AssenzaFormModal({
  isOpen,
  mode,
  formData,
  onFormDataChange,
  onSubmit,
  onClose,
  isSubmitting,
  docenti,
  canManageAssenze,
  onDelete,
  isDeleting = false
}: AssenzaFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Registra Assenza' : 'Modifica Assenza'}
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        {canManageAssenze && (
          <div>
            <label className="text-sm font-medium text-gray-700">Docente</label>
            <select
              className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={formData.docenteId ?? ''}
              onChange={(event) =>
                onFormDataChange({
                  ...formData,
                  docenteId: event.target.value ? Number(event.target.value) : null
                })
              }
              required
            >
              <option value="">Seleziona docente</option>
              {docenti.map((docente) => (
                <option key={docente.id} value={docente.id}>
                  {docente.cognome} {docente.nome}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">Data Inizio</label>
            <input
              type="date"
              className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={formData.dataInizio}
              onChange={(event) => onFormDataChange({ ...formData, dataInizio: event.target.value })}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Data Fine</label>
            <input
              type="date"
              className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              value={formData.dataFine}
              onChange={(event) => onFormDataChange({ ...formData, dataFine: event.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Tipologia</label>
          <select
            className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
            value={formData.tipologia}
            onChange={(event) =>
              onFormDataChange({
                ...formData,
                tipologia: event.target.value as TipologiaAssenza
              })
            }
          >
            {tipologie.map((tipologia) => (
              <option key={tipologia} value={tipologia}>
                {tipologia}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Note</label>
          <textarea
            className="mt-1 min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
            placeholder="Note opzionali..."
            value={formData.note}
            onChange={(event) => onFormDataChange({ ...formData, note: event.target.value })}
          />
        </div>

        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            {mode === 'edit' && onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete} disabled={isDeleting}>
                Elimina
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {mode === 'create' ? 'Salva assenza' : 'Aggiorna assenza'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
