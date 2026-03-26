import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FiltroTipologiaAssenza } from '@/constants/types';

interface AssenzeFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDate: string;
  onDateChange: (value: string) => void;
  filtroTipologia: FiltroTipologiaAssenza;
  onFiltroTipologiaChange: (value: FiltroTipologiaAssenza) => void;
  canManageAssenze: boolean;
  onCreateClick: () => void;
}

export function AssenzeFilters({
  searchTerm,
  onSearchChange,
  selectedDate,
  onDateChange,
  filtroTipologia,
  onFiltroTipologiaChange,
  canManageAssenze,
  onCreateClick
}: AssenzeFiltersProps) {
  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
      <Input
        placeholder="Cerca docente o note..."
        value={searchTerm}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <Input
        type="date"
        value={selectedDate}
        onChange={(event) => onDateChange(event.target.value)}
      />

      <select
        className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
        value={filtroTipologia}
        onChange={(event) => onFiltroTipologiaChange(event.target.value as FiltroTipologiaAssenza)}
      >
        <option value="TUTTE">Tutte le tipologie</option>
        <option value="MALATTIA">Malattia</option>
        <option value="PERMESSO">Permesso</option>
        <option value="ALTRO">Altro</option>
      </select>

      {canManageAssenze && (
        <Button className="w-full" onClick={onCreateClick}>
          Registra Assenza
        </Button>
      )}
    </div>
  );
}
