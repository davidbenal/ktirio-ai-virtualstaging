/**
 * Ktirio SDK v1.0.0
 * Virtual Staging Widget Integration Script
 * 
 * Usage:
 *   ktirio.open({ agencyId: 'brognoli', type: 'iframe' });
 *   ktirio.close();
 *   ktirio.onClose(() => console.log('closed'));
 */
(function (window, document) {
    'use strict';

    var ktirio = {};

    // DOM element cache
    var overlayElement = null;
    var containerElement = null;
    var iframe = null;

    // Event callbacks
    var callbacks = {
        close: null,
        leadSubmit: null,
        ready: null
    };

    // Configuration
    var config = {
        baseUrl: 'https://virtualstaging.ktirio.com.br', // Production URL
        defaultWidth: 900,
        defaultHeight: 600
    };

    /**
     * Extract property code from Brognoli URL pattern
     * Pattern: /imovel/..._C65-56247/
     */
    function extractPropertyCode(url) {
        url = url || window.location.href;

        // Brognoli pattern: ends with _CODE/ where CODE is like C65-56247
        var match = url.match(/_([A-Z0-9]+-\d+)\/?$/i);
        if (match) {
            return match[1];
        }

        // Fallback: try to extract from path segments
        var pathMatch = url.match(/\/imovel\/[^\/]+_([^\/]+)\/?/i);
        if (pathMatch) {
            return pathMatch[1];
        }

        return null;
    }

    /**
     * Detect property images from the page (Brognoli gallery structure)
     */
    function detectImages() {
        var imgs = Array.from(document.querySelectorAll(
            '.owl-item img, .lazy-cover, .item picture img, [data-gallery] img'
        ));

        return imgs
            .map(function (img) {
                return img.getAttribute('data-src') || img.src;
            })
            .filter(function (src) {
                return src && src.startsWith('http');
            })
            .filter(function (value, index, self) {
                return self.indexOf(value) === index;
            })
            .slice(0, 15);
    }

    /**
     * Build iframe URL with parameters
     */
    function buildIframeUrl(options) {
        var baseUrl = config.baseUrl || window.location.origin;
        var params = new URLSearchParams();

        // If direct iframe URL provided, use it
        if (options.iframeUrl) {
            return options.iframeUrl;
        }

        // Build URL with detected/provided data
        if (options.propertyCode) {
            params.set('propertyCode', options.propertyCode);
        }
        if (options.agencyId) {
            params.set('agencyId', options.agencyId);
        }
        if (options.images) {
            params.set('images', JSON.stringify(options.images));
        }

        return baseUrl + '/widget.html?' + params.toString();
    }

    /**
     * Create modal overlay
     */
    function createOverlay() {
        var overlay = document.createElement('div');
        overlay.id = 'ktirio-overlay';

        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '99999999',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        return overlay;
    }

    /**
     * Create modal container
     */
    function createContainer(width, height) {
        var container = document.createElement('div');
        container.className = 'ktirio-container';

        Object.assign(container.style, {
            position: 'relative',
            width: typeof width === 'number' ? width + 'px' : width,
            height: typeof height === 'number' ? height + 'px' : height,
            maxWidth: '95vw',
            maxHeight: '90vh',
            backgroundColor: '#fff',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            transform: 'scale(0.95) translateY(10px)',
            transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        });

        return container;
    }

    /**
     * Create iframe element
     */
    function createIframe(src) {
        var frame = document.createElement('iframe');
        frame.src = src;
        frame.id = 'ktirio-iframe';

        Object.assign(frame.style, {
            width: '100%',
            height: '100%',
            border: 'none',
            display: 'block'
        });

        frame.setAttribute('allow', 'camera; microphone; fullscreen');

        return frame;
    }

    /**
     * Handle close with animation
     */
    function closeWithAnimation() {
        if (!overlayElement) return;

        overlayElement.style.opacity = '0';
        if (containerElement) {
            containerElement.style.transform = 'scale(0.95) translateY(10px)';
        }

        setTimeout(function () {
            if (overlayElement && document.body.contains(overlayElement)) {
                document.body.removeChild(overlayElement);
            }
            overlayElement = null;
            containerElement = null;
            iframe = null;

            // Trigger callback
            if (typeof callbacks.close === 'function') {
                callbacks.close();
            }
        }, 300);
    }

    /**
     * Handle PostMessage from iframe
     */
    function handleMessage(event) {
        if (!event.data || typeof event.data !== 'object') return;

        var action = event.data.action || event.data.type;
        var payload = event.data.payload || event.data.data;

        switch (action) {
            case 'KTIRIO_WIDGET_CLOSE':
            case 'close':
                ktirio.close();
                break;

            case 'KTIRIO_LEAD_SUBMIT':
            case 'leadSubmit':
                if (typeof callbacks.leadSubmit === 'function') {
                    callbacks.leadSubmit(payload);
                }
                break;

            case 'KTIRIO_READY':
            case 'ready':
                if (typeof callbacks.ready === 'function') {
                    callbacks.ready();
                }
                break;
        }
    }

    /**
     * Open the widget modal
     * 
     * @param {Object} options
     * @param {string} options.agencyId - Agency identifier
     * @param {string} options.propertyCode - Property code (optional, auto-detected from URL)
     * @param {string} options.iframeUrl - Direct iframe URL (bypasses auto-detection)
     * @param {string} options.type - 'iframe' (modal) or 'embed' (inline)
     * @param {string} options.targetId - Target element ID for embed mode
     * @param {number} options.width - Modal width (default: 900)
     * @param {number} options.height - Modal height (default: 600)
     */
    ktirio.open = function (options) {
        options = options || {};

        // Validate options
        if (!options.type) {
            options.type = 'iframe';
        }

        if (options.type !== 'iframe' && options.type !== 'embed') {
            console.error('[Ktirio] Invalid type. Use "iframe" or "embed".');
            return;
        }

        // Auto-detect property code if not provided
        if (!options.propertyCode && !options.iframeUrl) {
            options.propertyCode = extractPropertyCode();
        }

        // Auto-detect images if not provided
        if (!options.images) {
            options.images = detectImages();
        }

        // Build iframe URL
        var iframeSrc = buildIframeUrl(options);
        console.log('[Ktirio] Opening:', iframeSrc);

        // IFRAME MODE (modal overlay)
        if (options.type === 'iframe') {
            // If already open, just show it
            if (overlayElement) {
                overlayElement.style.display = 'flex';
                return;
            }

            var width = options.width || config.defaultWidth;
            var height = options.height || config.defaultHeight;

            // Create elements
            overlayElement = createOverlay();
            containerElement = createContainer(width, height);
            iframe = createIframe(iframeSrc);

            // Assemble
            containerElement.appendChild(iframe);
            overlayElement.appendChild(containerElement);
            document.body.appendChild(overlayElement);

            // Animate in
            requestAnimationFrame(function () {
                overlayElement.style.opacity = '1';
                containerElement.style.transform = 'scale(1) translateY(0)';
            });

            // Close on overlay click
            overlayElement.addEventListener('click', function (e) {
                if (e.target === overlayElement) {
                    ktirio.close();
                }
            });

            // Close on ESC key
            document.addEventListener('keydown', function escHandler(e) {
                if (e.key === 'Escape') {
                    ktirio.close();
                    document.removeEventListener('keydown', escHandler);
                }
            });
        }

        // EMBED MODE (inline in existing element)
        else if (options.type === 'embed') {
            if (!options.targetId) {
                console.error('[Ktirio] targetId is required for embed mode.');
                return;
            }

            var target = document.getElementById(options.targetId);
            if (!target) {
                console.error('[Ktirio] Element not found:', options.targetId);
                return;
            }

            iframe = createIframe(iframeSrc);
            target.innerHTML = '';
            target.appendChild(iframe);
        }
    };

    /**
     * Close the widget
     */
    ktirio.close = function (callback) {
        // If callback provided, register it
        if (typeof callback === 'function') {
            callbacks.close = callback;
            return;
        }

        // If inside iframe, notify parent
        if (window.parent !== window) {
            window.parent.postMessage({ action: 'close' }, '*');
            return;
        }

        // Close overlay
        closeWithAnimation();
    };

    /**
     * Register close callback
     */
    ktirio.onClose = function (callback) {
        callbacks.close = callback;
    };

    /**
     * Register lead submit callback
     */
    ktirio.onLeadSubmit = function (callback) {
        callbacks.leadSubmit = callback;
    };

    /**
     * Register ready callback
     */
    ktirio.onReady = function (callback) {
        callbacks.ready = callback;
    };

    /**
     * Configure SDK
     */
    ktirio.configure = function (opts) {
        if (opts.baseUrl) config.baseUrl = opts.baseUrl;
        if (opts.defaultWidth) config.defaultWidth = opts.defaultWidth;
        if (opts.defaultHeight) config.defaultHeight = opts.defaultHeight;
    };

    /**
     * Get extracted property code from current URL
     */
    ktirio.getPropertyCode = function () {
        return extractPropertyCode();
    };

    // Listen for PostMessage from iframe
    window.addEventListener('message', handleMessage);

    // Expose globally
    window.ktirio = ktirio;

    console.log('[Ktirio] SDK v1.0.0 loaded');

})(window, document);
