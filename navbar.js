document.addEventListener("DOMContentLoaded", async () => {

    const navbarContainer = document.getElementById("navbar-container");

    if (!navbarContainer) {
        return;
    }

    try {

        const response = await fetch("components/navbar.html");

        if (!response.ok) {
            throw new Error("Navbar tidak ditemukan.");
        }

        const navbar = await response.text();

        navbarContainer.innerHTML = navbar;

        const currentPage =
            window.location.pathname.split("/").pop() || "index.html";

        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach((link) => {

            const linkPage = link.getAttribute("href");

            if (linkPage === currentPage) {
                link.classList.add("active");
            }

        });

    } catch (error) {

        console.error("Gagal memuat navbar:", error);

    }

});