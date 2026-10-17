'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';

interface Audit {
  id: string;
  score: number;
  status: string;
  createdAt: string;
  website: {
    id: string;
    name: string;
    domain: string;
  };
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAudits();
  }, []);

  const loadAudits = async () => {
    try {
      const res = await fetch('/api/audits');
      const data = await res.json();
      setAudits(data);
    } catch (error) {
      console.error('Error al cargar auditorías:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700';
      case 'error':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
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
          <h1 className="text-3xl font-bold text-slate-900">Auditorías</h1>
          <p className="text-slate-500 mt-1">Historial de análisis SEO</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Search className="w-4 h-4" />
          Nueva auditoría
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {audits.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay auditorías realizadas</p>
          </div>
        ) : (
          audits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(audit.status)}
                    <div>
                      <h3 className="font-semibold text-slate-900">{audit.website.name}</h3>
                      <p className="text-sm text-slate-500">{audit.website.domain}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${audit.score >= 80 ? 'text-green-600' : audit.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {audit.score}
                      </div>
                      <p className="text-xs text-slate-500">Puntuación</p>
                    </div>

                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(audit.status)}`}>
                      {audit.status === 'completed' ? 'Completada' : audit.status === 'warning' ? 'Advertencia' : audit.status === 'error' ? 'Error' : 'Pendiente'}
                    </span>

                    <span className="text-sm text-slate-400">
                      {new Date(audit.createdAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}