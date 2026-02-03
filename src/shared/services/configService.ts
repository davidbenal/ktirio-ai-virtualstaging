export interface MetricEvent {
    id: string;
    agencyId: string;
    listingId?: string;
    type: 'click' | 'view' | 'close' | 'generate';
    timestamp: number;
    url: string;
}

export interface Listing {
    id: string;
    url: string;
    name: string;
    isActive: boolean;
    images: string[];
    createdAt: number;
    agencyId?: string;
}

export interface AgencyConfig {
    id: string;
    name: string;
    domain: string;
    selectors: {
        propertyImages: string;
        price?: string;
        cta?: string;
    };
}

export interface AppConfig {
    agencies: AgencyConfig[];
    activeAgencyId: string;
    listings: Listing[];
    metrics: MetricEvent[];
}

const STORAGE_KEY = 'ktirio_config_v3';

const DEFAULT_AGENCY: AgencyConfig = {
    id: 'default-brognoli',
    name: 'Brognoli Imóveis',
    domain: 'localhost',
    selectors: {
        propertyImages: 'img[src*="unsplash.com"], .property-gallery img',
    },
};

const DEFAULT_CONFIG: AppConfig = {
    agencies: [DEFAULT_AGENCY],
    activeAgencyId: DEFAULT_AGENCY.id,
    listings: [],
    metrics: [],
};

const generateId = () => {
    try {
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
            return crypto.randomUUID();
        }
    } catch (e) { }
    return Math.random().toString(36).substr(2, 9);
};

export const configService = {
    getConfig(): AppConfig {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return DEFAULT_CONFIG;
        try {
            const parsed = JSON.parse(stored);
            // Deep merge with defaults to ensure all arrays exist
            return {
                ...DEFAULT_CONFIG,
                ...parsed,
                agencies: Array.isArray(parsed.agencies) ? parsed.agencies : DEFAULT_CONFIG.agencies,
                listings: Array.isArray(parsed.listings) ? parsed.listings : DEFAULT_CONFIG.listings,
                metrics: Array.isArray(parsed.metrics) ? parsed.metrics : DEFAULT_CONFIG.metrics,
                activeAgencyId: parsed.activeAgencyId || DEFAULT_CONFIG.activeAgencyId
            };
        } catch (e) {
            return DEFAULT_CONFIG;
        }
    },

    saveConfig(config: AppConfig) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    },

    addAgency(name: string, domain: string) {
        const config = this.getConfig();
        const newAgency: AgencyConfig = {
            id: generateId(),
            name,
            domain,
            selectors: { propertyImages: 'img' },
        };
        config.agencies.push(newAgency);
        config.activeAgencyId = newAgency.id;
        this.saveConfig(config);
        return newAgency;
    },

    updateAgency(agency: AgencyConfig) {
        const config = this.getConfig();
        const index = config.agencies.findIndex(a => a.id === agency.id);
        if (index > -1) {
            config.agencies[index] = agency;
            this.saveConfig(config);
        }
    },

    setActiveAgency(id: string) {
        const config = this.getConfig();
        config.activeAgencyId = id;
        this.saveConfig(config);
    },

    addOrUpdateListing(listing: Partial<Listing> & { url: string }) {
        const config = this.getConfig();
        const urlObj = new URL(listing.url);
        const normalizedUrl = `${urlObj.origin}${urlObj.pathname}`;
        const domain = urlObj.hostname.replace('www.', '');
        const agency = config.agencies.find(a => domain.includes(a.domain));

        const existingIndex = config.listings.findIndex(l => {
            try {
                const lUrl = new URL(l.url);
                return `${lUrl.origin}${lUrl.pathname}` === normalizedUrl;
            } catch (e) { return l.url === listing.url; }
        });

        if (existingIndex > -1) {
            config.listings[existingIndex] = {
                ...config.listings[existingIndex],
                ...listing,
                agencyId: agency?.id || config.listings[existingIndex].agencyId
            };
        } else {
            config.listings.push({
                id: generateId(),
                isActive: false,
                images: [],
                createdAt: Date.now(),
                name: listing.name || urlObj.pathname,
                agencyId: agency?.id,
                ...listing,
                url: listing.url
            });
        }
        this.saveConfig(config);
    },

    toggleListing(url: string, isActive: boolean) {
        const config = this.getConfig();
        const listing = config.listings.find(l => l.url === url);
        if (listing) {
            listing.isActive = isActive;
            this.saveConfig(config);
        }
    },

    trackEvent(event: Omit<MetricEvent, 'id' | 'timestamp'>) {
        const config = this.getConfig();
        config.metrics.push({
            ...event,
            id: generateId(),
            timestamp: Date.now(),
        });
        this.saveConfig(config);
    }
};
