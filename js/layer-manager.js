class LayerManager {
  constructor(map) {
    this.map = map;

    this.layers = {};
    this.layerGroups = {};
    this.bounds = null;

    this.popupLockedByClick = false;

    this.defaultVisibleLayers = [
      "batasdesa",
      "pemerintahan",
      "pendidikan",
      "peribadatan",
      "jaringanjalan",
      "sungai",
    ];

    this.defaultHiddenLayers = [
      "batasdusun",
      "batasrt",
    ];

    // =====================================================
    // ICON CONFIG
    // =====================================================

    this.iconConfig = {
      pemerintahan: {
        symbol: "🏛",
        color: "#7c3aed",
      },

      pendidikan: {
        symbol: "🎓",
        color: "#2563eb",
      },

      masjid: {
        symbol: "🕌",
        color: "#15803d",
      },

      mushola: {
        symbol: "🕌",
        color: "#16a34a",
      },

      gereja: {
        symbol: "⛪",
        color: "#dc2626",
      },

      lapangan: {
        symbol: "🏐",
        color: "#ea580c",
      },

      tpu: {
        symbol: "🪦",
        color: "#475569",
      },

      sppg: {
        symbol: "🍽",
        color: "#ca8a04",
      },

      kopdes: {
        symbol: "🏪",
        color: "#0891b2",
      },

      umkm: {
        symbol: "🛍",
        color: "#c026d3",
      },

      industri: {
        symbol: "🏭",
        color: "#64748b",
      },

      situsbudaya: {
        symbol: "🏛",
        color: "#92400e",
      },

      sumbor: {
        symbol: "💧",
        color: "#0284c7",
      },

      pju: {
        symbol: "💡",
        color: "#eab308",
      },
    };

    // =====================================================
    // PANE MAPPING
    // =====================================================

    this.paneMapping = {
      batasdesa: "pane-batasdesa",
      batasdusun: "pane-batasdusun",
      batasrt: "pane-batasrt",

      pemerintahan: "pane-fasilitas",
      pendidikan: "pane-fasilitas",
      peribadatan: "pane-fasilitas",
      lapangan: "pane-fasilitas",
      tpu: "pane-fasilitas",
      sppg: "pane-fasilitas",
      kopdes: "pane-fasilitas",

      umkm: "pane-ekonomi",
      industri: "pane-ekonomi",

      jaringanjalan: "pane-jalan",
      relkereta: "pane-kereta",

      sungai: "pane-sungai",

      pju: "pane-pju",

      minim_penerangan: "pane-minim-penerangan",

      situsbudaya: "pane-potensi",
      sumbor: "pane-potensi",
    };

    this.initializePanes();
    this.initializeStyle();
    this.initializeLayerGroups();
  }

  // =====================================================
  // INITIALIZE PANES
  // =====================================================

  initializePanes() {
    const panes = {
      "pane-batasdesa": 300,
      "pane-batasdusun": 310,
      "pane-batasrt": 320,

      "pane-sungai": 350,

      "pane-jalan": 400,
      "pane-kereta": 410,

      "pane-ekonomi": 500,
      "pane-potensi": 510,

      "pane-minim-penerangan": 550,

      "pane-fasilitas": 600,
      "pane-pju": 650,

      tooltipPane: 1000,
    };

    Object.entries(panes).forEach(([name, zIndex]) => {
      let pane = this.map.getPane(name);

      if (!pane) {
        pane = this.map.createPane(name);
      }

      pane.style.zIndex = zIndex;
    });
  }

  // =====================================================
  // INITIALIZE STYLE
  // =====================================================

  initializeStyle() {
    if (document.getElementById("lm-style")) {
      return;
    }

    const style = document.createElement("style");

    style.id = "lm-style";

    style.textContent = `
      .leaflet-tooltip.road-label-wrapper {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
        color: #fff !important;
        font-size: 9px !important;
        font-weight: 600 !important;
        text-shadow:
          1px 1px 2px #000,
          -1px -1px 2px #000,
          1px -1px 2px #000,
          -1px 1px 2px #000;
        white-space: nowrap !important;
        pointer-events: none !important;
      }

      .leaflet-tooltip.road-label-wrapper:before {
        display: none !important;
      }

      .road-label-text {
        background: none !important;
        border: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        color: #fff !important;
        white-space: nowrap !important;
        pointer-events: none !important;
        display: inline-block !important;
      }

      .boundary-label-wrapper {
        background: rgba(255,255,255,.95) !important;
        border: 1px solid #397b18 !important;
        border-radius: 5px !important;
        box-shadow: 0 2px 8px rgba(0,0,0,.15) !important;
        color: #222 !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        padding: 4px 7px !important;
      }

      .boundary-label-wrapper:before {
        display: none !important;
      }

      .boundary-click-label {
        white-space: nowrap !important;
      }
    `;

    document.head.appendChild(style);
  }

  // =====================================================
  // INITIALIZE LAYER GROUPS
  // =====================================================

  initializeLayerGroups() {
    if (!mapConfig || !mapConfig.dataSources) {
      console.error("mapConfig.dataSources tidak ditemukan.");
      return;
    }

    Object.keys(mapConfig.dataSources).forEach((name) => {
      this.layerGroups[name] = L.layerGroup();
    });
  }

  // =====================================================
  // AUTO ICON
  // =====================================================

  createAutoIcon(category) {
    const config =
      this.iconConfig[category] || {
        symbol: "●",
        color: "#397b18",
      };

    return L.divIcon({
      className: "auto-map-icon",

      html: `
        <div
          style="
            width:24px;
            height:24px;
            border-radius:50%;
            background:${config.color};
            border:1.5px solid #fff;
            box-shadow:0 1px 4px rgba(0,0,0,.25);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size:12px;
            line-height:1;
          "
        >
          ${config.symbol}
        </div>
      `,

      iconSize: [24, 24],

      iconAnchor: [12, 12],

      popupAnchor: [0, -12],
    });
  }

  // =====================================================
  // PROPERTY HELPER
  // =====================================================

  getProperty(properties, keys) {
    for (const key of keys) {
      if (
        properties[key] !== undefined &&
        properties[key] !== null &&
        properties[key] !== ""
      ) {
        return properties[key];
      }
    }

    return "";
  }

  normalizeText(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  // =====================================================
  // DUSUN
  // =====================================================

  getDusunName(feature) {
    return this.getProperty(feature.properties || {}, ["Nama"]);
  }

  // =====================================================
  // RT
  // =====================================================

  getRTName(feature) {
    const value = this.getProperty(feature.properties || {}, ["Nama"]);

    if (!value) {
      return "";
    }

    const text = String(value).trim();

    if (/^rt/i.test(text)) {
      return text;
    }

    if (/^\d+$/.test(text)) {
      return `RT ${text.padStart(2, "0")}`;
    }

    return text;
  }

  // =====================================================
  // ROAD
  // =====================================================

  getRoadName(feature) {
    return this.getProperty(feature.properties || {}, ["Nama"]);
  }

  // =====================================================
  // LIGHTING STATUS
  // =====================================================

  getLightingStatus(feature) {
    return this.getProperty(feature.properties || {}, ["Status"]);
  }

  // =====================================================
  // PERIBADATAN CATEGORY
  // =====================================================

  getPeribadatanCategory(feature) {
    const properties = feature.properties || {};

    const value = String(
      properties.Jenis ||
        properties.JENIS ||
        properties.jenis ||
        properties.Nama ||
        ""
    ).toLowerCase();

    if (value.includes("gereja")) {
      return "gereja";
    }

    if (
      value.includes("musholla") ||
      value.includes("mushola")
    ) {
      return "mushola";
    }

    return "masjid";
  }

  // =====================================================
  // PJU COLOR
  // =====================================================

  getPJUColor(feature) {
    const value = this.normalizeText(
      this.getProperty(feature.properties || {}, ["Kondisi"])
    );

    if (/nyala|menyala|baik|hidup/.test(value)) {
      return "#eab308";
    }

    if (/mati|rusak|tidak/.test(value)) {
      return "#64748b";
    }

    return "#eab308";
  }

  // =====================================================
  // MINIM LIGHTING COLOR
  // =====================================================

  getMinimLightingColor(feature) {
    const value = this.normalizeText(
      this.getLightingStatus(feature)
    );

    if (value.includes("terang")) {
      return "#2e7d32";
    }

    if (value.includes("sedang")) {
      return "#f9a825";
    }

    return "#c62828";
  }

  // =====================================================
  // GENERATE COLOR
  // =====================================================

  generateNameColor(name) {
    const colors = [
      "#7c3aed",
      "#2563eb",
      "#dc2626",
      "#ea580c",
      "#0891b2",
      "#16a34a",
      "#c026d3",
      "#ca8a04",
      "#0f766e",
      "#db2777",
      "#4f46e5",
      "#65a30d",
      "#9333ea",
      "#0284c7",
      "#e11d48",
    ];

    let hash = 0;

    for (const char of String(name || "")) {
      hash =
        (hash << 5) -
        hash +
        char.charCodeAt(0);

      hash |= 0;
    }

    return colors[Math.abs(hash) % colors.length];
  }

  // =====================================================
  // DUSUN COLOR
  // =====================================================

  findDusunColor(name) {
    if (name && mapConfig.dusunColorMap) {
      const normalizedName = this.normalizeText(name);

      for (const [key, color] of Object.entries(
        mapConfig.dusunColorMap
      )) {
        const normalizedKey =
          this.normalizeText(key);

        if (
          normalizedKey === normalizedName ||
          normalizedName.includes(normalizedKey) ||
          normalizedKey.includes(normalizedName)
        ) {
          return color;
        }
      }
    }

    return this.generateNameColor(
      name || "Dusun"
    );
  }

  // =====================================================
  // RT COLOR
  // =====================================================

  getRTColor(feature) {
    return this.generateNameColor(
      this.getRTName(feature)
    );
  }

  // =====================================================
  // GET LAYER STYLE
  // =====================================================

  getLayerStyle(name, feature) {

    // ===================================================
    // BATAS DESA
    // ===================================================

    if (name === "batasdesa") {
      const config = mapConfig.layerStyles?.batasdesa || {};

      return {
        color: "#FFD700",

        weight:
          config.weight !== undefined
            ? config.weight
            : 3,

        opacity:
          config.opacity !== undefined
            ? config.opacity
            : 1,

        fill: true,

        fillColor: "#FFD700",

        fillOpacity:
          config.fillOpacity !== undefined
            ? config.fillOpacity
            : 0.15,

        dashArray:
          config.dashArray || null,

        pane: this.paneMapping[name],
      };
    }

    // ===================================================
    // BATAS DUSUN
    // ===================================================

    if (name === "batasdusun") {
      const color = this.findDusunColor(
        this.getDusunName(feature)
      );

      return {
        color: color,

        weight: 2.5,

        opacity: 0.9,

        fill: true,

        fillColor: color,

        fillOpacity: 0.16,

        dashArray: null,

        pane: this.paneMapping[name],
      };
    }

    // ===================================================
    // BATAS RT
    // ===================================================

    if (name === "batasrt") {
      const color = this.getRTColor(feature);

      return {
        color: color,

        weight: 1.5,

        opacity: 0.9,

        fill: true,

        fillColor: color,

        fillOpacity: 0.10,

        dashArray: null,

        pane: this.paneMapping[name],
      };
    }

    // ===================================================
    // JARINGAN JALAN
    // ===================================================

    if (name === "jaringanjalan") {
      const config =
        mapConfig.layerStyles?.jaringanjalan || {};

      return {
        ...config,

        color:
          config.color ||
          "#e67e22",

        weight:
          config.weight !== undefined
            ? config.weight
            : 2.5,

        opacity:
          config.opacity !== undefined
            ? config.opacity
            : 0.8,

        pane: this.paneMapping[name],
      };
    }

    // ===================================================
    // REL KERETA API
    // ===================================================

    if (name === "relkereta") {
      const config =
        mapConfig.layerStyles?.relkereta || {};

      return {
        ...config,

        color:
          config.color ||
          "#5d4037",

        weight:
          config.weight !== undefined
            ? config.weight
            : 5,

        opacity:
          config.opacity !== undefined
            ? config.opacity
            : 1,

        dashArray:
          config.dashArray ||
          "8,5",

        pane: this.paneMapping[name],
      };
    }

    // ===================================================
    // PJU
    // ===================================================

    if (name === "pju") {
      const color =
        this.getPJUColor(feature);

      return {
        color: color,

        fillColor: color,

        weight: 1,

        opacity: 1,

        fillOpacity: 1,

        pane: this.paneMapping[name],
      };
    }

    // ===================================================
    // AREA MINIM PENERANGAN
    // ===================================================

    if (name === "minim_penerangan") {
      const color =
        this.getMinimLightingColor(
          feature
        );

      const config =
        mapConfig.layerStyles?.minim_penerangan ||
        {};

      return {
        ...config,

        color: color,

        fillColor: color,

        weight: 2,

        opacity:
          config.opacity !== undefined
            ? config.opacity
            : 0.9,

        fillOpacity:
          config.fillOpacity !== undefined
            ? config.fillOpacity
            : 0.22,

        pane: this.paneMapping[name],
      };
    }

    // ===================================================
    // DEFAULT
    // ===================================================

    return {
      ...(mapConfig.layerStyles?.[name] || {}),

      ...(this.paneMapping[name]
        ? {
            pane: this.paneMapping[name],
          }
        : {}),
    };
  }

  // =====================================================
  // CREATE POINT LAYER
  // =====================================================

  createPointLayer(name, feature, latlng) {

    if (name === "peribadatan") {
      return L.marker(latlng, {
        icon: this.createAutoIcon(
          this.getPeribadatanCategory(
            feature
          )
        ),

        pane: this.paneMapping[name],
      });
    }

    if (this.iconConfig[name]) {
      return L.marker(latlng, {
        icon: this.createAutoIcon(name),

        pane: this.paneMapping[name],
      });
    }

    return L.circleMarker(latlng, {
      radius: 5,

      fillColor: "#397b18",

      color: "#fff",

      weight: 1,

      opacity: 1,

      fillOpacity: 0.9,

      pane: this.paneMapping[name],
    });
  }

  // =====================================================
  // LOAD LAYER
  // =====================================================

  async loadLayer(name) {
    try {
      const url =
        mapConfig.dataSources[name];

      if (!url) {
        console.warn(
          `Sumber data untuk ${name} tidak ditemukan.`
        );

        return null;
      }

      const response =
        await fetch(url);

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const data =
        await response.json();

      if (
        !data ||
        !Array.isArray(data.features)
      ) {
        throw new Error(
          "GeoJSON tidak valid"
        );
      }

      const layer = L.geoJSON(
        data,
        {
          pane: this.paneMapping[name],

          style: (feature) =>
            this.getLayerStyle(
              name,
              feature
            ),

          pointToLayer: (
            feature,
            latlng
          ) =>
            this.createPointLayer(
              name,
              feature,
              latlng
            ),

          onEachFeature: (
            feature,
            layer
          ) =>
            this.setupFeatureEvents(
              name,
              feature,
              layer
            ),
        }
      );

      if (this.layerGroups[name]) {
        this.layerGroups[name].clearLayers();

        this.layerGroups[name].addLayer(
          layer
        );
      }

      this.layers[name] = layer;

      this.updateBounds(layer);

      return layer;

    } catch (error) {

      console.error(
        `Gagal memuat ${name}:`,
        error
      );

      this.showError(
        `Gagal memuat layer: ${name}`
      );

      return null;
    }
  }

  // =====================================================
  // FEATURE EVENTS
  // =====================================================

  setupFeatureEvents(
    name,
    feature,
    layer
  ) {

    this.bindLayerLabel(
      name,
      feature,
      layer
    );

    const isBoundary =
      name === "batasdusun" ||
      name === "batasrt";

    // ===================================================
    // MOUSEOVER
    // ===================================================

    layer.on(
      "mouseover",
      () => {

        if (isBoundary) {
          return;
        }

        if (
          layer.setStyle &&
          feature.geometry?.type !== "Point"
        ) {

          const style =
            this.getLayerStyle(
              name,
              feature
            );

          layer.setStyle({
            weight: Math.max(
              (style.weight || 2) + 2,
              4
            ),
          });
        }
      }
    );

    // ===================================================
    // MOUSEOUT
    // ===================================================

    layer.on(
      "mouseout",
      () => {

        if (
          !this.popupLockedByClick
        ) {

          this.resetLayerStyle(
            name,
            layer,
            feature
          );
        }
      }
    );

    // ===================================================
    // CLICK
    // ===================================================

    layer.on(
      "click",
      (event) => {

        // ===============================================
        // BATAS DUSUN / RT
        // ===============================================

        if (isBoundary) {

          const nameText =
            name === "batasdusun"
              ? this.getDusunName(
                  feature
                )
              : this.getRTName(
                  feature
                );

          if (nameText) {

            if (
              layer.getTooltip()
            ) {
              layer.closeTooltip();
            }

            layer
              .bindTooltip(
                `<span class="boundary-click-label">${this.escapeHtml(
                  nameText
                )}</span>`,
                {
                  permanent: false,

                  direction: "center",

                  className:
                    "boundary-label-wrapper",

                  sticky: false,
                }
              )
              .openTooltip(
                event.latlng
              );
          }

          L.DomEvent.stopPropagation(
            event
          );

          return;
        }

        // ===============================================
        // POPUP
        // ===============================================

        this.popupLockedByClick =
          true;

        const content =
          window.popupHandler?.createPopupContent
            ? window.popupHandler.createPopupContent(
                feature,
                name
              )
            : this.createDefaultPopup(
                feature,
                name
              );

        const popup = L.popup({
          closeButton: true,

          className:
            "popup-click",

          maxWidth: 340,
        })
          .setLatLng(
            event.latlng
          )
          .setContent(content)
          .openOn(this.map);

        popup.on(
          "remove",
          () => {

            this.popupLockedByClick =
              false;

            this.resetLayerStyle(
              name,
              layer,
              feature
            );
          }
        );

        if (
          layer.setStyle &&
          feature.geometry?.type !== "Point"
        ) {

          const style =
            this.getLayerStyle(
              name,
              feature
            );

          layer.setStyle({
            weight: Math.max(
              (style.weight || 2) + 2,
              4
            ),
          });
        }

        L.DomEvent.stopPropagation(
          event
        );
      }
    );
  }

  // =====================================================
  // LABEL JALAN
  // =====================================================

  bindLayerLabel(
    name,
    feature,
    layer
  ) {

    if (
      name !== "jaringanjalan" ||
      !this.getRoadName(feature) ||
      !layer.getLatLngs
    ) {
      return;
    }

    this.bindRoadLabel(
      layer,
      this.getRoadName(feature)
    );
  }

  // =====================================================
  // LABEL JALAN
  // =====================================================
  // Posisi default = 50% panjang jalan.
  //
  // KHUSUS:
  // Jl. Panembahan Senopati I = 25% dari awal jalan.
  // =====================================================

  bindRoadLabel(
    layer,
    name
  ) {

    try {

      const rawLatLngs =
        layer.getLatLngs();

      const paths =
        this.extractRoadPaths(
          rawLatLngs
        );

      if (
        !paths ||
        paths.length === 0
      ) {
        return;
      }

      // -------------------------------------------------
      // Pilih bagian garis TERPANJANG
      // -------------------------------------------------

      let selectedPath =
        paths[0];

      let longestLength =
        this.getPathLength(
          selectedPath
        );

      for (
        let i = 1;
        i < paths.length;
        i++
      ) {

        const currentLength =
          this.getPathLength(
            paths[i]
          );

        if (
          currentLength >
          longestLength
        ) {

          longestLength =
            currentLength;

          selectedPath =
            paths[i];
        }
      }

      if (
        !selectedPath ||
        selectedPath.length < 2
      ) {
        return;
      }

      // -------------------------------------------------
      // POSISI LABEL
      // -------------------------------------------------
      //
      // Default semua jalan:
      // 50%
      //
      // Khusus Jl. Panembahan Senopati I:
      // 25% dari awal jalan
      // -------------------------------------------------

      const isPanembahanSenopatiI =
        this.normalizeRoadName(name) ===
        "jl panembahan senopati i";

      const labelPosition =
        isPanembahanSenopatiI
          ? 0.25
          : 0.50;

      const labelPoint =
        this.getPathPointAtRatio(
          selectedPath,
          labelPosition
        );

      if (!labelPoint) {
        return;
      }

      // -------------------------------------------------
      // Arah jalan di sekitar posisi label
      // -------------------------------------------------

      const direction =
        this.getPathDirectionAtRatio(
          selectedPath,
          labelPosition
        );

      // -------------------------------------------------
      // Buat tooltip label
      // -------------------------------------------------

      layer.bindTooltip(
        `<span class="road-label-text">${this.escapeHtml(
          name
        )}</span>`,
        {
          permanent: false,

          direction: "center",

          className:
            "road-label-wrapper",

          sticky: false,

          opacity: 1,

          offset: [0, 0],
        }
      );

      // -------------------------------------------------
      // Tampilkan label di posisi yang sudah ditentukan
      // -------------------------------------------------

      layer.on(
        "tooltipopen",
        (event) => {

          const tooltip =
            event.tooltip;

          tooltip.setLatLng(
            labelPoint
          );

          const element =
            tooltip.getElement();

          const text =
            element?.querySelector(
              ".road-label-text"
            );

          if (text) {

            text.style.transform =
              `rotate(${direction}deg)`;

            text.style.transformOrigin =
              "center center";
          }
        }
      );

      // -------------------------------------------------
      // Tampilkan label hanya pada zoom >= 16
      // -------------------------------------------------

      const update =
        () => {

          if (
            !this.map.hasLayer(
              layer
            )
          ) {
            return;
          }

          const tooltip =
            layer.getTooltip();

          if (!tooltip) {
            return;
          }

          if (
            this.map.getZoom() >= 16
          ) {

            tooltip.setLatLng(
              labelPoint
            );

            layer.openTooltip();

          } else {

            layer.closeTooltip();
          }
        };

      this.map.on(
        "zoomend",
        update
      );

      update();

    } catch (error) {

      console.warn(
        "Label jalan gagal:",
        error
      );
    }
  }

  // =====================================================
  // NORMALIZE ROAD NAME
  // =====================================================

  normalizeRoadName(name) {

    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/\./g, "")
      .replace(/\s+/g, " ");
  }

  // =====================================================
  // GET PATH POINT AT RATIO
  // =====================================================
  // ratio:
  // 0.00 = awal jalan
  // 0.25 = 1/4 jalan
  // 0.50 = tengah jalan
  // 1.00 = akhir jalan
  // =====================================================

  getPathPointAtRatio(
    path,
    ratio
  ) {

    if (
      !path ||
      path.length < 2
    ) {
      return null;
    }

    const totalLength =
      this.getPathLength(
        path
      );

    if (totalLength === 0) {
      return path[0];
    }

    const targetDistance =
      totalLength *
      Math.max(
        0,
        Math.min(
          1,
          ratio
        )
      );

    let accumulated = 0;

    for (
      let i = 0;
      i < path.length - 1;
      i++
    ) {

      const first =
        path[i];

      const second =
        path[i + 1];

      const segmentLength =
        this.getDistance(
          first,
          second
        );

      if (
        accumulated +
          segmentLength >=
        targetDistance
      ) {

        const remaining =
          targetDistance -
          accumulated;

        const ratioInsideSegment =
          segmentLength === 0
            ? 0
            : remaining /
              segmentLength;

        return L.latLng(
          first.lat +
            (second.lat -
              first.lat) *
              ratioInsideSegment,

          first.lng +
            (second.lng -
              first.lng) *
              ratioInsideSegment
        );
      }

      accumulated +=
        segmentLength;
    }

    return path[
      path.length - 1
    ];
  }

  // =====================================================
  // GET PATH DIRECTION AT RATIO
  // =====================================================

  getPathDirectionAtRatio(
    path,
    ratio
  ) {

    if (
      !path ||
      path.length < 2
    ) {
      return 0;
    }

    const totalLength =
      this.getPathLength(
        path
      );

    if (totalLength === 0) {
      return 0;
    }

    const targetDistance =
      totalLength *
      Math.max(
        0,
        Math.min(
          1,
          ratio
        )
      );

    let accumulated = 0;

    for (
      let i = 0;
      i < path.length - 1;
      i++
    ) {

      const first =
        path[i];

      const second =
        path[i + 1];

      const segmentLength =
        this.getDistance(
          first,
          second
        );

      if (
        accumulated +
          segmentLength >=
        targetDistance
      ) {

        return this.calculateAngle(
          first,
          second
        );
      }

      accumulated +=
        segmentLength;
    }

    return 0;
  }

  // =====================================================
  // EXTRACT ROAD PATHS
  // =====================================================

  extractRoadPaths(latlngs) {

    if (!Array.isArray(latlngs)) {
      return [];
    }

    // ---------------------------------------------------
    // LineString
    // ---------------------------------------------------

    if (
      latlngs.length > 0 &&
      latlngs.every(
        (item) =>
          item &&
          typeof item.lat === "number" &&
          typeof item.lng === "number"
      )
    ) {

      return [
        latlngs
      ];
    }

    // ---------------------------------------------------
    // MultiLineString
    // ---------------------------------------------------

    const paths = [];

    latlngs.forEach(
      (item) => {

        if (!Array.isArray(item)) {
          return;
        }

        const path =
          this.extractSinglePath(
            item
          );

        if (
          path &&
          path.length >= 2
        ) {

          paths.push(
            path
          );
        }
      }
    );

    return paths;
  }

  // =====================================================
  // EXTRACT SINGLE PATH
  // =====================================================

  extractSinglePath(array) {

    if (!Array.isArray(array)) {
      return [];
    }

    if (
      array.length > 0 &&
      array.every(
        (item) =>
          item &&
          typeof item.lat === "number" &&
          typeof item.lng === "number"
      )
    ) {

      return array;
    }

    for (const item of array) {

      if (!Array.isArray(item)) {
        continue;
      }

      const path =
        this.extractSinglePath(
          item
        );

      if (
        path &&
        path.length >= 2
      ) {
        return path;
      }
    }

    return [];
  }

  // =====================================================
  // GET PATH LENGTH
  // =====================================================

  getPathLength(path) {

    if (
      !path ||
      path.length < 2
    ) {
      return 0;
    }

    let totalLength = 0;

    for (
      let i = 0;
      i < path.length - 1;
      i++
    ) {

      totalLength +=
        this.getDistance(
          path[i],
          path[i + 1]
        );
    }

    return totalLength;
  }

  // =====================================================
  // GET PATH MIDPOINT
  // =====================================================

  getPathMidpoint(path) {

    return this.getPathPointAtRatio(
      path,
      0.50
    );
  }

  // =====================================================
  // GET PATH DIRECTION
  // =====================================================

  getPathDirection(path) {

    return this.getPathDirectionAtRatio(
      path,
      0.50
    );
  }

  // =====================================================
  // FLATTEN LAT LNGS
  // =====================================================

  flattenLatLngs(array) {

    if (!Array.isArray(array)) {
      return [];
    }

    let result = [];

    array.forEach(
      (item) => {

        if (
          item &&
          typeof item.lat === "number" &&
          typeof item.lng === "number"
        ) {

          result.push(item);

        } else if (
          Array.isArray(item)
        ) {

          result =
            result.concat(
              this.flattenLatLngs(
                item
              )
            );
        }
      }
    );

    return result;
  }

  // =====================================================
  // GET LINE MIDPOINT
  // =====================================================

  getLineMidpoint(latlngs) {

    if (
      !latlngs ||
      latlngs.length < 2
    ) {
      return null;
    }

    let totalLength = 0;

    const lengths = [];

    for (
      let i = 0;
      i < latlngs.length - 1;
      i++
    ) {

      const distance =
        this.getDistance(
          latlngs[i],
          latlngs[i + 1]
        );

      lengths.push(
        distance
      );

      totalLength +=
        distance;
    }

    if (totalLength === 0) {
      return latlngs[
        Math.floor(
          latlngs.length / 2
        )
      ];
    }

    const half =
      totalLength / 2;

    let accumulated = 0;

    for (
      let i = 0;
      i < lengths.length;
      i++
    ) {

      const segmentLength =
        lengths[i];

      if (
        accumulated +
          segmentLength >=
        half
      ) {

        const remaining =
          half -
          accumulated;

        const ratio =
          segmentLength === 0
            ? 0
            : remaining /
              segmentLength;

        const start =
          latlngs[i];

        const end =
          latlngs[i + 1];

        return L.latLng(
          start.lat +
            (end.lat -
              start.lat) *
              ratio,

          start.lng +
            (end.lng -
              start.lng) *
              ratio
        );
      }

      accumulated +=
        segmentLength;
    }

    return latlngs[
      latlngs.length - 1
    ];
  }

  // =====================================================
  // DISTANCE
  // =====================================================

  getDistance(first, second) {

    if (
      !first ||
      !second
    ) {
      return 0;
    }

    const R =
      6371000;

    const lat1 =
      first.lat *
      Math.PI /
      180;

    const lat2 =
      second.lat *
      Math.PI /
      180;

    const deltaLat =
      (second.lat -
        first.lat) *
      Math.PI /
      180;

    const deltaLng =
      (second.lng -
        first.lng) *
      Math.PI /
      180;

    const a =
      Math.sin(
        deltaLat / 2
      ) *
        Math.sin(
          deltaLat / 2
        ) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(
          deltaLng / 2
        ) *
        Math.sin(
          deltaLng / 2
        );

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  }

  // =====================================================
  // GET DIRECTION AROUND MIDPOINT
  // =====================================================

  getDirectionAroundMidpoint(
    latlngs
  ) {

    if (
      !latlngs ||
      latlngs.length < 2
    ) {
      return 0;
    }

    let totalLength = 0;
    const lengths = [];

    for (
      let i = 0;
      i < latlngs.length - 1;
      i++
    ) {

      const distance =
        this.getDistance(
          latlngs[i],
          latlngs[i + 1]
        );

      lengths.push(
        distance
      );

      totalLength +=
        distance;
    }

    if (totalLength === 0) {
      return 0;
    }

    const half =
      totalLength / 2;

    let accumulated = 0;

    for (
      let i = 0;
      i < lengths.length;
      i++
    ) {

      if (
        accumulated +
          lengths[i] >=
        half
      ) {

        const first =
          latlngs[i];

        const second =
          latlngs[i + 1];

        return this.calculateAngle(
          first,
          second
        );
      }

      accumulated +=
        lengths[i];
    }

    return 0;
  }

  // =====================================================
  // EXTRACT LAT LNGS
  // =====================================================

  extractLatLngs(array) {

    return this.flattenLatLngs(
      array
    );
  }

  // =====================================================
  // CALCULATE ANGLE
  // =====================================================

  calculateAngle(
    first,
    second
  ) {

    if (!first || !second) {
      return 0;
    }

    let angle =
      (Math.atan2(
        second.lat - first.lat,
        second.lng - first.lng
      ) *
        180) /
      Math.PI;

    if (
      angle > 90 ||
      angle < -90
    ) {
      angle += 180;
    }

    return angle;
  }

  // =====================================================
  // DEFAULT POPUP
  // =====================================================

  createDefaultPopup(
    feature,
    name
  ) {

    const properties =
      feature.properties || {};

    let title =
      this.formatLayerName(
        name
      );

    let fields = [];

    if (name === "batasdesa") {

      title = "Batas Desa";

    } else if (
      name === "batasdusun"
    ) {

      title =
        this.getDusunName(
          feature
        ) || "Dusun";

      fields = ["Nama"];

    } else if (
      name === "batasrt"
    ) {

      title =
        this.getRTName(
          feature
        ) || "RT";

      fields = ["Nama"];

    } else if (
      name === "jaringanjalan"
    ) {

      title =
        this.getRoadName(
          feature
        ) || "Jalan";

      fields = ["Nama"];

    } else if (
      name === "pju"
    ) {

      title =
        "Penerangan Jalan Umum";

      fields = [
        "Kondisi",
        "Status",
      ];

    } else if (
      name === "minim_penerangan"
    ) {

      title =
        "Area Minim Penerangan";

      fields = ["Status"];

    } else {

      fields =
        this.getPopupFields(
          name
        );
    }

    let html =
      `<div class="popup-content">`;

    html += `<h3>${this.escapeHtml(
      title
    )}</h3>`;

    let hasData = false;

    fields.forEach(
      (key) => {

        const value =
          properties[key];

        if (
          value === null ||
          value === undefined ||
          value === ""
        ) {
          return;
        }

        hasData = true;

        html += `
          <div class="popup-row">
            <strong>${this.escapeHtml(
              this.formatPropertyName(
                key
              )
            )}:</strong>

            <span>${this.escapeHtml(
              value
            )}</span>
          </div>
        `;
      }
    );

    if (
      !hasData &&
      name !== "batasdesa"
    ) {
      html +=
        "<p>Informasi utama tidak tersedia.</p>";
    }

    html += "</div>";

    return html;
  }

  // =====================================================
  // POPUP FIELDS
  // =====================================================

  getPopupFields(name) {

    return {
      pemerintahan: ["Nama"],

      pendidikan: ["Nama"],

      peribadatan: [
        "Nama",
        "Jenis",
      ],

      lapangan: [
        "Nama",
        "Jenis",
      ],

      tpu: ["Nama"],

      sppg: ["Nama"],

      kopdes: ["Nama"],

      umkm: [
        "nama_usaha",
        "kelas",
      ],

      industri: [
        "Nama",
        "Jenis",
      ],

      relkereta: ["Nama"],

      sungai: ["Nama"],

      situsbudaya: [
        "Nama",
        "Jenis",
      ],

      sumbor: [
        "Nama",
        "Kondisi",
      ],
    }[name] || ["Nama"];
  }

  // =====================================================
  // ESCAPE HTML
  // =====================================================

  escapeHtml(value) {

    return String(value)
      .replace(
        /&/g,
        "&amp;"
      )
      .replace(
        /</g,
        "&lt;"
      )
      .replace(
        />/g,
        "&gt;"
      )
      .replace(
        /"/g,
        "&quot;"
      )
      .replace(
        /'/g,
        "&#039;"
      );
  }

  // =====================================================
  // FORMAT LAYER NAME
  // =====================================================

  formatLayerName(name) {

    return {
      batasdesa: "Batas Desa",

      batasdusun: "Batas Dusun",

      batasrt: "Batas RT",

      pemerintahan:
        "Pemerintahan",

      pendidikan:
        "Pendidikan",

      peribadatan:
        "Peribadatan",

      lapangan:
        "Lapangan",

      tpu:
        "Tempat Pemakaman Umum",

      sppg: "SPPG",

      kopdes:
        "Koperasi Desa",

      umkm:
        "UMKM",

      industri:
        "Industri",

      jaringanjalan:
        "Jaringan Jalan",

      relkereta:
        "Jalur Kereta Api",

      sungai:
        "Sungai",

      pju:
        "Penerangan Jalan Umum",

      minim_penerangan:
        "Area Minim Penerangan",

      situsbudaya:
        "Situs Budaya",

      sumbor:
        "Sumur Bor",

    }[name] || name;
  }

  // =====================================================
  // FORMAT PROPERTY NAME
  // =====================================================

  formatPropertyName(name) {

    return String(name)
      .replace(
        /_/g,
        " "
      )
      .replace(
        /\b\w/g,
        (char) =>
          char.toUpperCase()
      );
  }

  // =====================================================
  // RESET STYLE
  // =====================================================

  resetLayerStyle(
    name,
    layer,
    feature
  ) {

    if (
      layer &&
      layer.setStyle
    ) {

      layer.setStyle(
        this.getLayerStyle(
          name,
          feature
        )
      );
    }
  }

  // =====================================================
  // UPDATE BOUNDS
  // =====================================================

  updateBounds(layer) {

    try {

      const bounds =
        layer.getBounds();

      if (
        !bounds ||
        !bounds.isValid()
      ) {
        return;
      }

      if (this.bounds) {

        this.bounds.extend(
          bounds
        );

      } else {

        this.bounds =
          bounds;
      }

    } catch (error) {
      // Tidak perlu menghentikan proses layer
    }
  }

  // =====================================================
  // TOGGLE LAYER
  // =====================================================

  toggleLayer(
    name,
    visible
  ) {

    const group =
      this.layerGroups[name];

    if (!group) {
      return;
    }

    if (
      visible &&
      !this.map.hasLayer(group)
    ) {

      group.addTo(
        this.map
      );

    } else if (
      !visible &&
      this.map.hasLayer(group)
    ) {

      this.map.removeLayer(
        group
      );
    }
  }

  // =====================================================
  // ZOOM TO LAYER
  // =====================================================

  zoomToLayer(name) {

    const layer =
      this.layers[name];

    if (!layer) {
      return;
    }

    try {

      const bounds =
        layer.getBounds();

      if (
        bounds &&
        bounds.isValid()
      ) {

        this.map.fitBounds(
          bounds,
          {
            padding: [40, 40],
          }
        );

        return;
      }

    } catch (error) {}

    const center =
      this.getLayerCenter(
        layer
      );

    if (center) {

      this.map.setView(
        center,
        18
      );
    }
  }

  // =====================================================
  // GET LAYER CENTER
  // =====================================================

  getLayerCenter(layer) {

    try {

      const bounds =
        layer.getBounds();

      if (
        bounds &&
        bounds.isValid()
      ) {

        return bounds.getCenter();
      }

    } catch (error) {}

    return null;
  }

  // =====================================================
  // ZOOM TO EXTENT
  // =====================================================

  zoomToExtent() {

    if (
      this.bounds &&
      this.bounds.isValid()
    ) {

      this.map.fitBounds(
        this.bounds,
        {
          padding: [30, 30],
        }
      );

    } else {

      this.map.setView(
        mapConfig.center,
        mapConfig.zoom
      );
    }
  }

  // =====================================================
  // LOAD ALL LAYERS
  // =====================================================

  async loadAllLayers() {

    const loading =
      document.getElementById(
        "loading"
      );

    if (loading) {
      loading.style.display =
        "block";
    }

    try {

      for (
        const name of Object.keys(
          mapConfig.dataSources
        )
      ) {

        const layer =
          await this.loadLayer(
            name
          );

        if (!layer) {
          continue;
        }

        const group =
          this.layerGroups[name];

        if (!group) {
          continue;
        }

        const checkbox =
          document.getElementById(
            name
          );

        // DEFAULT HIDDEN
        if (
          this.defaultHiddenLayers.includes(
            name
          )
        ) {

          if (checkbox) {
            checkbox.checked =
              false;
          }

          this.map.removeLayer(
            group
          );

          continue;
        }

        // CHECKBOX
        const shouldShow =
          checkbox
            ? checkbox.checked
            : this.defaultVisibleLayers.includes(
                name
              );

        if (shouldShow) {

          group.addTo(
            this.map
          );

        } else {

          this.map.removeLayer(
            group
          );
        }
      }

      console.log(
        "✓ Semua layer selesai dimuat."
      );

    } catch (error) {

      console.error(
        "Gagal memuat semua layer:",
        error
      );

    } finally {

      if (loading) {
        loading.style.display =
          "none";
      }
    }
  }

  // =====================================================
  // ERROR
  // =====================================================

  showError(message) {
    console.error(message);
  }
}

// =====================================================
// GLOBAL
// =====================================================

window.LayerManager =
  LayerManager;