'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface EditSiteModalProps {
  isOpen: boolean;
  site: { id: string; name: string; domain: string; country: string } | null;
  onClose: () => void;
  onUpdated: () => void;
}

export default function EditSiteModal({ isOpen, site, onClose, onUpdated }: EditSiteModalProps) {
  const [name, setName] = useState(site?.name || '');
  const [domain, setDomain] = useState(site?.domain || '');
  const [country, setCountry] = useState(site?.country || 'ES');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !site) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/websites', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: site.id, name, domain, country }),
      });

      if (res.ok) {
        onUpdated();
        onClose();
      } else {
        setError('Error al actualizar');
      }
    } catch {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Editar sitio</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Dominio</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">País</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="ES">España</option>
              <option value="MX">México</option>
              <option value="AR">Argentina</option>
              <option value="CO">Colombia</option>
              <option value="CL">Chile</option>
              <option value="US">Estados Unidos</option>
            </select>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}