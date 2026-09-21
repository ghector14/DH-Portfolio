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


    const requestedId = window.location.hash.replace("#", "");
    const initialId = document.getElementById(requestedId) ? requestedId : "guest-speakers";
    showSection(initialId);
});