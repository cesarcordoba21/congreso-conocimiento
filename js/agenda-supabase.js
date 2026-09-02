// ==========================================
// AGENDA + SUPABASE
// ==========================================

const AGENDA_SUPABASE_URL =
    "https://fwbxdywcccsbtjihycit.supabase.co";

const AGENDA_SUPABASE_KEY =
    "sb_publishable_nscW8XOQobXfS_uXUyCSQw_cF_XHFXN";


const agendaSupabase =
    window.supabase.createClient(
        AGENDA_SUPABASE_URL,
        AGENDA_SUPABASE_KEY
    );


// ==========================================
// OBTENER REGISTRO LOCAL
// ==========================================

function getAgendaRegistration() {

    const savedRegistration =
        localStorage.getItem(
            "congresoRegistration"
        );

    if (!savedRegistration) {
        return null;
    }

    try {

        return JSON.parse(
            savedRegistration
        );

    } catch (error) {

        console.error(
            "No se pudo leer el registro:",
            error
        );

        return null;

    }

}


// ==========================================
// OBTENER AGENDA LOCAL
// ==========================================

function getLocalAgendaForSupabase() {

    const savedAgenda =
        localStorage.getItem(
            "congresoAgenda"
        );

    if (!savedAgenda) {
        return [];
    }

    try {

        const agenda =
            JSON.parse(savedAgenda);

        return Array.isArray(agenda)
            ? agenda
            : [];

    } catch (error) {

        console.error(
            "No se pudo leer la agenda:",
            error
        );

        return [];

    }

}


// ==========================================
// AGREGAR CONFERENCIA A SUPABASE
// ==========================================

async function saveConferenceInSupabase(
    conferenceId
) {

    const attendee =
        getAgendaRegistration();


    // Si todavía no está registrado,
    // se conserva solamente en localStorage.
    // Al registrarse se sincronizará.

    if (
        !attendee ||
        !attendee.folio
    ) {

        console.log(
            "Agenda guardada localmente. Se sincronizará al registrarse."
        );

        return;

    }


    try {

        const {
            error
        } =
            await agendaSupabase
                .from(
                    "agenda_asistentes"
                )
                .upsert(
                    {
                        folio:
                            attendee.folio,

                        conferencia_id:
                            conferenceId
                    },
                    {
                        onConflict:
                            "folio,conferencia_id",

                        ignoreDuplicates:
                            true
                    }
                );


        if (error) {

            console.error(
                "Error guardando agenda en Supabase:",
                error
            );

            return;

        }


        console.log(
            "Conferencia guardada:",
            conferenceId
        );


    } catch (error) {

        console.error(
            "Error inesperado guardando agenda:",
            error
        );

    }

}


// ==========================================
// ELIMINAR CONFERENCIA DE SUPABASE
// ==========================================

async function removeConferenceFromSupabase(
    conferenceId
) {

    const attendee =
        getAgendaRegistration();


    if (
        !attendee ||
        !attendee.folio
    ) {

        return;

    }


    try {

        const {
            error
        } =
            await agendaSupabase
                .from(
                    "agenda_asistentes"
                )
                .delete()
                .eq(
                    "folio",
                    attendee.folio
                )
                .eq(
                    "conferencia_id",
                    conferenceId
                );


        if (error) {

            console.error(
                "Error eliminando conferencia de Supabase:",
                error
            );

            return;

        }


        console.log(
            "Conferencia eliminada:",
            conferenceId
        );


    } catch (error) {

        console.error(
            "Error inesperado eliminando agenda:",
            error
        );

    }

}


// ==========================================
// SINCRONIZAR AGENDA COMPLETA
// ==========================================

async function syncAgendaWithSupabase() {

    const attendee =
        getAgendaRegistration();


    if (
        !attendee ||
        !attendee.folio
    ) {

        return;

    }


    const agenda =
        getLocalAgendaForSupabase();


    if (
        agenda.length === 0
    ) {

        return;

    }


    const rows =
        agenda.map(
            conferenceId => {

                return {

                    folio:
                        attendee.folio,

                    conferencia_id:
                        conferenceId

                };

            }
        );


    try {

        const {
            error
        } =
            await agendaSupabase
                .from(
                    "agenda_asistentes"
                )
                .upsert(
                    rows,
                    {
                        onConflict:
                            "folio,conferencia_id",

                        ignoreDuplicates:
                            true
                    }
                );


        if (error) {

            console.error(
                "Error sincronizando agenda:",
                error
            );

            return;

        }


        console.log(
            "Agenda sincronizada con Supabase."
        );


    } catch (error) {

        console.error(
            "Error inesperado sincronizando agenda:",
            error
        );

    }

}


// ==========================================
// DETECTAR BOTONES DEL PROGRAMA
// ==========================================

const supabaseAgendaButtons =
    document.querySelectorAll(
        ".agenda-add-button"
    );


supabaseAgendaButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",

            function () {

                const conferenceId =
                    button.dataset.conference;


                // Esperamos a que script.js
                // actualice primero localStorage.

                setTimeout(
                    function () {

                        const agenda =
                            getLocalAgendaForSupabase();


                        if (
                            agenda.includes(
                                conferenceId
                            )
                        ) {

                            saveConferenceInSupabase(
                                conferenceId
                            );

                        } else {

                            removeConferenceFromSupabase(
                                conferenceId
                            );

                        }

                    },
                    50
                );

            }
        );

    }
);


// ==========================================
// DETECTAR ELIMINACIÓN DESDE agenda.html
// ==========================================

document.addEventListener(
    "click",

    function (event) {

        const removeButton =
            event.target.closest(
                ".agenda-remove-button"
            );


        if (!removeButton) {
            return;
        }


        const conferenceId =
            removeButton.dataset.remove;


        setTimeout(
            function () {

                removeConferenceFromSupabase(
                    conferenceId
                );

            },
            50
        );

    }
);


// ==========================================
// SINCRONIZAR AL ABRIR LA PÁGINA
// ==========================================

syncAgendaWithSupabase();