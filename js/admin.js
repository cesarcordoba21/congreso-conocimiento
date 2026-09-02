// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://fwbxdywcccsbtjihycit.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_nscW8XOQobXfS_uXUyCSQw_cF_XHFXN";


const dashboardSupabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );



// ==========================================
// VARIABLES
// ==========================================

let conferenceChart = null;

let allAttendees = [];

let filteredAttendees = [];

let typeChart = null;

let sourceChart = null;

let cityChart = null;

let dateChart = null;

async function loadAgendaMetrics() {

    const {
        data,
        error
    } = await dashboardSupabase
        .from("agenda_asistentes")
        .select("*");


    if (error) {

        console.error(
            "Error cargando agenda:",
            error
        );

        return;
    }


    const agendas = data || [];


    // ==========================================
    // TOTAL DE SELECCIONES
    // ==========================================

    const totalSelections =
        agendas.length;

    document.getElementById(
        "metric-agenda-total"
    ).textContent =
        totalSelections;


    // ==========================================
    // CONTAR CONFERENCIAS
    // ==========================================

    const conferenceCounts = {};


    agendas.forEach(item => {

        const id =
            item.conferencia_id;

        conferenceCounts[id] =
            (conferenceCounts[id] || 0) + 1;

    });


    // ==========================================
    // CONFERENCIA MÁS POPULAR
    // ==========================================

    let mostPopularId = null;

    let mostPopularCount = 0;


    Object.entries(
        conferenceCounts
    ).forEach(
        ([id, count]) => {

            if (
                count >
                mostPopularCount
            ) {

                mostPopularCount =
                    count;

                mostPopularId =
                    id;

            }

        }
    );


    const conferenceMetric =
        document.getElementById(
            "metric-conference"
        );


    const speakerMetric =
        document.getElementById(
            "metric-speaker"
        );


    if (
        mostPopularId &&
        conferenceData[
            mostPopularId
        ]
    ) {

        conferenceMetric.textContent =
            conferenceData[
                mostPopularId
            ].conference;

        speakerMetric.textContent =
            conferenceData[
                mostPopularId
            ].speaker;

    } else {

        conferenceMetric.textContent =
            "Sin datos";

        speakerMetric.textContent =
            "Sin datos";

    }


    // ==========================================
    // PROMEDIO DE CONFERENCIAS
    // POR ASISTENTE
    // ==========================================

    const uniqueFolios =
        new Set(
            agendas.map(
                item =>
                    item.folio
            )
        );


    const attendeeCount =
        uniqueFolios.size;


    const average =
        attendeeCount > 0
            ? (
                totalSelections /
                attendeeCount
            ).toFixed(1)
            : "0";


    document.getElementById(
        "metric-agenda-average"
    ).textContent =
        average;


    // ==========================================
    // GRÁFICA
    // ==========================================

    const conferenceIds =
        Object.keys(
            conferenceData
        );


    const labels =
        conferenceIds.map(
            id =>
                conferenceData[
                    id
                ].speaker
        );


    const values =
        conferenceIds.map(
            id =>
                conferenceCounts[
                    id
                ] || 0
        );


    const canvas =
        document.getElementById(
            "chart-conferences"
        );


    if (!canvas) {
        return;
    }


    if (conferenceChart) {

        conferenceChart.destroy();

    }


    conferenceChart =
        new Chart(
            canvas,
            {

                type: "bar",

                data: {

                    labels: labels,

                    datasets: [
                        {
                            label:
                                "Agregados a agenda",

                            data:
                                values
                        }
                    ]

                },

                options: {

                    responsive: true,
                    maintainAspectRatio: false,

                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    },

                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            }

                        }

                    }

                }

            }
        );

}

const conferenceData = {

    daniel: {
        speaker: "Daniel Torres",
        conference: "Innovación que transforma industrias"
    },

    sofia: {
        speaker: "Sofía Ramírez",
        conference: "El futuro de la inteligencia artificial"
    },

    andrea: {
        speaker: "Andrea Vega",
        conference: "De una idea a una empresa"
    },

    carlos: {
        speaker: "Carlos Mendoza",
        conference: "Transformar empresas en la era digital"
    },

    mariana: {
        speaker: "Mariana López",
        conference: "Liderazgo para tiempos de cambio"
    },

    valeria: {
        speaker: "Valeria Sánchez",
        conference: "Creatividad que genera oportunidades"
    }

};

// ==========================================
// ELEMENTOS
// ==========================================

const metricTotal =
    document.querySelector(
        "#metric-total"
    );


const metricAge =
    document.querySelector(
        "#metric-age"
    );


const metricType =
    document.querySelector(
        "#metric-type"
    );


const metricCity =
    document.querySelector(
        "#metric-city"
    );


const metricSource =
    document.querySelector(
        "#metric-source"
    );


const tableBody =
    document.querySelector(
        "#admin-table-body"
    );


const searchInput =
    document.querySelector(
        "#admin-search"
    );


const logoutButton =
    document.querySelector(
        "#admin-logout"
    );


const exportButton =
    document.querySelector(
        "#export-csv"
    );


const adminUser =
    document.querySelector(
        "#admin-user"
    );


const adminStatus =
    document.querySelector(
        "#admin-status"
    );


const resultsCount =
    document.querySelector(
        "#admin-results-count"
    );



// ==========================================
// VERIFICAR SESIÓN
// ==========================================

async function checkAdminSession() {

    const {
        data,
        error
    } =
        await dashboardSupabase.auth
            .getSession();


    if (error) {

        console.error(
            "Error comprobando sesión:",
            error
        );

        window.location.href =
            "admin-login.html";

        return false;

    }


    if (!data.session) {

        window.location.href =
            "admin-login.html";

        return false;

    }


    // Mostrar correo del administrador

    if (adminUser) {

        adminUser.textContent =
            `Sesión: ${data.session.user.email}`;

    }


    return true;

}



// ==========================================
// CARGAR ASISTENTES
// ==========================================

async function loadAttendees() {

    showStatus(
        "Cargando registros..."
    );


    const {
        data,
        error
    } =
        await dashboardSupabase
            .from(
                "asistentes"
            )
            .select("*")
            .order(
                "fecha_registro",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Error al cargar asistentes:",
            error
        );


        showStatus(
            "No se pudieron cargar los registros.",
            true
        );


        return;

    }


    allAttendees =
        data || [];


    filteredAttendees =
        [...allAttendees];


    // Métricas

    calculateMetrics(
        allAttendees
    );


    // Gráficas

    createCharts(
        allAttendees
    );


    // Tabla

    renderTable(
        filteredAttendees
    );


    hideStatus();

}



// ==========================================
// MÉTRICAS
// ==========================================

function calculateMetrics(
    attendees
) {

    const total =
        attendees.length;


    // TOTAL

    if (metricTotal) {

        metricTotal.textContent =
            total;

    }



    // ==================================
    // EDAD PROMEDIO
    // ==================================

    const validAges =
        attendees
            .map(
                attendee =>
                    Number(
                        attendee.edad
                    )
            )
            .filter(
                age =>
                    Number.isFinite(age) &&
                    age > 0
            );


    if (
        metricAge
    ) {

        if (
            validAges.length > 0
        ) {

            const totalAge =
                validAges.reduce(
                    (
                        accumulator,
                        age
                    ) =>
                        accumulator + age,
                    0
                );


            const averageAge =
                totalAge /
                validAges.length;


            metricAge.textContent =
                averageAge.toFixed(1);

        } else {

            metricAge.textContent =
                "—";

        }

    }



    // ==================================
    // TIPO PRINCIPAL
    // ==================================

    if (
        metricType
    ) {

        metricType.textContent =
            getMostCommon(
                attendees,
                "tipo_asistente"
            );

    }



    // ==================================
    // CIUDAD PRINCIPAL
    // ==================================

    if (
        metricCity
    ) {

        metricCity.textContent =
            getMostCommon(
                attendees,
                "ciudad"
            );

    }



    // ==================================
    // FUENTE PRINCIPAL
    // ==================================

    if (
        metricSource
    ) {

        metricSource.textContent =
            getMostCommon(
                attendees,
                "como_se_entero"
            );

    }

}



// ==========================================
// OBTENER VALOR MÁS COMÚN
// ==========================================

function getMostCommon(
    data,
    property
) {

    const counts =
        {};


    data.forEach(
        item => {

            const value =
                item[property];


            if (!value) {

                return;

            }


            counts[value] =
                (
                    counts[value] ||
                    0
                ) + 1;

        }
    );


    const entries =
        Object.entries(
            counts
        );


    if (
        entries.length === 0
    ) {

        return "—";

    }


    entries.sort(
        (
            first,
            second
        ) =>
            second[1] -
            first[1]
    );


    return entries[0][0];

}



// ==========================================
// AGRUPAR DATOS
// ==========================================

function groupByProperty(
    attendees,
    property
) {

    const counts =
        {};


    attendees.forEach(
        attendee => {

            const value =
                attendee[property] ||
                "Sin especificar";


            counts[value] =
                (
                    counts[value] ||
                    0
                ) + 1;

        }
    );


    return counts;

}



// ==========================================
// CHART.JS
// ==========================================

function createCharts(
    attendees
) {

    if (
        typeof Chart ===
        "undefined"
    ) {

        console.error(
            "Chart.js no se cargó."
        );

        return;

    }


    createTypeChart(
        attendees
    );


    createSourceChart(
        attendees
    );


    createCityChart(
        attendees
    );


    createDateChart(
        attendees
    );

}



// ==========================================
// GRÁFICA TIPO DE ASISTENTE
// ==========================================

function createTypeChart(
    attendees
) {

    const canvas =
        document.querySelector(
            "#chart-type"
        );


    if (!canvas) {

        return;

    }


    const grouped =
        groupByProperty(
            attendees,
            "tipo_asistente"
        );


    const labels =
        Object.keys(
            grouped
        );


    const values =
        Object.values(
            grouped
        );


    if (
        typeChart
    ) {

        typeChart.destroy();

    }


    typeChart =
        new Chart(
            canvas,
            {

                type:
                    "doughnut",


                data: {

                    labels:
                        labels,

                    datasets: [

                        {

                            data:
                                values,

                            borderWidth:
                                2,

                            backgroundColor: [

                                "#111111",

                                "#454545",

                                "#777777",

                                "#9a9a9a",

                                "#bcbcbc",

                                "#dedede"

                            ]

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    cutout:
                        "65%",

                    plugins: {

                        legend: {

                            position:
                                "bottom",

                            labels: {

                                padding:
                                    18,

                                font: {

                                    family:
                                        "Inter",

                                    size:
                                        11

                                }

                            }

                        }

                    }

                }

            }
        );

}



// ==========================================
// GRÁFICA FUENTE
// ==========================================

function createSourceChart(
    attendees
) {

    const canvas =
        document.querySelector(
            "#chart-source"
        );


    if (!canvas) {

        return;

    }


    const grouped =
        groupByProperty(
            attendees,
            "como_se_entero"
        );


    const entries =
        Object.entries(
            grouped
        )
            .sort(
                (
                    first,
                    second
                ) =>
                    second[1] -
                    first[1]
            );


    const labels =
        entries.map(
            item =>
                item[0]
        );


    const values =
        entries.map(
            item =>
                item[1]
        );


    if (
        sourceChart
    ) {

        sourceChart.destroy();

    }


    sourceChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",


                data: {

                    labels:
                        labels,

                    datasets: [

                        {

                            label:
                                "Registros",

                            data:
                                values,

                            backgroundColor:
                                "#111111",

                            borderRadius:
                                3

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            },

                            grid: {

                                color:
                                    "#eeeeee"

                            }

                        },


                        x: {

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}



// ==========================================
// GRÁFICA CIUDADES
// ==========================================

function createCityChart(
    attendees
) {

    const canvas =
        document.querySelector(
            "#chart-city"
        );


    if (!canvas) {

        return;

    }


    const grouped =
        groupByProperty(
            attendees,
            "ciudad"
        );


    // Ordenar ciudades y mostrar las 8 principales

    const entries =
        Object.entries(
            grouped
        )
            .sort(
                (
                    first,
                    second
                ) =>
                    second[1] -
                    first[1]
            )
            .slice(
                0,
                8
            );


    const labels =
        entries.map(
            item =>
                item[0]
        );


    const values =
        entries.map(
            item =>
                item[1]
        );


    if (
        cityChart
    ) {

        cityChart.destroy();

    }


    cityChart =
        new Chart(
            canvas,
            {

                type:
                    "bar",


                data: {

                    labels:
                        labels,

                    datasets: [

                        {

                            label:
                                "Asistentes",

                            data:
                                values,

                            backgroundColor:
                                "#333333",

                            borderRadius:
                                3

                        }

                    ]

                },


                options: {

                    indexAxis:
                        "y",

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    },


                    scales: {

                        x: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            },

                            grid: {

                                color:
                                    "#eeeeee"

                            }

                        },


                        y: {

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}



// ==========================================
// GRÁFICA REGISTROS POR FECHA
// ==========================================

function createDateChart(
    attendees
) {

    const canvas =
        document.querySelector(
            "#chart-date"
        );


    if (!canvas) {

        return;

    }


    const dates =
        {};


    attendees.forEach(
        attendee => {

            if (
                !attendee.fecha_registro
            ) {

                return;

            }


            const date =
                new Date(
                    attendee.fecha_registro
                );


            const key =
                date
                    .toISOString()
                    .split("T")[0];


            dates[key] =
                (
                    dates[key] ||
                    0
                ) + 1;

        }
    );


    const sortedDates =
        Object.keys(
            dates
        )
            .sort();


    const labels =
        sortedDates.map(
            dateString => {

                const [
                    year,
                    month,
                    day
                ] =
                    dateString
                        .split("-");


                return `${day}/${month}/${year}`;

            }
        );


    const values =
        sortedDates.map(
            date =>
                dates[date]
        );


    if (
        dateChart
    ) {

        dateChart.destroy();

    }


    dateChart =
        new Chart(
            canvas,
            {

                type:
                    "line",


                data: {

                    labels:
                        labels,

                    datasets: [

                        {

                            label:
                                "Registros",

                            data:
                                values,

                            borderColor:
                                "#111111",

                            backgroundColor:
                                "rgba(17,17,17,0.08)",

                            fill:
                                true,

                            tension:
                                0.3,

                            pointRadius:
                                4,

                            pointBackgroundColor:
                                "#111111",

                            borderWidth:
                                2

                        }

                    ]

                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    plugins: {

                        legend: {

                            display:
                                false

                        }

                    },


                    scales: {

                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                precision:
                                    0

                            },

                            grid: {

                                color:
                                    "#eeeeee"

                            }

                        },


                        x: {

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}



// ==========================================
// RENDERIZAR TABLA
// ==========================================

function renderTable(
    attendees
) {

    if (
        !tableBody
    ) {

        return;

    }


    tableBody.innerHTML =
        "";


    if (
        resultsCount
    ) {

        resultsCount.textContent =
            `${attendees.length} ${
                attendees.length === 1
                    ? "registro"
                    : "registros"
            }`;

    }


    if (
        attendees.length === 0
    ) {

        const row =
            document.createElement(
                "tr"
            );


        row.innerHTML = `

            <td
                colspan="11"
                class="admin-empty-table"
            >

                No se encontraron registros.

            </td>

        `;


        tableBody.appendChild(
            row
        );


        return;

    }


    attendees.forEach(
        attendee => {

            const row =
                document.createElement(
                    "tr"
                );


            const formattedDate =
                formatDate(
                    attendee.fecha_registro
                );


            row.innerHTML = `

                <td>
                    <strong>
                        ${escapeHTML(
                            attendee.nombre
                        )}
                    </strong>
                </td>


                <td>
                    ${escapeHTML(
                        attendee.email
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        attendee.organizacion
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        attendee.cargo
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        attendee.edad
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        attendee.ciudad
                    )}
                </td>


                <td>
                    ${escapeHTML(
                        attendee.estado
                    )}
                </td>


                <td>

                    <span class="admin-tag">

                        ${escapeHTML(
                            attendee.tipo_asistente
                        )}

                    </span>

                </td>


                <td>
                    ${escapeHTML(
                        attendee.como_se_entero
                    )}
                </td>


                <td>

                    <span class="admin-folio">

                        ${escapeHTML(
                            attendee.folio
                        )}

                    </span>

                </td>


                <td>
                    ${escapeHTML(
                        formattedDate
                    )}
                </td>

            `;


            tableBody.appendChild(
                row
            );

        }
    );

}



// ==========================================
// FECHA
// ==========================================

function formatDate(
    dateValue
) {

    if (
        !dateValue
    ) {

        return "—";

    }


    const date =
        new Date(
            dateValue
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleString(
        "es-MX",
        {

            day:
                "2-digit",

            month:
                "2-digit",

            year:
                "numeric",

            hour:
                "2-digit",

            minute:
                "2-digit"

        }
    );

}



// ==========================================
// BUSCADOR
// ==========================================

if (
    searchInput
) {

    searchInput.addEventListener(
        "input",

        function () {

            const search =
                searchInput
                    .value
                    .trim()
                    .toLowerCase();


            if (
                !search
            ) {

                filteredAttendees =
                    [...allAttendees];


                renderTable(
                    filteredAttendees
                );


                return;

            }


            filteredAttendees =
                allAttendees.filter(
                    attendee => {

                        const searchableText =
                            [

                                attendee.nombre,

                                attendee.email,

                                attendee.organizacion,

                                attendee.cargo,

                                attendee.edad,

                                attendee.ciudad,

                                attendee.estado,

                                attendee.tipo_asistente,

                                attendee.como_se_entero,

                                attendee.folio

                            ]
                                .filter(
                                    value =>
                                        value !== null &&
                                        value !== undefined
                                )
                                .join(" ")
                                .toLowerCase();


                        return searchableText.includes(
                            search
                        );

                    }
                );


            renderTable(
                filteredAttendees
            );

        }
    );

}



// ==========================================
// EXPORTAR CSV
// ==========================================

if (
    exportButton
) {

    exportButton.addEventListener(
        "click",

        function () {

            if (
                allAttendees.length === 0
            ) {

                alert(
                    "No hay registros para exportar."
                );


                return;

            }


            const headers =
                [

                    "ID",

                    "Nombre",

                    "Email",

                    "Organización",

                    "Cargo / Carrera",

                    "Edad",

                    "Ciudad",

                    "Estado",

                    "Tipo de asistente",

                    "Cómo se enteró",

                    "Folio",

                    "Fecha de registro"

                ];



            const rows =
                allAttendees.map(
                    attendee => [

                        attendee.id,

                        attendee.nombre,

                        attendee.email,

                        attendee.organizacion,

                        attendee.cargo,

                        attendee.edad,

                        attendee.ciudad,

                        attendee.estado,

                        attendee.tipo_asistente,

                        attendee.como_se_entero,

                        attendee.folio,

                        formatDate(
                            attendee.fecha_registro
                        )

                    ]
                );



            const csv =
                [

                    headers,

                    ...rows

                ]
                    .map(
                        row =>
                            row
                                .map(
                                    csvEscape
                                )
                                .join(",")
                    )
                    .join("\n");



// BOM para que Excel reconozca
// correctamente acentos y ñ

            const csvWithBom =
                "\uFEFF" +
                csv;



            const blob =
                new Blob(
                    [
                        csvWithBom
                    ],
                    {

                        type:
                            "text/csv;charset=utf-8;"

                    }
                );



            const url =
                URL.createObjectURL(
                    blob
                );



            const link =
                document.createElement(
                    "a"
                );


            link.href =
                url;


            link.download =
                `asistentes-congreso-2026-${getTodayFileName()}.csv`;


            document.body.appendChild(
                link
            );


            link.click();


            document.body.removeChild(
                link
            );


            URL.revokeObjectURL(
                url
            );

        }
    );

}



// ==========================================
// CSV ESCAPE
// ==========================================

function csvEscape(
    value
) {

    const safeValue =
        String(
            value ?? ""
        )
            .replace(
                /"/g,
                '""'
            );


    return `"${safeValue}"`;

}



// ==========================================
// NOMBRE FECHA ARCHIVO
// ==========================================

function getTodayFileName() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        )
            .padStart(
                2,
                "0"
            );


    const day =
        String(
            date.getDate()
        )
            .padStart(
                2,
                "0"
            );


    return `${year}-${month}-${day}`;

}



// ==========================================
// CERRAR SESIÓN
// ==========================================

if (
    logoutButton
) {

    logoutButton.addEventListener(
        "click",

        async function () {

            const {
                error
            } =
                await dashboardSupabase.auth
                    .signOut();


            if (
                error
            ) {

                console.error(
                    "Error cerrando sesión:",
                    error
                );


                return;

            }


            window.location.href =
                "admin-login.html";

        }
    );

}



// ==========================================
// ESCAPAR HTML
// ==========================================

function escapeHTML(
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "—";

    }


    return String(
        value
    )
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



// ==========================================
// ESTADO
// ==========================================

function showStatus(
    message,
    isError = false
) {

    if (
        !adminStatus
    ) {

        return;

    }


    adminStatus.textContent =
        message;


    adminStatus.style.display =
        "block";


    adminStatus.classList.toggle(
        "admin-status-error",
        isError
    );

}



function hideStatus() {

    if (
        adminStatus
    ) {

        adminStatus.style.display =
            "none";

    }

}



// ==========================================
// INICIALIZAR
// ==========================================

async function initializeAdmin() {

    const hasSession =
        await checkAdminSession();


    if (
        !hasSession
    ) {

        return;

    }


    await loadAttendees();
    await loadAgendaMetrics();

}



initializeAdmin();