// ==========================================
// MENÚ MÓVIL
// ==========================================

const botonMenu = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

if (botonMenu && menu) {

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

}


// ==========================================
// FILTROS DEL PROGRAMA
// ==========================================

const filterButtons =
    document.querySelectorAll(".filter-button");

const programItems =
    document.querySelectorAll(".program-item");


if (
    filterButtons.length > 0 &&
    programItems.length > 0
) {

    filterButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const selectedDay =
                button.dataset.day;


            filterButtons.forEach(function (btn) {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            programItems.forEach(function (item) {

                if (
                    selectedDay === "all" ||
                    item.dataset.day === selectedDay
                ) {

                    item.style.display = "grid";

                } else {

                    item.style.display = "none";

                }

            });

        });

    });

}


// ==========================================
// REGISTRO DEL ASISTENTE
// ==========================================

const registrationForm =
    document.querySelector("#registration-form");

const nameInput =
    document.querySelector("#name");

const emailInput =
    document.querySelector("#email");

const organizationInput =
    document.querySelector("#organization");

const positionInput =
    document.querySelector("#position");

const formMessage =
    document.querySelector("#form-message");


// ==========================================
// GENERAR FOLIO
// ==========================================

function generateFolio() {

    const randomNumber =
        Math.floor(1000 + Math.random() * 9000);

    return "CN-2026-" + randomNumber;

}


// ==========================================
// CARGAR Y GUARDAR REGISTRO
// ==========================================

if (
    registrationForm &&
    nameInput &&
    emailInput &&
    organizationInput &&
    positionInput
) {

    // Revisar si ya existe un registro

    const existingRegistration =
        localStorage.getItem("congresoRegistration");


    if (existingRegistration) {

        try {

            const attendee =
                JSON.parse(existingRegistration);


            nameInput.value =
                attendee.name || "";

            emailInput.value =
                attendee.email || "";

            organizationInput.value =
                attendee.organization || "";

            positionInput.value =
                attendee.position || "";


        } catch (error) {

            console.log(
                "No se pudo cargar el registro."
            );

        }

    }


    // ======================================
    // ENVIAR FORMULARIO
    // ======================================

    registrationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                nameInput.value.trim();

            const email =
                emailInput.value.trim();

            const organization =
                organizationInput.value.trim();

            const position =
                positionInput.value.trim();


            // Validación

            if (
                name === "" ||
                email === "" ||
                organization === "" ||
                position === ""
            ) {

                if (formMessage) {

                    formMessage.textContent =
                        "Completa todos los campos.";

                }

                return;

            }


            // ==================================
            // CONSERVAR FOLIO SI YA EXISTE
            // ==================================

            let folio =
                generateFolio();


            const oldRegistration =
                localStorage.getItem(
                    "congresoRegistration"
                );


            if (oldRegistration) {

                try {

                    const oldAttendee =
                        JSON.parse(oldRegistration);


                    if (oldAttendee.folio) {

                        folio =
                            oldAttendee.folio;

                    }


                } catch (error) {

                    console.log(
                        "Se generará un nuevo folio."
                    );

                }

            }


            // ==================================
            // CREAR ASISTENTE
            // ==================================

            const attendee = {

                name: name,

                email: email,

                organization: organization,

                position: position,

                folio: folio,

                registeredAt:
                    new Date().toISOString()

            };


            // ==================================
            // GUARDAR EN LOCALSTORAGE
            // ==================================

            localStorage.setItem(
                "congresoRegistration",
                JSON.stringify(attendee)
            );


            if (formMessage) {

                formMessage.textContent =
                    "¡Registro completado! Generando tu pase...";

            }


            // ==================================
            // IR AL PASE
            // ==================================

            setTimeout(
                function () {

                    window.location.href =
                        "pase.html";

                },
                800
            );

        }
    );

}


// ==========================================
// PASE DIGITAL
// ==========================================

const digitalPass =
    document.querySelector("#digital-pass");

const noRegistration =
    document.querySelector("#pass-no-registration");

const passName =
    document.querySelector("#pass-name");

const passOrganization =
    document.querySelector("#pass-organization");

const passPosition =
    document.querySelector("#pass-position");

const passFolio =
    document.querySelector("#pass-folio");

const passQR =
    document.querySelector("#pass-qr");

const printPassButton =
    document.querySelector("#print-pass");

const passActions =
    document.querySelector(".pass-actions");


// ==========================================
// CARGAR DATOS DEL PASE
// ==========================================

if (digitalPass && noRegistration) {

    const savedRegistration =
        localStorage.getItem(
            "congresoRegistration"
        );


    // ======================================
    // NO HAY REGISTRO
    // ======================================

    if (!savedRegistration) {

        digitalPass.style.display = "none";

        noRegistration.style.display = "block";


        if (passActions) {

            passActions.style.display = "none";

        }

    }


    // ======================================
    // SÍ HAY REGISTRO
    // ======================================

    else {

        let attendee = null;


        // ==================================
        // LEER REGISTRO
        // ==================================

        try {

            attendee =
                JSON.parse(savedRegistration);

        } catch (error) {

            console.error(
                "Error al leer el registro:",
                error
            );

        }


        // ==================================
        // REGISTRO VÁLIDO
        // ==================================

        if (attendee) {


            // NOMBRE

            if (passName) {

                passName.textContent =
                    attendee.name || "—";

            }


            // ORGANIZACIÓN

            if (passOrganization) {

                passOrganization.textContent =
                    attendee.organization || "—";

            }


            // CARGO / CARRERA

            if (passPosition) {

                passPosition.textContent =
                    attendee.position || "—";

            }


            // FOLIO

            if (passFolio) {

                passFolio.textContent =
                    attendee.folio || "—";

            }


            // MOSTRAR PASE

            digitalPass.style.display = "block";

            noRegistration.style.display = "none";


            if (passActions) {

                passActions.style.display = "flex";

            }


            // ==================================
            // GENERAR QR
            // ==================================

            if (
                passQR &&
                typeof QRCode !== "undefined"
            ) {

                try {

                    // Limpiamos QR anterior

                    passQR.innerHTML = "";


                    // ==================================
                    // CONTENIDO DEL QR
                    // ==================================
                    //
                    // Guardamos únicamente el folio.
                    // Así evitamos que el QR sea demasiado
                    // grande y después podremos usarlo
                    // para validar el acceso.
                    // ==================================

                    const qrData =
                        "CN2026:" +
                        attendee.folio;


                    // ==================================
                    // CREAR QR
                    // ==================================

                    new QRCode(
                        passQR,
                        {

                            text: qrData,

                            width: 110,

                            height: 110,

                            colorDark:
                                "#111111",

                            colorLight:
                                "#ffffff",

                            correctLevel:
                                QRCode.CorrectLevel.M

                        }
                    );


                } catch (qrError) {

                    console.error(
                        "Error al generar el QR:",
                        qrError
                    );


                    // Aunque falle el QR,
                    // NO desaparecemos el pase.

                    passQR.innerHTML =
                        "<span style='color:#111;font-size:10px;text-align:center;'>QR no disponible</span>";

                }

            }


            // ==================================
            // QRCode NO CARGÓ
            // ==================================

            else if (passQR) {

                console.error(
                    "La librería QRCode no está disponible."
                );

                passQR.innerHTML =
                    "<span style='color:#111;font-size:10px;text-align:center;'>QR no disponible</span>";

            }

        }


        // ==================================
        // REGISTRO DAÑADO
        // ==================================

        else {

            digitalPass.style.display = "none";

            noRegistration.style.display = "block";


            if (passActions) {

                passActions.style.display = "none";

            }

        }

    }

}


// ==========================================
// IMPRIMIR / GUARDAR COMO PDF
// ==========================================

if (printPassButton) {

    printPassButton.addEventListener(
        "click",
        function () {

            window.print();

        }
    );

}


// ==========================================
// ANIMACIONES AL HACER SCROLL
// ==========================================

const revealElements =
    document.querySelectorAll(".reveal");


if (revealElements.length > 0) {

    const revealObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (entry.isIntersecting) {

                            entry.target.classList.add(
                                "visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.15
            }
        );


    revealElements.forEach(
        function (element) {

            revealObserver.observe(element);

        }
    );

}


// ==========================================
// BASE DE DATOS DE PONENTES
// ==========================================

const speakers = {


    // ======================================
    // DANIEL
    // ======================================

    daniel: {

        name:
            "Daniel Torres",

        specialty:
            "Innovación y Tecnología",

        image:
            "images/speaker-1.jpg",

        biography: [

            "Daniel Torres es especialista en innovación, tecnología y transformación digital.",

            "Su trabajo se enfoca en analizar cómo las nuevas tecnologías pueden transformar empresas, industrias y la manera en que las personas desarrollan nuevas ideas.",

            "Durante el Congreso Nacional de Conocimiento compartirá experiencias, tendencias y estrategias para comprender el impacto de la tecnología en los próximos años."

        ],

        conference: {

            title:
                "Innovación que transforma industrias.",

            date:
                "10 Septiembre 2026",

            time:
                "11:30 AM",

            room:
                "Sala Innovación"

        },

        programLink:
            "programa.html#daniel-conference"

    },


    // ======================================
    // SOFÍA
    // ======================================

    sofia: {

        name:
            "Sofía Ramírez",

        specialty:
            "Inteligencia Artificial",

        image:
            "images/speaker-2.jpg",

        biography: [

            "Sofía Ramírez es especialista en inteligencia artificial y tecnologías emergentes.",

            "Su trabajo explora cómo la inteligencia artificial está cambiando la manera en que las organizaciones analizan información, automatizan procesos y toman decisiones.",

            "Durante el congreso hablará sobre las oportunidades y desafíos que presenta la inteligencia artificial para las nuevas generaciones."

        ],

        conference: {

            title:
                "El futuro de la inteligencia artificial.",

            date:
                "10 Septiembre 2026",

            time:
                "1:00 PM",

            room:
                "Sala Futuro"

        },

        programLink:
            "programa.html#sofia-conference"

    },


    // ======================================
    // ANDREA
    // ======================================

    andrea: {

        name:
            "Andrea Vega",

        specialty:
            "Emprendimiento",

        image:
            "images/speaker-3.jpg",

        biography: [

            "Andrea Vega es emprendedora y especialista en desarrollo de nuevos modelos de negocio.",

            "Ha trabajado en proyectos enfocados en innovación, crecimiento empresarial y creación de nuevas oportunidades.",

            "En su conferencia compartirá herramientas para transformar una idea en un proyecto capaz de generar impacto."

        ],

        conference: {

            title:
                "De una idea a una empresa.",

            date:
                "11 Septiembre 2026",

            time:
                "10:00 AM",

            room:
                "Sala Emprendimiento"

        },

        programLink:
            "programa.html#andrea-conference"

    },


    // ======================================
    // CARLOS
    // ======================================

    carlos: {

        name:
            "Carlos Mendoza",

        specialty:
            "Transformación Digital",

        image:
            "images/speaker-1.jpg",

        biography: [

            "Carlos Mendoza trabaja en proyectos relacionados con transformación digital y estrategia tecnológica.",

            "Su experiencia se centra en ayudar a organizaciones a incorporar tecnología para mejorar procesos y crear nuevas experiencias.",

            "Durante el congreso analizará las claves para adaptarse a un entorno cada vez más digital."

        ],

        conference: {

            title:
                "Transformar empresas en la era digital.",

            date:
                "11 Septiembre 2026",

            time:
                "12:00 PM",

            room:
                "Sala Tecnología"

        },

        programLink:
            "programa.html#carlos-conference"

    },


    // ======================================
    // MARIANA
    // ======================================

    mariana: {

        name:
            "Mariana López",

        specialty:
            "Liderazgo y Estrategia",

        image:
            "images/speaker-2.jpg",

        biography: [

            "Mariana López es especialista en liderazgo, estrategia y desarrollo de equipos.",

            "Su trabajo se enfoca en construir organizaciones capaces de adaptarse, colaborar y desarrollar nuevas capacidades.",

            "En su participación compartirá estrategias para liderar equipos en escenarios de cambio."

        ],

        conference: {

            title:
                "Liderazgo para tiempos de cambio.",

            date:
                "12 Septiembre 2026",

            time:
                "10:30 AM",

            room:
                "Sala Liderazgo"

        },

        programLink:
            "programa.html#mariana-conference"

    },


    // ======================================
    // VALERIA
    // ======================================

    valeria: {

        name:
            "Valeria Sánchez",

        specialty:
            "Negocios y Creatividad",

        image:
            "images/speaker-3.jpg",

        biography: [

            "Valeria Sánchez combina estrategia de negocios, creatividad e innovación.",

            "Ha participado en proyectos donde las ideas creativas se convierten en nuevas experiencias, productos y oportunidades.",

            "Durante su conferencia explicará por qué la creatividad se ha convertido en una habilidad estratégica para los negocios."

        ],

        conference: {

            title:
                "Creatividad que genera oportunidades.",

            date:
                "12 Septiembre 2026",

            time:
                "1:00 PM",

            room:
                "Sala Creatividad"

        },

        programLink:
            "programa.html#valeria-conference"

    }

};


// ==========================================
// PÁGINA DINÁMICA DEL PONENTE
// ==========================================

const speakerName =
    document.querySelector("#speaker-name");


if (speakerName) {

    // Obtener ?id= de la URL

    const params =
        new URLSearchParams(
            window.location.search
        );


    const speakerId =
        params.get("id");


    const speaker =
        speakers[speakerId];


    // ======================================
    // SI EXISTE EL PONENTE
    // ======================================

    if (speaker) {


        const speakerImage =
            document.querySelector(
                "#speaker-profile-image"
            );


        const speakerSpecialty =
            document.querySelector(
                "#speaker-specialty"
            );


        const speakerBiography =
            document.querySelector(
                "#speaker-biography"
            );


        const conferenceTitle =
            document.querySelector(
                "#conference-title"
            );


        const conferenceDate =
            document.querySelector(
                "#conference-date"
            );


        const conferenceTime =
            document.querySelector(
                "#conference-time"
            );


        const conferenceRoom =
            document.querySelector(
                "#conference-room"
            );


        const speakerProgramLink =
            document.querySelector(
                "#speaker-program-link"
            );


        // NOMBRE

        speakerName.textContent =
            speaker.name;


        // ESPECIALIDAD

        if (speakerSpecialty) {

            speakerSpecialty.textContent =
                speaker.specialty;

        }


        // IMAGEN

        if (speakerImage) {

            speakerImage.src =
                speaker.image;

            speakerImage.alt =
                speaker.name;

        }


        // BIOGRAFÍA

        if (speakerBiography) {

            speakerBiography.innerHTML = "";


            speaker.biography.forEach(
                function (paragraph) {

                    const p =
                        document.createElement("p");


                    p.textContent =
                        paragraph;


                    speakerBiography.appendChild(p);

                }
            );

        }


        // CONFERENCIA

        if (conferenceTitle) {

            conferenceTitle.textContent =
                speaker.conference.title;

        }


        if (conferenceDate) {

            conferenceDate.textContent =
                speaker.conference.date;

        }


        if (conferenceTime) {

            conferenceTime.textContent =
                speaker.conference.time;

        }


        if (conferenceRoom) {

            conferenceRoom.textContent =
                speaker.conference.room;

        }


        // ENLACE AL PROGRAMA

        if (
            speakerProgramLink &&
            speaker.programLink
        ) {

            speakerProgramLink.href =
                speaker.programLink;

        }


        // TÍTULO DE LA PESTAÑA

        document.title =
            speaker.name +
            " | Congreso de Conocimiento";


    } else {


        // ==================================
        // PONENTE NO ENCONTRADO
        // ==================================

        speakerName.textContent =
            "Ponente no encontrado";


        const speakerSpecialty =
            document.querySelector(
                "#speaker-specialty"
            );


        if (speakerSpecialty) {

            speakerSpecialty.textContent =
                "Regresa a la página de ponentes.";

        }

    }

}


// ==========================================
// BASE DE DATOS DE CONFERENCIAS
// ==========================================

const conferences = {


    daniel: {

        id:
            "daniel",

        day:
            "10 SEPTIEMBRE",

        time:
            "11:30",

        title:
            "Innovación que transforma industrias",

        speaker:
            "Daniel Torres",

        room:
            "Sala Innovación",

        speakerId:
            "daniel"

    },


    sofia: {

        id:
            "sofia",

        day:
            "10 SEPTIEMBRE",

        time:
            "13:00",

        title:
            "El futuro de la inteligencia artificial",

        speaker:
            "Sofía Ramírez",

        room:
            "Sala Futuro",

        speakerId:
            "sofia"

    },


    andrea: {

        id:
            "andrea",

        day:
            "11 SEPTIEMBRE",

        time:
            "10:00",

        title:
            "De una idea a una empresa",

        speaker:
            "Andrea Vega",

        room:
            "Sala Emprendimiento",

        speakerId:
            "andrea"

    },


    carlos: {

        id:
            "carlos",

        day:
            "11 SEPTIEMBRE",

        time:
            "12:00",

        title:
            "Transformar empresas en la era digital",

        speaker:
            "Carlos Mendoza",

        room:
            "Sala Tecnología",

        speakerId:
            "carlos"

    },


    mariana: {

        id:
            "mariana",

        day:
            "12 SEPTIEMBRE",

        time:
            "10:30",

        title:
            "Liderazgo para tiempos de cambio",

        speaker:
            "Mariana López",

        room:
            "Sala Liderazgo",

        speakerId:
            "mariana"

    },


    valeria: {

        id:
            "valeria",

        day:
            "12 SEPTIEMBRE",

        time:
            "13:00",

        title:
            "Creatividad que genera oportunidades",

        speaker:
            "Valeria Sánchez",

        room:
            "Sala Creatividad",

        speakerId:
            "valeria"

    }

};


// ==========================================
// OBTENER AGENDA
// ==========================================

function getAgenda() {

    const savedAgenda =
        localStorage.getItem(
            "congresoAgenda"
        );


    if (!savedAgenda) {

        return [];

    }


    try {

        const parsedAgenda =
            JSON.parse(savedAgenda);


        if (Array.isArray(parsedAgenda)) {

            return parsedAgenda;

        }


        return [];


    } catch (error) {

        return [];

    }

}


// ==========================================
// GUARDAR AGENDA
// ==========================================

function saveAgenda(agenda) {

    localStorage.setItem(
        "congresoAgenda",
        JSON.stringify(agenda)
    );


    updateAgendaCount();

    updateAgendaButtons();

}


// ==========================================
// AGREGAR CONFERENCIA
// ==========================================

function addConferenceToAgenda(
    conferenceId
) {

    const agenda =
        getAgenda();


    if (!agenda.includes(conferenceId)) {

        agenda.push(conferenceId);

        saveAgenda(agenda);

    }

}


// ==========================================
// ELIMINAR CONFERENCIA
// ==========================================

function removeConferenceFromAgenda(
    conferenceId
) {

    const agenda =
        getAgenda();


    const newAgenda =
        agenda.filter(
            function (id) {

                return id !== conferenceId;

            }
        );


    saveAgenda(newAgenda);

    renderAgenda();

}


// ==========================================
// ACTUALIZAR CONTADOR
// ==========================================

function updateAgendaCount() {

    const agenda =
        getAgenda();


    const counters =
        document.querySelectorAll(
            ".agenda-count"
        );


    counters.forEach(function (counter) {

        counter.textContent =
            agenda.length;

    });

}


// ==========================================
// ACTUALIZAR BOTONES DEL PROGRAMA
// ==========================================

function updateAgendaButtons() {

    const agenda =
        getAgenda();


    const buttons =
        document.querySelectorAll(
            ".agenda-add-button"
        );


    buttons.forEach(function (button) {

        const conferenceId =
            button.dataset.conference;


        if (agenda.includes(conferenceId)) {

            button.textContent =
                "✓ Agregada a mi agenda";

            button.classList.add(
                "added"
            );


        } else {

            button.textContent =
                "+ Agregar a mi agenda";

            button.classList.remove(
                "added"
            );

        }

    });

}


// ==========================================
// BOTONES AGREGAR A LA AGENDA
// ==========================================

const agendaButtons =
    document.querySelectorAll(
        ".agenda-add-button"
    );


agendaButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const conferenceId =
                button.dataset.conference;


            const agenda =
                getAgenda();


            // Si ya existe, eliminar

            if (
                agenda.includes(
                    conferenceId
                )
            ) {

                removeConferenceFromAgenda(
                    conferenceId
                );

            }


            // Si no existe, agregar

            else {

                addConferenceToAgenda(
                    conferenceId
                );

            }

        }
    );

});


// ==========================================
// MOSTRAR MI AGENDA
// ==========================================

function renderAgenda() {

    const agendaList =
        document.querySelector(
            "#agenda-list"
        );


    const agendaEmpty =
        document.querySelector(
            "#agenda-empty"
        );


    // Solo ejecutar en agenda.html

    if (
        !agendaList ||
        !agendaEmpty
    ) {

        return;

    }


    const agenda =
        getAgenda();


    agendaList.innerHTML = "";


    // ======================================
    // AGENDA VACÍA
    // ======================================

    if (agenda.length === 0) {

        agendaEmpty.style.display =
            "block";

        return;

    }


    agendaEmpty.style.display =
        "none";


    // ======================================
    // CREAR CONFERENCIAS
    // ======================================

    agenda.forEach(
        function (
            conferenceId,
            index
        ) {

            const conference =
                conferences[conferenceId];


            if (!conference) {

                return;

            }


            const article =
                document.createElement(
                    "article"
                );


            article.classList.add(
                "agenda-item"
            );


            article.innerHTML = `

                <div class="agenda-item-number">

                    ${String(index + 1).padStart(2, "0")}

                </div>


                <div class="agenda-item-date">

                    <span>
                        ${conference.day}
                    </span>

                    <strong>
                        ${conference.time}
                    </strong>

                </div>


                <div class="agenda-item-info">

                    <h3>
                        ${conference.title}
                    </h3>

                    <p>

                        <a
                            href="ponente.html?id=${conference.speakerId}"
                        >
                            ${conference.speaker}
                        </a>

                        · ${conference.room}

                    </p>

                </div>


                <div class="agenda-item-actions">

                    <a
                        href="programa.html#${conference.id}-conference"
                        class="agenda-view-link"
                    >
                        Ver
                    </a>


                    <button
                        type="button"
                        class="agenda-remove-button"
                        data-remove="${conference.id}"
                    >
                        Eliminar
                    </button>

                </div>

            `;


            agendaList.appendChild(
                article
            );

        }
    );


    // ======================================
    // BOTONES ELIMINAR
    // ======================================

    const removeButtons =
        document.querySelectorAll(
            ".agenda-remove-button"
        );


    removeButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const conferenceId =
                        button.dataset.remove;


                    removeConferenceFromAgenda(
                        conferenceId
                    );

                }
            );

        }
    );

}


// ==========================================
// INICIAR AGENDA
// ==========================================

updateAgendaCount();

updateAgendaButtons();

renderAgenda();