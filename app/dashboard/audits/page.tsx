'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, AlertTriangle, CheckCircle, Trash2, Eye } from 'lucide-react';
import NewAuditModal from './new-audit-modal';
import AuditDetailModal from './audit-detail-modal';

interface Audit {
  id: string;
  score: number;
  status: string;
  createdAt: string;
  website: {
    name: string;
    domain: string;
  };
}

export default function AuditsPage() {
  const [audits, setAudits] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

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

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta auditoría?')) return;
    try {
      const res = await fetch(`/api/audits/${id}`, { method: 'DELETE' });
      if (res.ok) loadAudits();
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
    return <CheckCircle className="w-5 h-5 text-green-600" />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'warning') return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (status: string) => {
    if (status === 'warning') return 'Advertencia';
    return 'Completada';
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Cargando...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Auditorías</h1>
          <p className="text-slate-500 mt-1">Historial de análisis SEO</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Search className="w-4 h-4" />
          Nueva auditoría
        </button>
      </div>

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

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(audit.score)}`}>
                        {audit.score}
                      </div>
                      <p className="text-xs text-slate-500">Puntuación</p>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(audit.status)}`}>
                      {getStatusText(audit.status)}
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-slate-500">{formatDate(audit.createdAt)}</div>
                    </div>

                    <button
                      onClick={() => setSelectedAuditId(audit.id)}
                      className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(audit.id)}
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

      <NewAuditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAuditCreated={loadAudits}
      />

      <AuditDetailModal
        auditId={selectedAuditId}
        onClose={() => setSelectedAuditId(null)}
      />
    </div>
  );
}