'use client';

import { AssenzaCoverageAlert } from '@/components/assenze/AssenzaCoverageAlert';
import { AssenzaFormModal } from '@/components/assenze/AssenzaFormModal';
import { AssenzaTable } from '@/components/assenze/AssenzaTable';
import { AssenzeFilters } from '@/components/assenze/AssenzeFilters';
import { AlertBanner } from '@/components/avvisi/AlertBanner';
import { useAssenze } from '@/hooks/use-assenze';

export default function AssenzePage() {
  const {
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
  } = useAssenze();

  return (
    <div className="p-8 max-w-6xl mx-auto relative">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Assenze</h1>
          <p className="text-gray-500 mt-1">
            {canManageAssenze
              ? 'Monitora assenze docenti e ore da coprire in tempo reale.'
              : 'Visualizza le tue assenze registrate durante l\'anno scolastico.'}
          </p>
        </div>
      </div>

      {error && <AlertBanner title="Attenzione" message={error} />}
      {networkError && <AlertBanner title="NetworkError" message={networkError} />}

      <AssenzaCoverageAlert isVisible={canManageAssenze} oreDaCoprire={oreDaCoprireOggi} />

      <AssenzeFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        filtroTipologia={filtroTipologia}
        onFiltroTipologiaChange={setFiltroTipologia}
        canManageAssenze={canManageAssenze}
        onCreateClick={() => setIsCreateModalOpen(true)}
      />

      {loading ? (
        <div className="animate-pulse space-y-3">
          <div className="h-10 rounded-md bg-gray-100" />
          <div className="h-10 rounded-md bg-gray-100" />
          <div className="h-10 rounded-md bg-gray-100" />
        </div>
      ) : (
        <AssenzaTable
          assenze={assenzeFiltrate}
          canManageAssenze={canManageAssenze}
          onEdit={openEditModal}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}

      {canManageAssenze && (
        <>
          <AssenzaFormModal
            isOpen={isCreateModalOpen}
            mode="create"
            formData={createFormData}
            onFormDataChange={setCreateFormData}
            onSubmit={handleCreateSubmit}
            onClose={closeCreateModal}
            isSubmitting={isSaving}
            docenti={docenti}
            canManageAssenze={canManageAssenze}
          />

          <AssenzaFormModal
            isOpen={isEditModalOpen && !!selectedAssenza}
            mode="edit"
            formData={editFormData}
            onFormDataChange={setEditFormData}
            onSubmit={handleEditSubmit}
            onClose={closeEditModal}
            isSubmitting={isUpdating}
            docenti={docenti}
            canManageAssenze={canManageAssenze}
            onDelete={selectedAssenza ? () => handleDelete(selectedAssenza.id) : undefined}
            isDeleting={isDeleting}
          />
        </>
      )}
    </div>
  );
}
