// =========================================================
// MAIN APPLICATION
// Desa Kliwonan
// =========================================================

class StoryMapApp {

    constructor() {

        this.map = null;
        this.layerManager = null;

        this.currentBasemap = 'google';

        // =====================================================
        // URL PARAMETER
        // =====================================================

        const urlParams =
            new URLSearchParams(window.location.search);

        this.layerToZoom =
            urlParams.get('layer');

        // =====================================================
        // INITIALIZE
        // =====================================================

        this.initializeMap();
        this.initializeControls();
        this.loadLayers();
    }


    // =====================================================
    // INITIALIZE MAP
    // =====================================================

    initializeMap() {

        this.map = L.map('map', {

            center:
                mapConfig.center,

            zoom:
                mapConfig.zoom,

            zoomControl:
                false
        });


        // -------------------------------------------------
        // CREATE MAP PANES
        // -------------------------------------------------

        this.createMapPanes();


        // -------------------------------------------------
        // ZOOM CONTROL
        // -------------------------------------------------

        L.control.zoom({

            position:
                'bottomright'

        }).addTo(this.map);


        // -------------------------------------------------
        // SCALE
        // -------------------------------------------------

        L.control.scale({

            position:
                'bottomleft',

            metric:
                true,

            imperial:
                false

        }).addTo(this.map);


        // -------------------------------------------------
        // BASEMAP
        // -------------------------------------------------

        this.setBasemap(
            this.currentBasemap
        );


        // -------------------------------------------------
        // LAYER MANAGER
        // -------------------------------------------------

        this.layerManager =
            new LayerManager(this.map);
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


        Object.entries(panes).forEach(
            ([name, zIndex]) => {

                let pane =
                    this.map.getPane(name);


                // Jika pane belum ada,
                // buat terlebih dahulu

                if (!pane) {

                    pane =
                        this.map.createPane(name);
                }


                pane.style.zIndex =
                    zIndex;
            }
        );
    }


    // =====================================================
    // INITIALIZE CONTROLS
    // =====================================================

    initializeControls() {


        // =================================================
        // BASEMAP SELECTOR
        // =================================================

        const basemapSelect =
            document.getElementById(
                'basemapSelect'
            );


        if (basemapSelect) {

            basemapSelect.value =
                this.currentBasemap;


            basemapSelect.addEventListener(
                'change',
                (event) => {

                    this.setBasemap(
                        event.target.value
                    );
                }
            );
        }


        // =================================================
        // LAYER CHECKBOX
        // =================================================

        Object.keys(
            mapConfig.dataSources
        ).forEach(
            (layerName) => {

                const checkbox =
                    document.getElementById(
                        layerName
                    );


                if (!checkbox) {
                    return;
                }


                checkbox.addEventListener(
                    'change',
                    (event) => {

                        if (
                            !this.layerManager
                        ) {
                            return;
                        }


                        this.layerManager.toggleLayer(

                            layerName,

                            event.target.checked
                        );
                    }
                );
            }
        );


        // =================================================
        // STYLE TOGGLE
        // =================================================

        document
            .querySelectorAll(
                '.style-toggle-btn'
            )
            .forEach(
                (button) => {

                    button.addEventListener(
                        'click',
                        (event) => {

                            const targetId =
                                event.currentTarget
                                    .dataset.target;


                            const controls =
                                document.getElementById(
                                    targetId
                                );


                            if (!controls) {
                                return;
                            }


                            const isHidden =
                                controls.style.display ===
                                    'none' ||
                                controls.style.display ===
                                    '';


                            controls.style.display =
                                isHidden
                                    ? 'block'
                                    : 'none';
                        }
                    );
                }
            );


        // =================================================
        // ABOUT
        // =================================================

        const aboutBtn =
            document.getElementById(
                'aboutBtn'
            );


        if (aboutBtn) {

            aboutBtn.addEventListener(
                'click',
                () => {

                    this.showAboutModal();
                }
            );
        }


        // =================================================
        // HOME / ZOOM EXTENT
        // =================================================

        const homeBtn =
            document.getElementById(
                'homeBtn'
            );


        if (homeBtn) {

            homeBtn.addEventListener(
                'click',
                () => {

                    if (
                        this.layerManager
                    ) {

                        this.layerManager
                            .zoomToExtent();
                    }
                }
            );
        }


        // =================================================
        // SIDEBAR TOGGLE
        // =================================================

        const sidebar =
            document.getElementById(
                'sidebar'
            );


        const sidebarToggle =
            document.getElementById(
                'sidebar-toggle'
            );


        if (
            sidebar &&
            sidebarToggle
        ) {

            sidebarToggle.addEventListener(
                'click',
                () => {

                    sidebar.classList.toggle(
                        'collapsed'
                    );


                    const icon =
                        sidebarToggle.querySelector(
                            'i'
                        );


                    if (icon) {

                        icon.classList.toggle(
                            'fa-chevron-left'
                        );


                        icon.classList.toggle(
                            'fa-chevron-right'
                        );
                    }


                    // Beri waktu untuk animasi sidebar
                    // selesai sebelum Leaflet menghitung ulang

                    setTimeout(
                        () => {

                            if (this.map) {

                                this.map.invalidateSize({
                                    pan: true
                                });
                            }

                        },
                        400
                    );
                }
            );
        }
    }


    // =====================================================
    // BASEMAP
    // =====================================================

    setBasemap(basemapType) {


        // -------------------------------------------------
        // HAPUS TILE LAYER LAMA
        // -------------------------------------------------

        this.map.eachLayer(
            (layer) => {

                if (
                    layer instanceof
                    L.TileLayer
                ) {

                    this.map.removeLayer(
                        layer
                    );
                }
            }
        );


        // -------------------------------------------------
        // AMBIL KONFIGURASI BASEMAP
        // -------------------------------------------------

        const basemapConfig =
            mapConfig.basemaps[
                basemapType
            ];


        if (!basemapConfig) {

            console.warn(
                `Basemap "${basemapType}" tidak ditemukan.`
            );

            return;
        }


        // -------------------------------------------------
        // TAMBAHKAN BASEMAP
        // -------------------------------------------------

        L.tileLayer(

            basemapConfig.url,

            {

                attribution:
                    basemapConfig.attribution,

                maxZoom:
                    basemapConfig.maxZoom ||
                    19
            }

        ).addTo(this.map);


        // -------------------------------------------------
        // SIMPAN BASEMAP AKTIF
        // -------------------------------------------------

        this.currentBasemap =
            basemapType;
    }


    // =====================================================
    // LOAD ALL LAYERS
    // =====================================================

    async loadLayers() {

        if (
            !this.layerManager
        ) {
            return;
        }


        // -------------------------------------------------
        // LOAD SEMUA LAYER
        // -------------------------------------------------

        await this.layerManager
            .loadAllLayers();


        // =================================================
        // JIKA ADA PARAMETER LAYER DARI HOME
        // =================================================

        if (this.layerToZoom) {

            const layerName =
                this.layerToZoom;


            const checkbox =
                document.getElementById(
                    layerName
                );


            // ------------------------------------------------
            // AKTIFKAN CHECKBOX
            // ------------------------------------------------

            if (checkbox) {

                checkbox.checked =
                    true;
            }


            // ------------------------------------------------
            // AKTIFKAN LAYER
            // ------------------------------------------------

            this.layerManager.toggleLayer(
                layerName,
                true
            );


            // ------------------------------------------------
            // ZOOM KE LAYER
            // ------------------------------------------------

            setTimeout(
                () => {

                    this.layerManager
                        .zoomToLayer(
                            layerName
                        );

                },
                300
            );
        }


        // =================================================
        // JIKA TIDAK ADA PARAMETER LAYER
        // =================================================

        else {

            setTimeout(
                () => {

                    if (
                        this.layerManager.layers &&
                        this.layerManager.layers.batasdesa
                    ) {

                        this.layerManager
                            .zoomToLayer(
                                'batasdesa'
                            );

                    }

                    else {

                        this.layerManager
                            .zoomToExtent();
                    }

                },
                300
            );
        }
    }


    // =====================================================
    // ABOUT MODAL
    // =====================================================

    showAboutModal() {

        const modal =
            document.getElementById(
                'aboutModal'
            );


        if (modal) {

            modal.style.display =
                'block';
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