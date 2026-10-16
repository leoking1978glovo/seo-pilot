'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  Globe,
  FileText,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

// Datos de ejemplo para los gráficos
const rankingData = [
  { date: 'Sem 1', position: 12 },
  { date: 'Sem 2', position: 10 },
  { date: 'Sem 3', position: 8 },
  { date: 'Sem 4', position: 5 },
];

const trafficData = [
  { date: 'Lun', visitors: 1200 },
  { date: 'Mar', visitors: 1400 },
  { date: 'Mié', visitors: 1100 },
  { date: 'Jue', visitors: 1600 },
  { date: 'Vie', visitors: 1800 },
  { date: 'Sáb', visitors: 900 },
  { date: 'Dom', visitors: 800 },
];

const errorData = [
  { name: 'Críticos', value: 4, color: '#ef4444' },
  { name: 'Advertencias', value: 12, color: '#f59e0b' },
  { name: 'Aprobados', value: 45, color: '#22c55e' },
];

const kpis = [
  { title: 'Puntuación SEO', value: '78/100', sub: '+4% este mes', icon: TrendingUp, color: 'text-blue-600' },
  { title: 'Posición Promedio', value: '#5.2', sub: 'Top 10 en 12 keywords', icon: Globe, color: 'text-purple-600' },
  { title: 'Páginas Indexadas', value: '142', sub: '98% de URLs enviadas', icon: FileText, color: 'text-green-600' },
  { title: 'Errores Críticos', value: '4', sub: 'Acción requerida', icon: AlertTriangle, color: 'text-red-600' },
  { title: 'Tráfico Estimado', value: '12.4K', sub: '+12% mes a mes', icon: CheckCircle, color: 'text-emerald-600' },
];

const sites = [
  { name: 'Tienda TechGear', domain: 'tienda.ejemplo.com', score: 78 },
  { name: 'Blog de Viajes Wanderlust', domain: 'blog.viajes.com', score: 85 },
  { name: 'Clínica Dental Sonrisas', domain: 'clinicadental.sonrisas.com', score: 92 },
  { name: 'SaaSFlow B2B', domain: 'app.saasflow.io', score: 70 },
];

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
        <p className="text-slate-500 mt-1">
          Bienvenido, {session?.user?.name || 'Usuario'}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
        {kpis.map((kpi, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">
                {kpi.value}
              </div>
              <p className="text-xs text-slate-500 mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Gráfico de ranking */}
        <Card>
          <CardHeader>
            <CardTitle>Evolución del Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rankingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis reversed stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="position"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de tráfico */}
        <Card>
          <CardHeader>
            <CardTitle>Tráfico Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    }}
                  />
                  <Bar dataKey="visitors" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de errores y sitios web */}
      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {/* Distribución de errores */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Errores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={errorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {errorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {errorData.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sitios web */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tus Sitios Web</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sites.map((site, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-slate-900">{site.name}</p>
                    <p className="text-sm text-slate-500">{site.domain}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      site.score >= 80
                        ? 'bg-green-100 text-green-700'
                        : site.score >= 60
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {site.score}/100
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}