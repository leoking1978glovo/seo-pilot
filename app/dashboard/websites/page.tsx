'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Plus, Edit2, Trash2, ExternalLink, X } from 'lucide-react';

const initialSites = [
  { id: 1, name: 'Tienda TechGear', domain: 'tienda.ejemplo.com', country: 'ES', score: 78 },
  { id: 2, name: 'Blog de Viajes Wanderlust', domain: 'blog.viajes.com', country: 'MX', score: 85 },
  { id: 3, name: 'Clínica Dental Sonrisas', domain: 'clinicadental.sonrisas.com', country: 'ES', score: 92 },
  { id: 4, name: 'SaaSFlow B2B', domain: 'app.saasflow.io', country: 'ES', score: 70 },
];

export default function WebsitesPage() {
  const [sites, setSites] = useState(initialSites);
  const [showModal, setShowModal] = useState(false);
  const [newSite, setNewSite] = useState({ name: '', domain: '', country: 'ES' });

  const handleAdd = () => {
    if (!newSite.name || !newSite.domain) return;
    setSites([
      ...sites,
      { id: Date.now(), name: newSite.name, domain: newSite.domain, country: newSite.country, score: 0 },
    ]);
    setNewSite({ name: '', domain: '', country: 'ES' });
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setSites(sites.filter((s) => s.id !== id));
  };

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
        {sites.map((site) => (
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

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${site.score >= 80 ? 'text-green-600' : site.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {site.score}
                    </div>
                    <p className="text-xs text-slate-500">Puntuación SEO</p>
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
              </div>
            </CardContent>
          </Card>
        ))}
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mi sitio web"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dominio</label>
                <input
                  type="text"
                  value={newSite.domain}
                  onChange={(e) => setNewSite({ ...newSite, domain: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">País</label>
                <select
                  value={newSite.country}
                  onChange={(e) => setNewSite({ ...newSite, country: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={handleAdd} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                Guardar sitio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}