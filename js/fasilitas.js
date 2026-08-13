/* =====================================================
   FASILITAS.JS
   Desa Kliwonan
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    console.log("=================================");
    console.log("FASILITAS.JS BERJALAN");
    console.log("=================================");

    /* =================================================
       ELEMENT HTML
    ================================================= */

    const countPju =
        document.getElementById("count-pju");

    const countPeribadatan =
        document.getElementById("count-peribadatan");

    const countSejarah =
        document.getElementById("count-sejarah");

    /* =================================================
       CEK ELEMENT HTML
    ================================================= */

    console.log("Element PJU:", countPju);
    console.log("Element Peribadatan:", countPeribadatan);
    console.log("Element Sejarah:", countSejarah);


    /* =================================================
       LOKASI FILE GEOJSON
    ================================================= */

    const DATA = {
        pju: "data/pju.geojson",
        peribadatan: "data/peribadatan.geojson",
        sejarah: "data/situsbudaya.geojson"
    };


    /* =================================================
       FUNGSI LOAD GEOJSON
    ================================================= */

    async function loadGeoJSON(url) {

        console.log("Memuat file:", url);

        try {

            const response = await fetch(url);

            console.log(
                `Response ${url}:`,
                response.status,
                response.statusText
            );

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status} - ${url}`
                );

            }

            const data = await response.json();

            console.log(
                `Berhasil membaca ${url}:`,
                data
            );

            return data;

        } catch (error) {

            console.error(
                `GAGAL MEMUAT ${url}:`,
                error
            );

            return null;
        }
    }


    /* =================================================
       HITUNG FEATURE GEOJSON
    ================================================= */

    function getFeatureCount(data) {

        if (!data) {

            console.warn(
                "Data kosong / gagal dimuat."
            );

            return 0;

        }

        /* ---------------------------------------------
           FORMAT GEOJSON NORMAL
        --------------------------------------------- */

        if (
            data.type === "FeatureCollection" &&
            Array.isArray(data.features)
        ) {

            return data.features.length;

        }

        /* ---------------------------------------------
           JIKA DATA LANGSUNG ARRAY
        --------------------------------------------- */

        if (Array.isArray(data)) {
            return data.length;
        }


        /* ---------------------------------------------
           FALLBACK
        --------------------------------------------- */
        if (Array.isArray(data.features)) {

            return data.features.length;
        }

        console.warn(
            "Format GeoJSON tidak dikenali:",
            data
        );
        return 0;

    }

    /* =================================================
       TAMPILKAN ANGKA
    ================================================= */

    function setNumber(element, value) {

        if (!element) {
            console.warn(
                "Element HTML tidak ditemukan."
            );
            return;

        }

        element.textContent = value;
    }

    /* =================================================
       LOAD SEMUA DATA
    ================================================= */
    async function loadAllData() {

        console.log("---------------------------------");
        console.log("MULAI MEMUAT DATA FASILITAS");
        console.log("---------------------------------");

        const [
            pjuData,
            peribadatanData,
            sejarahData
        ] = await Promise.all([
            loadGeoJSON(DATA.pju),
            loadGeoJSON(DATA.peribadatan),
            loadGeoJSON(DATA.sejarah)
        ]);

        /* =================================================
           HITUNG JUMLAH
        ================================================= */
        const jumlahPju =
            getFeatureCount(pjuData);

        const jumlahPeribadatan =
            getFeatureCount(peribadatanData);

        const jumlahSejarah =
            getFeatureCount(sejarahData);

        /* ================================================
           TAMPILKAN ANGKA
        ================================================= */
        setNumber(
            countPju,
            jumlahPju
        );

        setNumber(
            countPeribadatan,
            jumlahPeribadatan
        );

        setNumber(
            countSejarah,
            jumlahSejarah
        );

        /* =================================================
           DEBUG PJU
        ================================================= */

        console.log("---------------------------------");

        console.log(
            "Jumlah PJU:",
            jumlahPju
        );

        console.log(
            "Jumlah Peribadatan:",
            jumlahPeribadatan
        );

        console.log(
            "Jumlah Sejarah:",
            jumlahSejarah
        );

        console.log("---------------------------------");

        /* =================================================
           DEBUG DETAIL PJU
        ================================================= */

        if (pjuData) {

            console.log(
                "Tipe data PJU:",
                pjuData.type
            );

            console.log(
                "Features PJU:",
                pjuData.features
            );

            if (
                Array.isArray(
                    pjuData.features
                )
            ) {

                console.log(
                    "Feature PJU pertama:",
                    pjuData.features[0]
                );
            }
        }
    }

    /* =================================================
       JALANKAN
    ================================================= */

    loadAllData()
        .catch(error => {

            console.error(
                "KESALAHAN LOAD DATA:",
                error
            );

            setNumber(
                countPju,
                0
            );

            setNumber(
                countPeribadatan,
                0
            );

            setNumber(
                countSejarah,
                0
            );
        });
});