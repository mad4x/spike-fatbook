import Modal from '@/components/Modal';

interface ModalConfermaProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    titolo: string;
    messaggio: string;
    testoPulsante?: string;
    errore?: string;
}

const ModalConferma = ({
    isOpen,
    onClose,
    onConfirm,
    titolo,
    messaggio,
    testoPulsante = "Conferma",
    errore}: ModalConfermaProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={titolo}>
            <div className="space-y-4">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl text-orange-800">
                    <p className="font-medium mb-1">Sei sicuro di voler procedere?</p>
                    <p className="text-sm opacity-90">{messaggio}</p>
                </div>

                {errore && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                        {errore}
                    </div>
                )}

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition-colors"
                    >
                        Annulla
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium shadow-sm transition-colors"
                    >
                        {testoPulsante}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalConferma;