import { useState, useEffect, useMemo } from 'react';
import { Settings, Plus, Globe, ExternalLink, ToggleLeft, ToggleRight, Copy, Check, Building2, Eye, MousePointer2, TrendingUp, BarChart3, List, Upload, X, MoreVertical, Trash2, Edit, Code } from 'lucide-react';
import { configService, AppConfig, Listing, MetricEvent } from '@/shared/services/configService';

const EmbedScript = ({ activeAgencyId, onCopy, copySuccess }: { activeAgencyId: string, onCopy: () => void, copySuccess: boolean }) => (
    <div className="bg-slate-900 rounded-2xl p-6 shadow-2xl relative overflow-hidden group w-80">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Settings className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-4 flex items-center gap-2">
            Embed Script
        </h2>
        <div className="bg-black/20 rounded-xl p-3 font-mono text-[9px] text-slate-300 break-all relative border border-white/5">
            <code>{`<script src="${window.location.origin}/KtirioLoader.js?id=${activeAgencyId}" async></script>`}</code>
            <button onClick={onCopy} className="absolute right-2 bottom-2 p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                {copySuccess ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
            </button>
        </div>
    </div>
);

export default function AdminCopyView() {
    const [config, setConfig] = useState<AppConfig>(configService.getConfig());
    const [copySuccess, setCopySuccess] = useState(false);
    const [isAddingAgency, setIsAddingAgency] = useState(false);
    const [newAgencyName, setNewAgencyName] = useState('');
    const [newAgencyDomain, setNewAgencyDomain] = useState('');
    const [activeTab, setActiveTab] = useState<'listings' | 'analytics'>('listings');
    const [isAddingListing, setIsAddingListing] = useState(false);
    const [manualListing, setManualListing] = useState({ name: '', url: '' });

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
        configService.createAgency(newAgencyName, newAgencyDomain);
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

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualListing.url) return;

        configService.addOrUpdateListing({
            name: manualListing.name,
            url: manualListing.url,
            images: [],
            agencyId: activeAgency.id,
            isActive: true
        });
        setConfig(configService.getConfig());
        setManualListing({ name: '', url: '' });
        setIsAddingListing(false);
    };

    const handleDeleteListing = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            configService.deleteListing(id);
            setConfig(configService.getConfig());
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const lines = text.split('\n');
            const startIdx = lines[0]?.toLowerCase().includes('url') ? 1 : 0;

            for (let i = startIdx; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                const [url, name, image] = line.split(',').map(s => s.trim());
                if (url) {
                    configService.addOrUpdateListing({
                        url,
                        name: name || '',
                        images: image ? [image] : [],
                        agencyId: activeAgency.id,
                        isActive: true
                    });
                }
            }
            setConfig(configService.getConfig());
        };
        reader.readAsText(file);
        e.target.value = '';
    };

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
                        <button onClick={() => setIsAddingAgency(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-sm">
                            <Plus className="w-3 h-3" />
                            <span className="text-[10px] font-bold">New Agency</span>
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
                    <EmbedScript
                        activeAgencyId={activeAgency.id}
                        onCopy={handleCopyScript}
                        copySuccess={copySuccess}
                    />
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
                        {/* Inventory Controls */}
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Management</h3>
                                <div className="flex gap-2">
                                    <label className="cursor-pointer flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-colors">
                                        <Upload className="w-4 h-4 text-slate-600" />
                                        <span className="text-xs font-bold text-slate-600">Import CSV</span>
                                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
                                    </label>
                                    <button onClick={() => setIsAddingListing(!isAddingListing)} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-xl transition-colors">
                                        <Plus className="w-4 h-4 text-white" />
                                        <span className="text-xs font-bold text-white">Add Listing</span>
                                    </button>
                                </div>
                            </div>


                        </div>

                        {/* Unified List View */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Property Inventory</h3>
                                <div className="h-px flex-1 bg-slate-100 mx-8"></div>
                                <span className="bg-slate-100 text-slate-400 text-[10px] font-black px-3 py-1 rounded-full">{filteredListings.length} TOTAL</span>
                            </div>
                            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Property</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Stats</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Images</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Iframe</th>
                                            <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {sortedListings.map(listing => (
                                            <tr key={listing.id} className="hover:bg-slate-50 transition-colors group">
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-12 bg-slate-100 rounded-xl overflow-hidden shadow-inner flex-shrink-0 border border-slate-200">
                                                            {listing.images[0] ? (
                                                                <img src={listing.images[0]} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-slate-300"><Globe className="w-4 h-4" /></div>
                                                            )}
                                                        </div>
                                                        <div className="max-w-[12rem] md:max-w-xs">
                                                            <p className="font-bold text-slate-900 leading-tight truncate mb-0.5">
                                                                {listing.name || 'Untitled Property'}
                                                            </p>
                                                            <a href={listing.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-slate-400 hover:text-blue-500 font-bold flex items-center gap-1 transition-colors truncate">
                                                                {listing.url} <ExternalLink className="w-2.5 h-2.5" />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <button onClick={() => handleToggleListing(listing.url)} className="transition-transform active:scale-95">
                                                        {listing.isActive ? (
                                                            <ToggleRight className="w-8 h-8 text-yellow-500 hover:text-yellow-600" />
                                                        ) : (
                                                            <ToggleLeft className="w-8 h-8 text-slate-200 hover:text-yellow-400" />
                                                        )}
                                                    </button>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="flex items-center justify-center gap-4">
                                                        <div className="text-center">
                                                            <span className="block text-xs font-black text-slate-900">0</span>
                                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Views</span>
                                                        </div>
                                                        <div className="text-center">
                                                            <span className="block text-xs font-black text-slate-900">0</span>
                                                            <span className="text-[8px] font-bold text-slate-400 uppercase">Clicks</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-xs">
                                                        <Globe className="w-3 h-3" />
                                                        {listing.images.length}
                                                    </span>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <button
                                                        onClick={() => navigator.clipboard.writeText(`<iframe src="${listing.url}" width="100%" height="600px" frameborder="0"></iframe>`)}
                                                        className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                                                        title="Copy Iframe Code"
                                                    >
                                                        <Code className="w-4 h-4" />
                                                    </button>
                                                </td>
                                                <td className="p-6 text-right">
                                                    <div className="relative inline-block text-left group/menu">
                                                        <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                        <div className="hidden group-hover/menu:block absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden text-left">
                                                            <a
                                                                href={`/editor/${listing.id}`}
                                                                className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                                Open Editor
                                                            </a>
                                                            <button
                                                                onClick={() => handleDeleteListing(listing.id, listing.name)}
                                                                className="w-full flex items-center gap-2 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredListings.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-24 text-center">
                                                    <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No properties detected yet</p>
                                                    <p className="text-slate-400 text-[10px] mt-2">Add a new property to get started.</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </div>
                )}
            </main>
            {isAddingAgency && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">New Agency</h3>
                            <button onClick={() => setIsAddingAgency(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddAgency} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Agency Name</label>
                                <input
                                    autoFocus
                                    placeholder="e.g. Luxury Estates"
                                    value={newAgencyName}
                                    onChange={e => setNewAgencyName(e.target.value)}
                                    className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Domain</label>
                                <input
                                    placeholder="e.g. luxuryestates.com"
                                    value={newAgencyDomain}
                                    onChange={e => setNewAgencyDomain(e.target.value)}
                                    className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all font-medium"
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                                    Create Agency
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isAddingListing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-sm rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-900">Add Property</h3>
                            <button onClick={() => setIsAddingListing(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>
                        <form onSubmit={handleManualSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Property URL (Required)</label>
                                <input
                                    autoFocus
                                    required
                                    placeholder="https://"
                                    value={manualListing.url}
                                    onChange={e => setManualListing({ ...manualListing, url: e.target.value })}
                                    className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all font-medium"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Property Name (Optional)</label>
                                <input
                                    placeholder="e.g. Downtown Apartment"
                                    value={manualListing.name}
                                    onChange={e => setManualListing({ ...manualListing, name: e.target.value })}
                                    className="w-full text-sm p-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all font-medium"
                                />
                            </div>
                            <div className="pt-2">
                                <button type="submit" className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                                    Add Property
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
