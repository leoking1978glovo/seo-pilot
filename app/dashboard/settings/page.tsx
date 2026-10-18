'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [name, setName] = useState('Usuario Demo');
  const [email, setEmail] = useState('demo@seopilot.app');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'cmvb08yi00000ohc2kk7cj8zj',
          name,
          email,
          password: password || undefined,
        }),
      });

      if (res.ok) {
        setMessage('✅ Perfil actualizado correctamente');
        setPassword('');
      } else {
        setMessage('❌ Error al actualizar perfil');
      }
    } catch (error) {
      setMessage('❌ Error de conexión');
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Configuración</h1>
        <p className="text-slate-500 mt-1">Gestiona tu perfil y preferencias</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Perfil de usuario</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nueva contraseña (dejar vacío para no cambiar)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div className={`p-3 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar cambios
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}