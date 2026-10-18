'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface Keyword {
  id: string;
  keyword: string;
  position: number;
  volume: number;
  website: {
    name: string;
    domain: string;
  };
}

export default function KeywordsPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKeywords();
  }, []);

  const loadKeywords = async () => {
    try {
      const res = await fetch('/api/keywords');
      const data = await res.json();
      setKeywords(data);
    } catch (error) {
      console.error('Error al cargar keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position: number) => {
    if (position <= 3) return <TrendingUp className="w-5 h-5 text-green-600" />;
    if (position <= 10) return <Minus className="w-5 h-5 text-yellow-600" />;
    return <TrendingDown className="w-5 h-5 text-red-600" />;
  };

  const getPositionColor = (position: number) => {
    if (position <= 3) return 'text-green-600';
    if (position <= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return <div className="p-8 text-slate-500">Cargando...</div>;
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Keywords</h1>
          <p className="text-slate-500 mt-1">Palabras clave monitoreadas</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Search className="w-4 h-4" />
          Nueva keyword
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-4">
        {keywords.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay keywords monitoreadas</p>
          </div>
        ) : (
          keywords.map((kw) => (
            <Card key={kw.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getPositionIcon(kw.position)}
                    <div>
                      <h3 className="font-semibold text-slate-900">{kw.keyword}</h3>
                      <p className="text-sm text-slate-500">{kw.website.name} - {kw.website.domain}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getPositionColor(kw.position)}`}>
                        #{kw.position}
                      </div>
                      <p className="text-xs text-slate-500">Posición</p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">
                        {kw.volume.toLocaleString()}
                      </div>
                      <p className="text-xs text-slate-500">Volumen/mes</p>
                    </div>
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