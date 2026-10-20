'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react';

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

export default function AuditDetailClient({ auditId }: { auditId: string }) {
  const router = useRouter();
  const [audit, setAudit] = useState<AuditDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
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
    if (auditId) load();
  }, [auditId]);

  const sevIcon = (s: string) =>
    s === 'critical' ? <XCircle className="w-5 h-5 text-red-600" />
    : s === 'warning' ? <AlertTriangle className="w-5 h-5 text-yellow-600" />
    : <CheckCircle className="w-5 h-5 text-green-600" />;

  const scoreColor = (n: number) =>
    n >= 90 ? 'text-green-600' : n >= 70 ? 'text-yellow-600' : 'text-red-600';

  if (loading) {
    return (
      <div className="p-8 text-slate-500 flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Cargando auditoría...
      </div>
    );
  }

  if (error || !audit) {
    return <div className="p-8 text-red-600">{error || 'Auditoría no encontrada'}</div>;
  }

  return (
    <div className="p-8 max-w-3xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Volver a auditorías
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{audit.website.name}</h1>
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
      </div>

      <h2 className="font-semibold text-slate-900 mb-4">Desglose por categorías</h2>
      <div className="space-y-4">
        {audit.checks.map((check) => {
          const meta = CHECK_META[check.type] ?? { label: check.type, tips: [] };
          return (
            <div key={check.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <div className="flex items-center gap-3">
                {sevIcon(check.severity)}
                <h3 className="font-semibold text-slate-900">{meta.label}</h3>
                <span className="ml-auto text-sm font-bold text-slate-600">{check.message}</span>
              </div>
              {check.severity !== 'info' && meta.tips.length > 0 && (
                <ul className="mt-3 ml-8 list-disc text-sm text-slate-600 space-y-1">
                  {meta.tips.map((tip) => <li key={tip}>{tip}</li>)}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}