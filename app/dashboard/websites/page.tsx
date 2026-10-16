'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Plus, Edit2, Trash2, ExternalLink, X } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  domain: string;
  country: string;
  score?: number;
}

export default function WebsitesPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSite, setNewSite] = useState({ name: '', domain: '', country: 'ES' });
  const [loading, setLoading] = useState(true);

  // Cargar sitios desde la base de datos
  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const res = await fetch('/api/websites');
      const data = await res.json();
      setSites(data);
    } catch (error) {
      console.error('Error al cargar sitios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newSite.name || !newSite.domain) return;
    
    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSite),
      });
      
      if (res.ok) {
        await loadSites(); // Recargar la lista
        setNewSite({ name: '', domain: '', country: 'ES' });
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error al crear sitio:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este sitio?')) return;
    
    try {
      const res = await fetch('/api/websites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      
      if (res.ok) {
        await loadSites(); // Recargar la lista
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Cargando...</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sitios Web</h1>
          <p className="text-slate-500 mt-1">Gestiona tus proyectos SEO</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir sitio
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {sites.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No tienes sitios web. ¡Añade el primero!</p>
          </div>
        ) : (
          sites.map((site) => (
            <Card key={site.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{site.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <ExternalLink className="w-3 h-3" />
                        {site.domain}
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{site.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <Edit2 className="w-4 h-4 text-slate-600" />
                    </button>
                    <button onClick={() => handleDelete(site.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-slate-900">Añadir nuevo sitio</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del sitio</label>
                <input
                  type="text"
                  value={newSite.name}
                  onChange={(e) => setNewSite({ ...newSite, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Mi sitio web"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dominio</label>
                <input
                  type="text"
                  value={newSite.domain}
                  onChange={(e) => setNewSite({ ...newSite, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
                <select
                  value={newSite.country}
                  onChange={(e) => setNewSite({ ...newSite, country: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ES">España</option>
                  <option value="MX">México</option>
                  <option value="AR">Argentina</option>
                  <option value="CO">Colombia</option>
                  <option value="CL">Chile</option>
                  <option value="US">Estados Unidos</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t bg-slate-50">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg">
                Cancelar
              </button>
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Guardar sitio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}