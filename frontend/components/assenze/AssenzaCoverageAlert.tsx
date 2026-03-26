interface AssenzaCoverageAlertProps {
  oreDaCoprire: number;
  isVisible: boolean;
}

export function AssenzaCoverageAlert({ oreDaCoprire, isVisible }: AssenzaCoverageAlertProps) {
  if (!isVisible || oreDaCoprire <= 0) {
    return null;
  }

  return (
    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
      <p className="text-red-700 font-semibold">Attenzione: {oreDaCoprire} ore da coprire oggi!</p>
      <p className="text-red-600 text-sm">Verifica il modulo sostituzioni per assegnare i docenti disponibili.</p>
    </div>
  );
}
