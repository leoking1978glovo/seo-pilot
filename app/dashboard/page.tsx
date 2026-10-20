'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Globe, Search, KeyRound, FileText, Eye } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import AuditDetailModal from './audits/audit-detail-modal';

interface Website {
  id: string;
  name: string;
  domain: string;
  score: number;
}

interface Audit {
  id: string;
  score: number;
  status: string;
  createdAt: string;
  website: { name: string; domain: string };
}

const scoreBadge = (score: number) =>
  score >= 90
    ? 'bg-green-100 text-green-700'
    : score >= 70
    ? 'bg-yellow-100 text-yellow-700'
    : 'bg-red-100 text-red-700';

export default function DashboardPage() {
  const { data: session } = useSession();
  const [websites, setWebsites] = useState<Website[]>([]);
  const [audits, setAudits] = useState<Audit[]>([]);
  const [keywordCount, setKeywordCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedAuditId, setSelectedAuditId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [w, a, k, r] = await Promise.all([
          fetch('/api/websites').then((res) => res.json()),
          fetch('/api/audits').then((res) => res.json()),
          fetch('/api/keywords').then((res) => res.json()),
          fetch('/api/reports').then((res) => res.json()),
        ]);
        setWebsites(Array.isArray(w) ? w : []);
        setAudits(Array.isArray(a) ? a : []);
        setKeywordCount(Array.isArray(k) ? k.length : 0);
        setReportCount(Array.isArray(r) ? r.length : 0);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const avgScore = websites.length
    ? Math.round(websites.reduce((sum, w) => sum + w.score, 0) / websites.length)
    : 0;

  const chartData = websites.map((w) => ({
    name: w.name.length > 14 ? w.name.slice(0, 14) + '…' : w.name,
    score: w.score,
  }));

  const okCount = audits.filter((a) => a.status === 'completed').length;
  const warnCount = audits.filter((a) => a.status === 'warning').length;
  const statusData = [
    { name: 'Completadas (≥90)', value: okCount, color: '#22c55e' },
    { name: 'Con advertencia (<90)', value: warnCount, color: '#f59e0b' },
  ].filter((d) => d.value > 0);

  const recentAudits = audits.slice(0, 5);

  const kpis = [
    { title: 'Puntuación media', value: websites.length ? `${avgScore}/100` : '—', icon: TrendingUp, color: 'text-blue-600' },
    { title: 'Sitios web', value: String(websites.length), icon: Globe, color: 'text-purple-600' },
    { title: 'Auditorías', value: String(audits.length), icon: Search, color: 'text-green-600' },
    { title: 'Keywords', value: String(keywordCount), icon: KeyRound, color: 'text-red-600' },
    { title: 'Informes', value: String(reportCount), icon: FileText, color: 'text-emerald-600' },
  ];

  if (loading) {
    return <div className="p-8 text-slate-500">Cargando panel de control...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
        <p className="text-slate-500 mt-1">
          Bienvenido, {session?.user?.name || 'Usuario'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        {kpis.map((kpi, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Score por sitio web</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Añade sitios web para ver su puntuación
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                    <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas auditorías</CardTitle>
          </CardHeader>
          <CardContent>
            {recentAudits.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-slate-400 text-sm">
                Aún no hay auditorías. Crea una desde la sección Auditorías.
              </div>
            ) : (
              <div className="space-y-3">
                {recentAudits.map((audit) => (
                  <div key={audit.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">{audit.website.name}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(audit.createdAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${scoreBadge(audit.score)}`}>
                        {audit.score}/100
                      </span>
                      <button
                        onClick={() => setSelectedAuditId(audit.id)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Auditorías por estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {statusData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                  Sin auditorías aún
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              {statusData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tus Sitios Web</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {websites.length === 0 && (
                <p className="text-slate-400 text-sm">No tienes sitios web añadidos.</p>
              )}
              {websites.map((site) => (
                <div
                  key={site.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">{site.name}</p>
                    <p className="text-sm text-slate-500">{site.domain}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${scoreBadge(site.score)}`}>
                    {site.score}/100
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AuditDetailModal auditId={selectedAuditId} onClose={() => setSelectedAuditId(null)} />
    </div>
  );
}