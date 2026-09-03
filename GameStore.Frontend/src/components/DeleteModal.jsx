export function DeleteModal({ game, onConfirm, onClose, isDeleting }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-xl bg-white shadow-xl">
        <div className="px-6 pt-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800">Delete game?</h2>
          <p className="mt-1 text-sm text-gray-500">
            Are you sure you want to delete{' '}
            <span className="font-medium text-gray-700">"{game?.name}"</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 px-6 py-5">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Yes, delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
