import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { fetchSettings, updateSettings } from '../../lib/settingsService';
import type { SiteSettings } from '../../lib/settingsService';

const SettingsManager = () => {
    const [settings, setSettings] = useState<Partial<SiteSettings>>({
        whatsapp_number: '',
        whatsapp_message: '',
        shopee_link: '',
        instagram_link: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        const data = await fetchSettings();
        if (data) {
            setSettings(data);
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await updateSettings(settings);
            setMessage({ type: 'success', text: 'Configurações salvas com sucesso!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erro ao salvar configurações.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando configurações...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div className={`p-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número do WhatsApp (apenas números)
                    </label>
                    <input
                        type="text"
                        name="whatsapp_number"
                        value={settings.whatsapp_number}
                        onChange={handleChange}
                        placeholder="Ex: 5511999999999"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensagem Padrão do WhatsApp
                    </label>
                    <textarea
                        name="whatsapp_message"
                        value={settings.whatsapp_message}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Ex: Olá! Gostaria de mais informações."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link da Shopee
                    </label>
                    <input
                        type="url"
                        name="shopee_link"
                        value={settings.shopee_link}
                        onChange={handleChange}
                        placeholder="https://shopee.com.br/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Link do Instagram
                    </label>
                    <input
                        type="url"
                        name="instagram_link"
                        value={settings.instagram_link}
                        onChange={handleChange}
                        placeholder="https://instagram.com/..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Salvar Configurações
                </button>
            </div>
        </form>
    );
};

export default SettingsManager;
