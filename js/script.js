const botonMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

botonMenu.addEventListener("click", function () {

    menu.classList.toggle("activo");

    if (menu.classList.contains("activo")) {
        botonMenu.textContent = "✕";
    } else {
        botonMenu.textContent = "☰";
    }
});

const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        menu.classList.remove("activo");
        botonMenu.textContent = "☰";


    });

});

const filterButtons = document.querySelectorAll(".filter-button");
const programItems = document.querySelectorAll(".program-item");

filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const selectedDay = button.dataset.day;

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        programItems.forEach(function (item) {

            if (selectedDay === "all" || item.dataset.day === selectedDay) {
                item.style.display = "grid";
            } else {
                item.style.display = "none";
            }

        });

    });

});

const registrationForm = document.querySelector("#registration-form");
const nameInput = document.querySelector("#name");
const emailInput = document.querySelector("#email");
const formMessage = document.querySelector("#form-message");

registrationForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (name === "" || email === "") {

        formMessage.textContent = "Completa todos los campos.";

        return;
    }

    formMessage.textContent = "Registro enviado correctamente.";

    registrationForm.reset();

});

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(function (entries) {

    entries.forEach(function (entry) {

        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }

    });

}, {
    threshold: 0.15
});

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});