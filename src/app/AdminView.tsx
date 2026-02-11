import { useState, useEffect, useMemo } from 'react';
import { Settings, Plus, Globe, ExternalLink, ToggleLeft, ToggleRight, Copy, Check, Building2, Eye, MousePointer2, TrendingUp, BarChart3, List } from 'lucide-react';
import { configService, AppConfig, Listing, MetricEvent } from '@/shared/services/configService';

export default function AdminView() {
    const [config, setConfig] = useState<AppConfig>(configService.getConfig());
    const [copySuccess, setCopySuccess] = useState(false);
    const [isAddingAgency, setIsAddingAgency] = useState(false);
    const [newAgencyName, setNewAgencyName] = useState('');
    const [newAgencyDomain, setNewAgencyDomain] = useState('');
    const [activeTab, setActiveTab] = useState<'listings' | 'analytics'>('listings');

    useEffect(() => {
        const handleStorage = (e: StorageEvent) => {
            if (e.key === 'ktirio_config_v3') {
                setConfig(configService.getConfig());
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const agencies = config.agencies || [];
    const activeAgency = agencies.find(a => a.id === config.activeAgencyId) || agencies[0] || {
        id: 'temp',
        name: 'Carregando...',
        domain: '',
        selectors: { propertyImages: 'img' }
    };

    const metrics = config.metrics || [];
    const agencyMetrics = useMemo(() => {
        return metrics.filter(m => m.agencyId === activeAgency.id);
    }, [metrics, activeAgency.id]);

    const stats = useMemo(() => {
        const views = agencyMetrics.filter(m => m.type === 'view').length;
        const clicks = agencyMetrics.filter(m => m.type === 'click').length;
        const ctr = views > 0 ? ((clicks / views) * 100).toFixed(1) : '0';
        return { views, clicks, ctr };
    }, [agencyMetrics]);

    const handleToggleListing = (url: string) => {
        const listing = config.listings.find(l => l.url === url);
        if (listing) {
            configService.toggleListing(url, !listing.isActive);
            setConfig(configService.getConfig());
        }
    };

    const handleAddAgency = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAgencyName || !newAgencyDomain) return;
        configService.addAgency(newAgencyName, newAgencyDomain);
        setConfig(configService.getConfig());
        setNewAgencyName('');
        setNewAgencyDomain('');
        setIsAddingAgency(false);
    };

    const handleCopyScript = () => {
        const script = `<script src="${window.location.origin}/KtirioLoader.js?id=${activeAgency.id}" async></script>`;
        navigator.clipboard.writeText(script);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const listings = config.listings || [];
    const filteredListings = listings.filter(l => l.agencyId === activeAgency.id);

    // Sort listings: active first, then by date
    const sortedListings = useMemo(() => {
        return [...filteredListings].sort((a, b) => {
            if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
            return (b.createdAt || 0) - (a.createdAt || 0);
        });
    }, [filteredListings]);

    const activeListings = filteredListings.filter(l => l.isActive);
    const discoveryListings = filteredListings.filter(l => !l.isActive);

    return (
        <div className="flex bg-[#F8FAFC] min-h-screen font-sans antialiased text-slate-900 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-80 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
                <div className="p-8 border-b border-slate-100">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ktirio <span className="text-yellow-500 font-black">AI</span></h1>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-2">CMS 3.0 • Agency Suite</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-2">
                    <div className="flex items-center justify-between px-2 mb-4">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Agencies</span>
                        <button onClick={() => setIsAddingAgency(true)} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors text-slate-600">
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>

                    {agencies.map(agency => (
                        <button
                            key={agency.id}
                            onClick={() => {
                                configService.setActiveAgency(agency.id);
                                setConfig(configService.getConfig());
                            }}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group border ${activeAgency.id === agency.id
                                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-200 border-slate-900'
                                    : 'hover:bg-slate-50 text-slate-500 border-transparent'
                                }`}
                        >
                            <div className={`p-2 rounded-xl ${activeAgency.id === agency.id ? 'bg-white/10' : 'bg-slate-100'}`}>
                                <Building2 className={`w-4 h-4 ${activeAgency.id === agency.id ? 'text-yellow-400' : 'text-slate-400'}`} />
                            </div>
                            <div className="text-left overflow-hidden">
                                <p className="text-sm font-bold leading-tight truncate">{agency.name}</p>
                                <p className={`text-[10px] truncate ${activeAgency.id === agency.id ? 'text-slate-400' : 'text-slate-400'}`}>{agency.domain}</p>
                            </div>
                        </button>
                    ))}

                    {isAddingAgency && (
                        <form onSubmit={handleAddAgency} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 mt-4">
                            <input autoFocus placeholder="Agency Name" value={newAgencyName} onChange={e => setNewAgencyName(e.target.value)} className="w-full text-xs p-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <input placeholder="domain.com" value={newAgencyDomain} onChange={e => setNewAgencyDomain(e.target.value)} className="w-full text-xs p-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500" />
                            <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setIsAddingAgency(false)} className="text-[11px] font-bold px-3 py-1.5 text-slate-400 hover:text-slate-600">Cancel</button>
                                <button type="submit" className="text-[11px] font-bold px-4 py-1.5 bg-slate-900 text-white rounded-lg">Add Agency</button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="p-6">
                    <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Settings className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-4 flex items-center gap-2">
                            Embed Script
                        </h2>
                        <div className="bg-black/20 rounded-xl p-3 font-mono text-[9px] text-slate-300 break-all relative border border-white/5">
                            <code>{`<script src="${window.location.origin}/KtirioLoader.js?id=${activeAgency.id}" async></script>`}</code>
                            <button onClick={handleCopyScript} className="absolute right-2 bottom-2 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                {copySuccess ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto h-screen">
                <header className="mb-12 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-100">
                                <Building2 className="w-6 h-6 text-slate-900" />
                            </div>
                            <div>
                                <h2 className="text-4xl font-black text-slate-900">{activeAgency.name}</h2>
                                <p className="text-slate-400 font-medium">{activeAgency.domain}</p>
                            </div>
                        </div>
                        <div className="flex gap-8 mt-10">
                            <button onClick={() => setActiveTab('listings')} className={`text-xs font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${activeTab === 'listings' ? 'border-yellow-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Inventory</button>
                            <button onClick={() => setActiveTab('analytics')} className={`text-xs font-black uppercase tracking-widest pb-3 border-b-2 transition-all ${activeTab === 'analytics' ? 'border-yellow-500 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}>Analytics Hub</button>
                        </div>
                    </div>
                </header>

                {activeTab === 'analytics' ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'Impressions', value: stats.views, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50', desc: 'Total widget loads' },
                                { label: 'Interactions', value: stats.clicks, icon: MousePointer2, color: 'text-yellow-600', bg: 'bg-yellow-50', desc: 'Decorated button clicks' },
                                { label: 'Engagement Rate', value: `${stats.ctr}%`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', desc: 'CTR Performance' }
                            ].map((s, i) => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className={`p-4 ${s.bg} ${s.color} rounded-2xl shadow-inner`}><s.icon className="w-6 h-6" /></div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                                    </div>
                                    <h3 className="text-5xl font-black text-slate-900">{s.value}</h3>
                                    <p className="text-[11px] font-bold text-slate-400 mt-2">{s.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Inventory Performance List */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Detailed Performance</h3>
                                <BarChart3 className="w-5 h-5 text-slate-300" />
                            </div>
                            <div className="divide-y divide-slate-50">
                                {activeListings.map(l => {
                                    const lMetrics = agencyMetrics.filter(m => m.listingId === l.id);
                                    const lViews = lMetrics.filter(m => m.type === 'view').length;
                                    const lClicks = lMetrics.filter(m => m.type === 'click').length;
                                    return (
                                        <div key={l.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="w-20 h-14 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner border border-slate-200">
                                                    {l.images[0] && <img src={l.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />}
                                                </div>
                                                <div className="max-w-md">
                                                    <p className="font-bold text-slate-900 leading-tight mb-1 truncate">{l.name || 'Untitled Property'}</p>
                                                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1">
                                                        Visit Listing <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex gap-12 text-right">
                                                <div>
                                                    <p className="text-xl font-black text-slate-900">{lViews}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Views</p>
                                                </div>
                                                <div>
                                                    <p className="text-xl font-black text-slate-900">{lClicks}</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Clicks</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Unified List View */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Property Inventory</h3>
                                <div className="h-px flex-1 bg-slate-100 mx-8"></div>
                                <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full">{filteredListings.length} TOTAL</span>
                            </div>
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                <div className="divide-y divide-slate-50">
                                    {sortedListings.map(listing => (
                                        <div key={listing.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                                            <div className="flex items-center gap-6 flex-1">
                                                <div className="w-20 h-14 bg-slate-100 rounded-2xl overflow-hidden shadow-inner flex-shrink-0 border border-slate-200">
                                                    {listing.images[0] ? (
                                                        <img src={listing.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300"><Globe className="w-6 h-6" /></div>
                                                    )}
                                                </div>
                                                <div className="max-w-xl">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className={`font-bold leading-tight truncate ${listing.isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                                            {listing.name || 'Untitled Property'}
                                                        </p>
                                                        {listing.isActive && (
                                                            <span className="bg-green-100 text-green-700 text-[8px] font-black px-1.5 py-0.5 rounded-sm uppercase">Active</span>
                                                        )}
                                                    </div>
                                                    <a href={listing.url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-slate-400 hover:text-blue-500 font-bold flex items-center gap-1 transition-colors">
                                                        {listing.url} <ExternalLink className="w-2.5 h-2.5" />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {listing.isActive ? (
                                                    <button onClick={() => handleToggleListing(listing.url)} className="text-yellow-500 hover:text-yellow-600 transition-colors">
                                                        <ToggleRight className="w-12 h-12" />
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleToggleListing(listing.url)} className="text-slate-200 hover:text-yellow-400 transition-colors">
                                                        <ToggleLeft className="w-12 h-12" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {filteredListings.length === 0 && (
                                        <div className="p-24 text-center">
                                            <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No properties detected yet</p>
                                            <p className="text-slate-400 text-[10px] mt-2">Visite o site da imobiliária para capturar novos imóveis.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </main>
        </div>
    );
}
