'use client';

import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

interface Check {
  id: string;
  type: string;
  severity: string;
  message: string;
}

interface AuditDetail {
  id: string;
  score: number;
  createdAt: string;
  website: { name: string; domain: string };
  checks: Check[];
}

const CHECK_META: Record<string, { label: string; tips: string[] }> = {
  performance: {
    label: 'Rendimiento',
    tips: [
      'Comprime las imágenes (formato WebP/AVIF) y usa lazy-loading',
      'Elimina el JavaScript que no uses (code splitting)',
      'Activa caché de navegador y sirve los estáticos desde CDN',
    ],
  },
  seo: {
    label: 'SEO',
    tips: [
      'Revisa que cada página tenga título y descripción únicos',
      'Añade datos estructurados (Schema.org: Restaurant, LocalBusiness...)',
      'Mantén una jerarquía de encabezados H1-H3 correcta',
    ],
  },
  accessibility: {
    label: 'Accesibilidad',
    tips: [
      'Añade texto alternativo a todas las imágenes',
      'Comprueba el contraste entre texto y fondo',
      'Haz que toda la web sea navegable con teclado',
    ],
  },
  'best-practices': {
    label: 'Buenas prácticas',
    tips: [
      'Sirve siempre por HTTPS y redirige el HTTP',
      'Corrige los errores que salen en la consola del navegador',
      'Evita librerías y APIs obsoletas',
    ],
  },
};

interface AuditDetailModalProps {
  auditId: string | null;
  onClose: () => void;
}

export default function AuditDetailModal({ auditId, onClose }: AuditDetailModalProps) {
  const [audit, setAudit] = useState<AuditDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!auditId) {
      setAudit(null);
      setError('');
      return;
    }
    const load = async () => {
      setLoading(true);
      setError('');
      setAudit(null);
      try {
        const res = await fetch(`/api/audits/${auditId}`);
        if (!res.ok) throw new Error('No encontrada');
        setAudit(await res.json());
      } catch {
        setError('No se pudo cargar la auditoría');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [auditId]);

  const sevIcon = (s: string) =>
    s === 'critical' ? <XCircle className="w-5 h-5 text-red-600" />
    : s === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600" />
    : <CheckCircle className="w-5 h-5 text-green-600" />;

  const scoreColor = (n: number) =>
    n >= 90 ? 'text-green-600' : n >= 70 ? 'text-yellow-600' : 'text-red-600';

  if (!auditId) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Detalle de auditoría</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-slate-500 py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" /> Cargando auditoría...
          </div>
        )}

        {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}

        {audit && (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{audit.website.name}</h3>
                <p className="text-slate-500">{audit.website.domain}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(audit.createdAt).toLocaleString('es-ES')}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-5xl font-bold ${scoreColor(audit.score)}`}>{audit.score}</div>
                <p className="text-xs text-slate-500">/100</p>
              </div>
            </div>

            <h3 className="font-semibold text-slate-900 mb-3">Desglose por categorías</h3>
            <div className="space-y-3">
              {audit.checks.map((check) => {
                const meta = CHECK_META[check.type] ?? { label: check.type, tips: [] };
                return (
                  <div key={check.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {sevIcon(check.severity)}
                      <span className="font-semibold text-slate-900">{meta.label}</span>
                      <span className="ml-auto text-sm font-bold text-slate-600">{check.message}</span>
                    </div>
                    {check.severity !== 'info' && meta.tips.length > 0 && (
                      <ul className="mt-2 ml-8 list-disc text-sm text-slate-600 space-y-1">
                        {meta.tips.map((tip) => <li key={tip}>{tip}</li>)}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}