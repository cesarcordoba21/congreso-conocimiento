// ==========================================
// SUPABASE - CONGRESO DE CONOCIMIENTO
// ==========================================

const SUPABASE_URL =
    "https://fwbxdywcccsbtjihycit.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_nscW8XOQobXfS_uXUyCSQw_cF_XHFXN";


// ==========================================
// CREAR CLIENTE DE SUPABASE
// ==========================================

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// ==========================================
// ELEMENTOS DEL FORMULARIO
// ==========================================

const registrationFormSupabase =
    document.querySelector("#registration-form");

const formMessageSupabase =
    document.querySelector("#form-message");


// ==========================================
// GENERAR FOLIO
// ==========================================

function generateFolio() {

    const randomNumber =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return `CN-2026-${randomNumber}`;

}


// ==========================================
// MOSTRAR MENSAJE
// ==========================================

function showRegistrationMessage(
    message,
    type = "success"
) {

    if (!formMessageSupabase) {
        return;
    }

    formMessageSupabase.textContent =
        message;

    if (type === "error") {

        formMessageSupabase.style.color =
            "#c62828";

    } else {

        formMessageSupabase.style.color =
            "#1b5e20";

    }

}


// ==========================================
// REGISTRO
// ==========================================

if (registrationFormSupabase) {

    registrationFormSupabase.addEventListener(
        "submit",

        async function (event) {

            // Evita que el formulario recargue la página
            event.preventDefault();

            // Evita que el listener viejo de script.js
            // procese nuevamente el formulario
            event.stopImmediatePropagation();


            // ==================================
            // OBTENER CAMPOS
            // ==================================

            const nameInput =
                document.querySelector("#name");

            const emailInput =
                document.querySelector("#email");

            const organizationInput =
                document.querySelector("#organization");

            const positionInput =
                document.querySelector("#position");

            const ageInput =
                document.querySelector("#age");

            const cityInput =
                document.querySelector("#city");

            const stateInput =
                document.querySelector("#state");

            const attendeeTypeInput =
                document.querySelector("#attendee-type");

            const sourceInput =
                document.querySelector("#source");


            // ==================================
            // OBTENER VALORES
            // ==================================

            const name =
                nameInput?.value.trim();

            const email =
                emailInput?.value
                    .trim()
                    .toLowerCase();

            const organization =
                organizationInput?.value.trim();

            const position =
                positionInput?.value.trim();

            const age =
                ageInput?.value
                    ? Number(ageInput.value)
                    : null;

            const city =
                cityInput?.value.trim();

            const state =
                stateInput?.value.trim();

            const attendeeType =
                attendeeTypeInput?.value;

            const source =
                sourceInput?.value;


            // ==================================
            // VALIDACIONES
            // ==================================

            if (
                !name ||
                !email ||
                !organization ||
                !position ||
                !age ||
                !city ||
                !state ||
                !attendeeType ||
                !source
            ) {

                showRegistrationMessage(
                    "Por favor completa todos los campos.",
                    "error"
                );

                return;

            }


            if (
                age < 15 ||
                age > 100
            ) {

                showRegistrationMessage(
                    "Ingresa una edad válida.",
                    "error"
                );

                return;

            }


            // ==================================
            // BOTÓN
            // ==================================

            const submitButton =
                registrationFormSupabase
                    .querySelector(
                        'button[type="submit"]'
                    );

            const originalButtonText =
                submitButton
                    ? submitButton.textContent
                    : "";


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Registrando...";

            }


            showRegistrationMessage(
                "Guardando tu registro..."
            );


            // ==================================
            // GENERAR FOLIO
            // ==================================

            const folio =
                generateFolio();


            // ==================================
            // DATOS PARA SUPABASE
            // ==================================

            const attendeeData = {

                nombre:
                    name,

                email:
                    email,

                organizacion:
                    organization,

                cargo:
                    position,

                edad:
                    age,

                ciudad:
                    city,

                estado:
                    state,

                tipo_asistente:
                    attendeeType,

                como_se_entero:
                    source,

                folio:
                    folio

            };


            // ==================================
            // INSERTAR EN SUPABASE
            // ==================================

            try {

                const {
                    error
                } =
                    await supabaseClient
                        .from("asistentes")
                        .insert([
                            attendeeData
                        ]);


                // ==================================
                // ERROR
                // ==================================

                if (error) {

                    console.error(
                        "Error de Supabase:",
                        error
                    );


                    // Email duplicado

                    if (
                        error.code === "23505"
                    ) {

                        showRegistrationMessage(
                            "Este correo ya está registrado.",
                            "error"
                        );

                    } else {

                        showRegistrationMessage(
                            "No se pudo completar el registro. Intenta nuevamente.",
                            "error"
                        );

                    }


                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalButtonText;

                    }

                    return;

                }


                // ==================================
                // GUARDAR TAMBIÉN EN LOCALSTORAGE
                // ==================================
                //
                // Esto permite que pase.html siga
                // mostrando el pase del asistente.
                // ==================================

                const localRegistration = {

                    name:
                        name,

                    email:
                        email,

                    organization:
                        organization,

                    position:
                        position,

                    age:
                        age,

                    city:
                        city,

                    state:
                        state,

                    attendeeType:
                        attendeeType,

                    source:
                        source,

                    folio:
                        folio,

                    registeredAt:
                        new Date()
                            .toISOString()

                };


                localStorage.setItem(
                    "congresoRegistration",
                    JSON.stringify(
                        localRegistration
                    )
                );

// ==========================================
// SINCRONIZAR AGENDA PREVIA
// ==========================================

const savedAgenda =
    localStorage.getItem(
        "congresoAgenda"
    );


if (savedAgenda) {

    try {

        const agenda =
            JSON.parse(
                savedAgenda
            );


        if (
            Array.isArray(agenda) &&
            agenda.length > 0
        ) {

            const agendaRows =
                agenda.map(
                    conferenceId => {

                        return {

                            folio:
                                folio,

                            conferencia_id:
                                conferenceId

                        };

                    }
                );


            const {
                error: agendaError
            } =
                await supabaseClient
                    .from(
                        "agenda_asistentes"
                    )
                    .upsert(
                        agendaRows,
                        {
                            onConflict:
                                "folio,conferencia_id",

                            ignoreDuplicates:
                                true
                        }
                    );


            if (agendaError) {

                console.error(
                    "Error sincronizando agenda:",
                    agendaError
                );

            } else {

                console.log(
                    "Agenda sincronizada correctamente."
                );

            }

        }


    } catch (error) {

        console.error(
            "No se pudo sincronizar la agenda:",
            error
        );

    }

}


                // ==================================
                // MENSAJE EXITOSO
                // ==================================

                showRegistrationMessage(
                    "Registro completado. Generando tu pase..."
                );


                // ==================================
                // IR AL PASE
                // ==================================

                setTimeout(
                    function () {

                        window.location.href =
                            "pase.html";

                    },
                    900
                );


            } catch (error) {

                console.error(
                    "Error inesperado:",
                    error
                );


                showRegistrationMessage(
                    "Ocurrió un error de conexión. Intenta nuevamente.",
                    "error"
                );


                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        originalButtonText;

                }

            }

        },

        // MUY IMPORTANTE:
        // Ejecutamos este listener antes
        // que el listener viejo.
        true
    );

}