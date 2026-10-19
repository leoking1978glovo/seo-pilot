'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, Plus, Edit, Trash2 } from 'lucide-react';
import AddSiteModal from './add-site-modal';
import EditSiteModal from './edit-site-modal';

interface Website {
  id: string;
  name: string;
  domain: string;
  country: string;
  score: number;
}

export default function WebsitesPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Website | null>(null);

  useEffect(() => { loadWebsites(); }, []);

  const loadWebsites = async () => {
    try {
      const res = await fetch('/api/websites');
      const data = await res.json();
      setWebsites(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este sitio? Se borrarán también sus auditorías y keywords.')) return;
    try {
      const res = await fetch(`/api/websites/${id}`, { method: 'DELETE' });
      if (res.ok) loadWebsites();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleEdit = (site: Website) => {
    setEditingSite(site);
    setIsEditOpen(true);
  };

  if (loading) return <div className="p-8 text-slate-500">Cargando...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Sitios Web</h1>
          <p className="text-slate-500 mt-1">Gestiona tus proyectos SEO</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir sitio
        </button>
      </div>

      <div className="space-y-4">
        {websites.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay sitios web añadidos</p>
          </div>
        ) : (
          websites.map((site) => (
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
                        <span>{site.domain}</span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-xs">{site.country}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(site)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(site.id)}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AddSiteModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSiteAdded={loadWebsites}
      />

      <EditSiteModal
        isOpen={isEditOpen}
        site={editingSite}
        onClose={() => setIsEditOpen(false)}
        onUpdated={loadWebsites}
      />
    </div>
  );
}