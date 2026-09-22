document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".side-link");
    const sections = document.querySelectorAll(".task-section");

    function showSection(id) {
        sections.forEach(function (section) {
            section.classList.toggle("active", section.id === id);
        });
        links.forEach(function (link) {
            link.classList.toggle("active", link.dataset.target === id);
        });
    }

    links.forEach(function (link) {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const id = link.dataset.target;
            showSection(id);
            history.pushState(null, "", "#" + id);
        });
    });

    // Respects a direct link like school.html#hw1 (e.g. from the "read more" link),
    // otherwise defaults to the first section.
    const requestedId = window.location.hash.replace("#", "");
    const initialId = document.getElementById(requestedId) ? requestedId : "guest-speakers";
    showSection(initialId);

    // Click-to-enlarge lightbox for any image with the "zoom" class
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    document.querySelectorAll(".zoom").forEach(function (img) {
        img.addEventListener("click", function () {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add("active");
        });
    });

    lightbox.addEventListener("click", function () {
        lightbox.classList.remove("active");
    });
});