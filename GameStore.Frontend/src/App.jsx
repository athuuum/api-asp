import { useEffect, useState } from 'react';
import { GamesTable } from './components/GamesTable';
import { GameForm } from './components/GameForm';
import { DeleteModal } from './components/DeleteModal';
import { getGames, getGame, createGame, updateGame, deleteGame } from './services/api';

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    setLoading(true);
    const data = await getGames();
    setGames(data);
    setLoading(false);
  }

  async function handleEdit(game) {
    const details = await getGame(game.id);
    setEditingGame(details);
    setFormOpen(true);
  }

  async function handleSubmit(data) {
    setIsSubmitting(true);
    if (editingGame) {
      await updateGame(editingGame.id, data);
    } else {
      await createGame(data);
    }
    setIsSubmitting(false);
    setFormOpen(false);
    setEditingGame(null);
    fetchGames();
  }

  async function handleDelete() {
    setIsDeleting(true);
    await deleteGame(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
    fetchGames();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-5">
          <h1 className="text-2xl font-bold text-gray-800">Game Store</h1>
          <p className="text-sm text-gray-500 mt-1">Game catalog</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        {loading ? (
          <p className="text-center text-gray-500 py-16">Loading...</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Games ({games.length})
              </h2>
              <button
                onClick={() => { setEditingGame(null); setFormOpen(true); }}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                + New Game
              </button>
            </div>

            <GamesTable
              games={games}
              onEdit={handleEdit}
              onDelete={setDeleteTarget}
            />
          </>
        )}
      </main>

      {formOpen && (
        <GameForm
          game={editingGame}
          onSubmit={handleSubmit}
          onClose={() => setFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          game={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
