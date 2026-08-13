// =========================================================
// MAIN APPLICATION
// Desa Kliwonan
// =========================================================

class StoryMapApp {

    constructor() {

        this.map = null;
        this.layerManager = null;

        this.currentBasemap = 'google';

        // URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        this.layerToZoom = urlParams.get('layer');

        this.initializeMap();
        this.initializeControls();
        this.loadLayers();
    }


    // =====================================================
    // INITIALIZE MAP
    // =====================================================

    initializeMap() {

        this.map = L.map('map', {
            center: mapConfig.center,
            zoom: mapConfig.zoom,
            zoomControl: false
        });


        // -------------------------------------------------
        // PANE
        // -------------------------------------------------

        this.createMapPanes();


        // -------------------------------------------------
        // MAP CONTROLS
        // -------------------------------------------------

        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);


        L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: false
        }).addTo(this.map);


        // -------------------------------------------------
        // BASEMAP
        // -------------------------------------------------

        this.setBasemap(this.currentBasemap);


        // -------------------------------------------------
        // LAYER MANAGER
        // -------------------------------------------------

        this.layerManager = new LayerManager(this.map);
    }


    // =====================================================
    // CREATE MAP PANES
    // =====================================================

    createMapPanes() {

        const panes = {

            pane_batasdesa: 410,
            pane_batasdusun: 420,
            pane_batasrt: 430,
            pane_sungai: 440,
            pane_jaringanjalan: 450,
            pane_relkereta: 460,
            pane_minim_penerangan: 465,
            pane_pju: 470,
            pane_sarana: 480,
            pane_ekonomi: 490,
            pane_situsbudaya: 500
        };

        Object.entries(panes).forEach(([name, zIndex]) => {
            this.map.createPane(name);
            this.map.getPane(name).style.zIndex = zIndex;
        });
    }

    // =====================================================
    // INITIALIZE CONTROLS
    // =====================================================

    initializeControls() {

        // -------------------------------------------------
        // BASEMAP SELECTOR
        // -------------------------------------------------

        const basemapSelect =
            document.getElementById('basemapSelect');

        if (basemapSelect) {

            basemapSelect.value = this.currentBasemap;
            basemapSelect.addEventListener('change', (e) => {
                this.setBasemap(e.target.value);
            });
        }


        // -------------------------------------------------
        // LAYER CHECKBOX
        // -------------------------------------------------

        Object.keys(mapConfig.dataSources).forEach(layerName => {

            const checkbox =
                document.getElementById(layerName);

            if (checkbox) {
                checkbox.addEventListener('change', (e) => {

                    this.layerManager.toggleLayer(
                        layerName,
                        e.target.checked
                    );
                });
            }
        });

        // -------------------------------------------------
        // STYLE TOGGLE
        // -------------------------------------------------

        document.querySelectorAll('.style-toggle-btn')
            .forEach(button => {

                button.addEventListener('click', (e) => {
                    const targetId =
                        e.currentTarget.dataset.target;
                    const controls =
                        document.getElementById(targetId);
                    if (!controls) return;
                    const isHidden =
                        controls.style.display === 'none' ||
                        controls.style.display === '';
                    controls.style.display =
                        isHidden ? 'block' : 'none';
                });
            });

        // -------------------------------------------------
        // ABOUT
        // -------------------------------------------------

        const aboutBtn =
            document.getElementById('aboutBtn');

        if (aboutBtn) {

            aboutBtn.addEventListener('click', () => {

                this.showAboutModal();
            });
        }

        // -------------------------------------------------
        // HOME / ZOOM EXTENT
        // -------------------------------------------------

        const homeBtn =
            document.getElementById('homeBtn');
        if (homeBtn) {
            homeBtn.addEventListener('click', () => {
                this.layerManager.zoomToExtent();
            });
        }

        // -------------------------------------------------
        // SIDEBAR TOGGLE
        // -------------------------------------------------

        const sidebar =
            document.getElementById('sidebar');
        const sidebarToggle =
            document.getElementById('sidebar-toggle');
        if (sidebar && sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('collapsed');
                const icon =
                    sidebarToggle.querySelector('i');

                if (icon) {

                    icon.classList.toggle(
                        'fa-chevron-left'
                    );

                    icon.classList.toggle(
                        'fa-chevron-right'
                    );
                }

                setTimeout(() => {
                    if (this.map) {
                        this.map.invalidateSize({
                            pan: true
                        });
                    }
                }, 400);
            });
        }
    }

    // =====================================================
    // BASEMAP
    // =====================================================

    setBasemap(basemapType) {

        this.map.eachLayer((layer) => {
            if (layer instanceof L.TileLayer) {
                this.map.removeLayer(layer);
            }
        });

        const basemapConfig =
            mapConfig.basemaps[basemapType];

        if (!basemapConfig) {

            console.warn(
                `Basemap "${basemapType}" tidak ditemukan.`
            );
            return;
        }

        L.tileLayer(
            basemapConfig.url,
            {
                attribution:
                    basemapConfig.attribution,
                maxZoom:
                    basemapConfig.maxZoom || 19
            }
        ).addTo(this.map);

        this.currentBasemap =
            basemapType;
    }

    // =====================================================
    // LOAD ALL LAYERS
    // =====================================================

    async loadLayers() {
        if (!this.layerManager) return;
        await this.layerManager.loadAllLayers();

        // -------------------------------------------------
        // JIKA ADA LAYER DARI HOME
        // -------------------------------------------------

        if (this.layerToZoom) {
            const layerName =
                this.layerToZoom;

            // Pastikan checkbox aktif
            const checkbox =
                document.getElementById(layerName);

            if (checkbox) {
                checkbox.checked = true;
                this.layerManager.toggleLayer(
                    layerName,
                    true
                );
            }

            setTimeout(() => {

                this.layerManager.zoomToLayer(
                    layerName
                );
            }, 300);

        }

        // -------------------------------------------------
        // JIKA TIDAK ADA PARAMETER
        // -------------------------------------------------

        else {
            setTimeout(() => {
                if (
                    this.layerManager.layers &&
                    this.layerManager.layers.batasdesa
                ) {
                    this.layerManager.zoomToLayer(
                        'batasdesa'
                    );
                }

                else {
                    this.layerManager.zoomToExtent();
                }
            }, 300);
        }
    }

    // =====================================================
    // ABOUT MODAL
    // =====================================================

    showAboutModal() {

        const modal =
            document.getElementById('aboutModal');

        if (modal) {
            modal.style.display = 'block';
        }
    }
}

// =========================================================
// START APPLICATION
// =========================================================

document.addEventListener(
    'DOMContentLoaded',
    () => {
        window.app =
            new StoryMapApp();
    }
);