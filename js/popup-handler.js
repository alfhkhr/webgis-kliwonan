class PopupHandler {
  constructor() {
    // =====================================================
    // NAMA TAMPILAN LAYER
    // =====================================================

    this.layerDisplayNames = {
      batasdesa: "Informasi Desa",
      batasdusun: "Informasi Dusun",
      batasrt: "Informasi RT",
      pemerintahan: "Pemerintahan",
      pendidikan: "Pendidikan",
      peribadatan: "Peribadatan",
      lapangan: "Lapangan",
      tpu: "Tempat Pemakaman Umum",
      sppg: "SPPG",
      kopdes: "Koperasi Desa",
      umkm: "UMKM",
      industri: "Industri",
      jaringanjalan: "Jaringan Jalan",
      relkereta: "Rel Kereta Api",
      sungai: "Sungai",
      pju: "Penerangan Jalan Umum",
      minim_penerangan: "Minim Penerangan",
      situsbudaya: "Situs Budaya",
      sumbor: "Sumur Bor",
    };

    // =====================================================
    // LABEL FIELD
    // =====================================================

    this.fieldLabels = {
      namobj: "Desa",
      wadmkc: "Kecamatan",
      wadmkk: "Kabupaten",
      wadmpr: "Provinsi",
      NAMA: "Nama",
      Nama: "Nama",
      Remark: "Keterangan",
      Nama_Usaha: "Nama Usaha",
      nama_usaha: "Nama Usaha",
      Kelas: "Kelas",
      kelas: "Kelas",
      ID_Lampu: "ID Lampu",
      Kondisi: "Kondisi",
      Status: "Status",
    };
  }

  // =====================================================
  // CREATE POPUP CONTENT
  // =====================================================

  createPopupContent(feature, layerName, isHover = false) {
    if (!feature || !feature.properties) {
      return `
                <div class="popup-content">
                    Tidak ada informasi tersedia.
                </div>
            `;
    }

    const props = feature.properties;

    // =====================================================
    // HEADER
    // =====================================================

    let content = `

            <div class="popup-header">
                ${this.getLayerDisplayName(layerName)}
            </div>
            <div class="popup-content">
        `;

    // =====================================================
    // BATAS DESA
    // =====================================================

    if (layerName === "batasdesa") {
      content += this.createRow("Desa", props.namobj);

      content += this.createRow("Kecamatan", props.wadmkc);

      content += this.createRow("Kabupaten", props.wadmkk);

      content += this.createRow("Provinsi", props.wadmpr);
    }

    // =====================================================
    // BATAS DUSUN
    // =====================================================
    else if (layerName === "batasdusun") {
      content += this.createRow("Dusun", props.NAMA);
    }

    // =====================================================
    // BATAS RT
    // =====================================================
    else if (layerName === "batasrt") {
      const rt = this.findValue(props, ["RT", "rt", "NAMA_RT", "Nama_RT"]);

      const dusun = this.findValue(props, [
        "DUSUN",
        "Dusun",
        "NAMA_DUSUN",
        "Nama_Dusun",
      ]);

      if (rt) {
        content += this.createRow("RT", rt);
      }

      if (dusun) {
        content += this.createRow("Dusun", dusun);
      }
    }

    // =====================================================
    // PERIBADATAN
    // =====================================================
    else if (layerName === "peribadatan") {
      const jenis = this.findValue(props, [
        "Jenis",
        "JENIS",
        "Jenis_Fas",
        "Fungsi",
        "Fungsi_Ban",
        "Kelas",
        "Kelas_Fas",
      ]);
      const nama = props.Nama;

      // Kategori fasilitas
      if (jenis) {
        content += this.createRow("Jenis", jenis);
      }

      // Nama tetap dari field Nama
      if (nama) {
        content += this.createRow("Nama", nama);
      }
    }

    // =====================================================
    // UMKM
    // =====================================================
    else if (layerName === "umkm") {
      content += this.createRow("Nama Usaha", props.nama_usaha);

      content += this.createRow("Kelas", props.kelas);
    }

    // =====================================================
    // PJU
    // =====================================================
    else if (layerName === "pju") {
      content += this.createRow("ID Lampu", props.ID_Lampu);

      content += this.createRow("Kondisi", props.Kondisi);
    }

    // =====================================================
    // MINIM PENERANGAN
    // =====================================================
    else if (layerName === "minim_penerangan") {
      if (props.Nama) {
        content += this.createRow("Nama", props.Nama);
      }

      if (props.Status) {
        content += this.createRow("Status", props.Status);
      }
    }

    // =====================================================
    // SUNGAI
    // =====================================================
    else if (layerName === "sungai") {
      content += `
                <div
                    style="
                        margin: 6px 0;
                        line-height: 1.4;
                    "
                >
                    Sungai
                </div>
            `;
    }

    // =====================================================
    // REL KERETA API
    // =====================================================
    else if (layerName === "relkereta") {
      content += this.createRow("Keterangan", props.Remark);
    }

    // =====================================================
    // LAYER DENGAN FIELD NAMA
    // =====================================================
    else if (
      [
        "pemerintahan",
        "pendidikan",
        "lapangan",
        "tpu",
        "sppg",
        "kopdes",
        "industri",
        "situsbudaya",
        "sumbor",
      ].includes(layerName)
    ) {
      content += this.createRow("Nama", props.Nama);
    }

    // =====================================================
    // JARINGAN JALAN
    // =====================================================
    else if (layerName === "jaringanjalan") {
      content += this.createRow("Nama Jalan", props.Nama);
    }

    // =====================================================
    // DEFAULT
    // =====================================================
    else {
      const keys = Object.keys(props);

      keys.forEach((key) => {
        if (
          props[key] !== null &&
          props[key] !== undefined &&
          props[key] !== ""
        ) {
          content += this.createRow(this.getFieldLabel(key), props[key]);
        }
      });
    }

    content += "</div>";

    return content;
  }

  // =====================================================
  // FIND VALUE
  // =====================================================

  findValue(props, fields) {
    for (const field of fields) {
      if (
        props[field] !== undefined &&
        props[field] !== null &&
        String(props[field]).trim() !== ""
      ) {
        return props[field];
      }
    }
    return null;
  }

  // =====================================================
  // CREATE ROW
  // =====================================================

  createRow(label, value) {
    if (value === undefined || value === null || String(value).trim() === "") {
      return "";
    }

    return `
        <div
            style="
                margin: 6px 0;
                line-height: 1.4;
            "
        >
            <span
                class="popup-label"
                style="
                    display: inline-block;
                    margin-right: 8px;
                "
            >${label}:</span><span>${value}</span>
        </div>
    `;
  }

  // =====================================================
  // FIELD LABEL
  // =====================================================

  getFieldLabel(field) {
    return this.fieldLabels[field] || field.replace(/_/g, " ");
  }
}

// =========================================================
// INITIALIZE
// =========================================================
const popupHandler = new PopupHandler();
