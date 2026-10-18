'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Website {
  id: string;
  name: string;
  domain: string;
}

interface NewKeywordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeywordCreated: () => void;
}

export default function NewKeywordModal({ isOpen, onClose, onKeywordCreated }: NewKeywordModalProps) {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [selectedWebsiteId, setSelectedWebsiteId] = useState('');
  const [term, setTerm] = useState('');
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadWebsites();
    }
  }, [isOpen]);

  const loadWebsites = async () => {
    try {
      const res = await fetch('/api/websites');
      const data = await res.json();
      setWebsites(data);
    } catch (error) {
      setError('Error al cargar sitios web');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteId: selectedWebsiteId,
          term,
          position,
          volume,
          difficulty,
        }),
      });

      if (res.ok) {
        onKeywordCreated();
        onClose();
        setSelectedWebsiteId('');
        setTerm('');
        setPosition(0);
        setVolume(0);
        setDifficulty(0);
      } else {
        const data = await res.json();
        setError(data.error || 'Error al crear keyword');
      }
    } catch (error) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Nueva keyword</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Sitio web
            </label>
            <select
              value={selectedWebsiteId}
              onChange={(e) => setSelectedWebsiteId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">-- Selecciona un sitio --</option>
              {websites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name} ({site.domain})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Keyword
            </label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="restaurante vegano madrid"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Posición
              </label>
              <input
                type="number"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Volumen
              </label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Dificultad
              </label>
              <input
                type="number"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value))}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || !selectedWebsiteId || !term}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando...' : 'Crear keyword'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}