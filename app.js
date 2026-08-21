/* =====================================================
   HEALTH OS
   Sistema pessoal de gerenciamento de saúde
===================================================== */


/* =====================================================
   ESPECIALIDADES
===================================================== */

const specialties = [

    {
        id: "cardiologia",
        name: "Cardiologia",
        icon: "❤️"
    },

    {
        id: "gastroenterologia",
        name: "Gastroenterologia",
        icon: "🩺"
    },

    {
        id: "oftalmologia",
        name: "Oftalmologia",
        icon: "👁️"
    },

    {
        id: "infectologia",
        name: "Infectologia",
        icon: "🦠"
    },

    {
        id: "endocrinologia",
        name: "Endocrinologia",
        icon: "🧬"
    },

    {
        id: "dermatologia",
        name: "Dermatologia",
        icon: "✨"
    },

    {
        id: "ortopedia",
        name: "Ortopedia",
        icon: "🦴"
    },

    {
        id: "neurologia",
        name: "Neurologia",
        icon: "🧠"
    },

    {
        id: "ginecologia",
        name: "Ginecologia",
        icon: "🌸"
    },

    {
        id: "urologia",
        name: "Urologia",
        icon: "💧"
    },

    {
        id: "otorrinolaringologia",
        name: "Otorrinolaringologia",
        icon: "👂"
    },

    {
        id: "pneumologia",
        name: "Pneumologia",
        icon: "🫁"
    },

    {
        id: "nefrologia",
        name: "Nefrologia",
        icon: "🫘"
    },

    {
        id: "reumatologia",
        name: "Reumatologia",
        icon: "🦵"
    },

    {
        id: "psiquiatria",
        name: "Psiquiatria",
        icon: "💬"
    },

    {
        id: "clinica-geral",
        name: "Clínica Geral",
        icon: "➕"
    },

    {
        id: "odontologia",
        name: "Odontologia",
        icon: "🦷"
    }

];


/* =====================================================
   BANCO LOCAL
===================================================== */

let appointments =
    JSON.parse(
        localStorage.getItem("healthAppointments")
    ) || [];


let exams =
    JSON.parse(
        localStorage.getItem("healthExams")
    ) || [];


let bloodResults =
    JSON.parse(
        localStorage.getItem("healthBloodResults")
    ) || [];


let healthNotes =
    JSON.parse(
        localStorage.getItem("healthNotes")
    ) || {};


let currentSpecialty = null;


/* =====================================================
   INICIALIZAÇÃO
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        buildSpecialtyMenu();

        updateAppointmentSpecialtySelect();

        renderDashboard();

        renderAgenda();

        renderBloodResults();

        startCountdowns();

    }
);


/* =====================================================
   MENU LATERAL
===================================================== */

function buildSpecialtyMenu() {

    const menu =
        document.getElementById(
            "specialtyMenu"
        );

    menu.innerHTML = "";


    specialties.forEach(
        specialty => {

            const button =
                document.createElement(
                    "button"
                );

            button.className =
                "menu-item";

            button.innerHTML = `
                <span>
                    ${specialty.icon}
                </span>

                <span>
                    ${specialty.name}
                </span>
            `;

            button.onclick =
                function () {

                    openSpecialty(
                        specialty.id
                    );

                };


            menu.appendChild(button);

        }
    );

}


/* =====================================================
   NAVEGAÇÃO
===================================================== */

function showPage(pageId) {

    document
        .querySelectorAll(".page")
        .forEach(
            page => {

                page.classList.remove(
                    "active-page"
                );

            }
        );


    const page =
        document.getElementById(
            pageId
        );


    if (page) {

        page.classList.add(
            "active-page"
        );

    }


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );


    if (pageId === "dashboard") {

        renderDashboard();

    }


    if (pageId === "agenda") {

        renderAgenda();

    }


    if (pageId === "sangue") {

        renderBloodResults();

    }

}


/* =====================================================
   ABRIR ESPECIALIDADE
===================================================== */

function openSpecialty(id) {

    currentSpecialty = id;


    showPage(
        "specialtyPage"
    );


    const specialty =
        getSpecialty(id);


    if (!specialty) return;


    document.getElementById(
        "specialtyTitle"
    ).innerHTML =
        `${specialty.icon} ${specialty.name}`;


    document.getElementById(
        "specialtyDescription"
    ).textContent =
        "Histórico, exames, consultas e acompanhamento.";


    renderSpecialty();

}


/* =====================================================
   BUSCAR ESPECIALIDADE
===================================================== */

function getSpecialty(id) {

    return specialties.find(
        specialty =>
            specialty.id === id
    );

}


/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboard() {

    document.getElementById(
        "totalSpecialties"
    ).textContent =
        specialties.length;


    const futureAppointments =
        appointments.filter(
            appointment =>
                new Date(
                    appointment.date
                ) >= new Date()
        );


    document.getElementById(
        "totalAppointments"
    ).textContent =
        futureAppointments.length;


    document.getElementById(
        "totalExams"
    ).textContent =
        exams.length;


    const sorted =
        [...appointments]
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    const past =
        sorted.filter(
            appointment =>
                new Date(
                    appointment.date
                ) < new Date()
        );


    if (past.length) {

        document.getElementById(
            "lastVisit"
        ).textContent =
            formatDate(
                past[past.length - 1].date
            );

    }


    renderUpcomingAppointments();

    renderSpecialtyDashboard();

}


/* =====================================================
   PRÓXIMAS CONSULTAS
===================================================== */

function renderUpcomingAppointments() {

    const container =
        document.getElementById(
            "upcomingAppointments"
        );


    const future =
        appointments
            .filter(
                appointment =>
                    new Date(
                        appointment.date
                    ) >= new Date()
            )
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            )
            .slice(0, 5);


    if (!future.length) {

        container.innerHTML = `
            <div class="empty">
                Nenhuma consulta agendada.
            </div>
        `;

        return;

    }


    container.innerHTML =
        future.map(
            appointment => {

                const specialty =
                    getSpecialty(
                        appointment.specialty
                    );


                return `

                    <div class="appointment-item">

                        <div class="appointment-info">

                            <strong>
                                ${specialty.icon}
                                ${specialty.name}
                            </strong>

                            <span>
                                ${formatDateTime(
                                    appointment.date
                                )}
                            </span>

                            <br>

                            <span>
                                ${appointment.doctor || "Profissional não informado"}
                            </span>

                        </div>


                        <div>

                            <div class="countdown"
                                 data-date="${appointment.date}">
                            </div>

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   ESPECIALIDADES NO DASHBOARD
===================================================== */

function renderSpecialtyDashboard() {

    const container =
        document.getElementById(
            "specialtyDashboard"
        );


    container.innerHTML =
        specialties.map(
            specialty => {

                const next =
                    getNextAppointment(
                        specialty.id
                    );


                return `

                    <div
                        class="specialty-card"
                        onclick="openSpecialty('${specialty.id}')"
                    >

                        <strong>
                            ${specialty.icon}
                            ${specialty.name}
                        </strong>

                        <span>

                            ${
                                next
                                ?
                                "Próxima: " +
                                formatDate(next.date)
                                :
                                "Sem consulta agendada"
                            }

                        </span>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   AGENDA
===================================================== */

function renderAgenda() {

    const container =
        document.getElementById(
            "agendaList"
        );


    if (!appointments.length) {

        container.innerHTML = `
            <div class="empty">
                Nenhuma consulta cadastrada.
            </div>
        `;

        return;

    }


    const sorted =
        [...appointments]
            .sort(
                (a, b) =>
                    new Date(a.date) -
                    new Date(b.date)
            );


    container.innerHTML =
        sorted.map(
            appointment => {

                const specialty =
                    getSpecialty(
                        appointment.specialty
                    );


                const future =
                    new Date(
                        appointment.date
                    ) >= new Date();


                return `

                    <div class="appointment-item">

                        <div class="appointment-info">

                            <strong>
                                ${specialty.icon}
                                ${specialty.name}
                            </strong>

                            <span>
                                ${formatDateTime(
                                    appointment.date
                                )}
                            </span>

                            <br>

                            <span>
                                ${appointment.doctor || "Profissional não informado"}
                            </span>

                            <br>

                            <span>
                                ${appointment.location || ""}
                            </span>

                        </div>


                        <div>

                            ${
                                future
                                ?
                                `<div
                                    class="countdown"
                                    data-date="${appointment.date}"
                                ></div>`
                                :
                                `<span class="badge">
                                    Consulta passada
                                </span>`
                            }

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   ABRIR MODAL CONSULTA
===================================================== */

function openAppointmentModal() {

    updateAppointmentSpecialtySelect();


    if (currentSpecialty) {

        document.getElementById(
            "appointmentSpecialty"
        ).value =
            currentSpecialty;

    }


    document
        .getElementById(
            "appointmentModal"
        )
        .classList.add(
            "open"
        );

}


/* =====================================================
   SELECT DE ESPECIALIDADES
===================================================== */

function updateAppointmentSpecialtySelect() {

    const select =
        document.getElementById(
            "appointmentSpecialty"
        );


    select.innerHTML =
        specialties.map(
            specialty => `

                <option
                    value="${specialty.id}"
                >
                    ${specialty.icon}
                    ${specialty.name}
                </option>

            `
        ).join("");

}


/* =====================================================
   SALVAR CONSULTA
===================================================== */

function saveAppointment(event) {

    event.preventDefault();


    const appointment = {

        id:
            Date.now(),

        specialty:
            document.getElementById(
                "appointmentSpecialty"
            ).value,

        date:
            document.getElementById(
                "appointmentDate"
            ).value,

        doctor:
            document.getElementById(
                "appointmentDoctor"
            ).value,

        location:
            document.getElementById(
                "appointmentLocation"
            ).value,

        notes:
            document.getElementById(
                "appointmentNotes"
            ).value

    };


    appointments.push(
        appointment
    );


    saveData();


    closeModal(
        "appointmentModal"
    );


    document
        .getElementById(
            "appointmentForm"
        )
        .reset();


    renderDashboard();

    renderAgenda();


    if (currentSpecialty) {

        renderSpecialty();

    }


    alert(
        "Consulta cadastrada com sucesso!"
    );

}


/* =====================================================
   ESPECIALIDADE
===================================================== */

function renderSpecialty() {

    if (!currentSpecialty) return;


    const specialty =
        getSpecialty(
            currentSpecialty
        );


    const next =
        getNextAppointment(
            currentSpecialty
        );


    const specialtyAppointments =
        appointments.filter(
            appointment =>
                appointment.specialty ===
                currentSpecialty
        );


    const specialtyExams =
        exams.filter(
            exam =>
                exam.specialty ===
                currentSpecialty
        );


    /* Última visita */

    const past =
        specialtyAppointments
            .filter(
                appointment =>
                    new Date(
                        appointment.date
                    ) < new Date()
            )
            .sort(
                (a, b) =>
                    new Date(b.date) -
                    new Date(a.date)
            );


    document.getElementById(
        "specialtyLastVisit"
    ).textContent =
        past.length
        ?
        formatDate(
            past[0].date
        )
        :
        "—";


    /* Próxima */

    document.getElementById(
        "specialtyNext"
    ).textContent =
        next
        ?
        formatDate(
            next.date
        )
        :
        "—";


    /* Contador */

    document.getElementById(
        "specialtyCountdown"
    ).textContent =
        next
        ?
        getDaysRemaining(
            next.date
        )
        :
        "—";


    /* Exames */

    document.getElementById(
        "specialtyExamCount"
    ).textContent =
        specialtyExams.length;


    /* Anotações */

    const notes =
        healthNotes[
            currentSpecialty
        ] || {};


    document.getElementById(
        "improvement"
    ).value =
        notes.improvement || "";


    document.getElementById(
        "actions"
    ).value =
        notes.actions || "";


    document.getElementById(
        "medications"
    ).value =
        notes.medications || "";


    renderSpecialtyAppointment(
        next
    );


    renderSpecialtyAppointments(
        specialtyAppointments
    );


    renderSpecialtyExams(
        specialtyExams
    );

}


/* =====================================================
   PRÓXIMA CONSULTA
===================================================== */

function getNextAppointment(
    specialtyId
) {

    return appointments
        .filter(
            appointment =>
                appointment.specialty ===
                specialtyId &&
                new Date(
                    appointment.date
                ) >= new Date()
        )
        .sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        )[0];

}


/* =====================================================
   BOX PRÓXIMA CONSULTA
===================================================== */

function renderSpecialtyAppointment(
    appointment
) {

    const container =
        document.getElementById(
            "specialtyAppointment"
        );


    if (!appointment) {

        container.innerHTML = `
            <div class="empty">
                Nenhuma consulta futura.
            </div>
        `;

        return;

    }


    container.innerHTML = `

        <span>
            Próxima consulta
        </span>

        <div class="big">
            ${formatDate(
                appointment.date
            )}
        </div>

        <strong>
            ${formatTime(
                appointment.date
            )}
        </strong>

        <p>
            ${appointment.doctor || "Profissional não informado"}
        </p>

        <div
            class="countdown"
            data-date="${appointment.date}"
        ></div>

    `;

}


/* =====================================================
   HISTÓRICO DE CONSULTAS
===================================================== */

function renderSpecialtyAppointments(
    items
) {

    const container =
        document.getElementById(
            "specialtyAppointments"
        );


    if (!items.length) {

        container.innerHTML = `
            <div class="empty">
                Nenhuma consulta registrada.
            </div>
        `;

        return;

    }


    const sorted =
        [...items].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Data
                    </th>

                    <th>
                        Médico
                    </th>

                    <th>
                        Local
                    </th>

                    <th>
                        Status
                    </th>

                    <th>
                        Observações
                    </th>

                </tr>

            </thead>


            <tbody>

                ${sorted.map(
                    appointment => `

                    <tr>

                        <td>
                            ${formatDateTime(
                                appointment.date
                            )}
                        </td>

                        <td>
                            ${appointment.doctor || "—"}
                        </td>

                        <td>
                            ${appointment.location || "—"}
                        </td>

                        <td>

                            <span class="badge">

                                ${
                                    new Date(
                                        appointment.date
                                    ) < new Date()
                                    ?
                                    "REALIZADA"
                                    :
                                    "AGENDADA"
                                }

                            </span>

                        </td>

                        <td>
                            ${appointment.notes || "—"}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;

}


/* =====================================================
   SALVAR ACOMPANHAMENTO
===================================================== */

function saveHealthNotes() {

    if (!currentSpecialty) return;


    healthNotes[
        currentSpecialty
    ] = {

        improvement:
            document.getElementById(
                "improvement"
            ).value,

        actions:
            document.getElementById(
                "actions"
            ).value,

        medications:
            document.getElementById(
                "medications"
            ).value

    };


    saveData();


    alert(
        "Acompanhamento salvo!"
    );

}


/* =====================================================
   EXAMES
===================================================== */

function openExamModal() {

    document
        .getElementById(
            "examModal"
        )
        .classList.add(
            "open"
        );

}


/* =====================================================
   SALVAR EXAME
===================================================== */

function saveExam(event) {

    event.preventDefault();


    if (!currentSpecialty) {

        alert(
            "Selecione uma especialidade."
        );

        return;

    }


    const file =
        document.getElementById(
            "examFile"
        ).files[0];


    if (file) {

        const allowedTypes = [

            "application/pdf",

            "image/png",

            "image/jpeg"

        ];


        if (
            !allowedTypes.includes(
                file.type
            )
        ) {

            alert(
                "Formato não permitido. Use PDF, PNG ou JPG."
            );

            return;

        }

    }


    const exam = {

        id:
            Date.now(),

        specialty:
            currentSpecialty,

        name:
            document.getElementById(
                "examName"
            ).value,

        date:
            document.getElementById(
                "examDate"
            ).value,

        notes:
            document.getElementById(
                "examNotes"
            ).value,

        fileName:
            file
            ?
            file.name
            :
            null

    };


    exams.push(
        exam
    );


    saveData();


    closeModal(
        "examModal"
    );


    document
        .getElementById(
            "examForm"
        )
        .reset();


    renderSpecialty();

    renderDashboard();


    alert(
        "Exame registrado com sucesso!"
    );

}


/* =====================================================
   MOSTRAR EXAMES
===================================================== */

function renderSpecialtyExams(
    items
) {

    const container =
        document.getElementById(
            "specialtyExams"
        );


    if (!items.length) {

        container.innerHTML = `
            <div class="empty">
                Nenhum exame registrado.
            </div>
        `;

        return;

    }


    const sorted =
        [...items].sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );


    container.innerHTML = `

        <table>

            <thead>

                <tr>

                    <th>
                        Exame
                    </th>

                    <th>
                        Data
                    </th>

                    <th>
                        Arquivo
                    </th>

                    <th>
                        Observações
                    </th>

                </tr>

            </thead>


            <tbody>

                ${sorted.map(
                    exam => `

                    <tr>

                        <td>
                            <strong>
                                ${exam.name}
                            </strong>
                        </td>

                        <td>
                            ${formatDate(
                                exam.date
                            )}
                        </td>

                        <td>

                            ${
                                exam.fileName
                                ?
                                `
                                <span class="badge green">
                                    📎 ${exam.fileName}
                                </span>
                                `
                                :
                                "—"
                            }

                        </td>

                        <td>
                            ${exam.notes || "—"}
                        </td>

                    </tr>

                `
                ).join("")}

            </tbody>

        </table>

    `;

}


/* =====================================================
   EXAMES DE SANGUE
===================================================== */

function openBloodModal() {

    document
        .getElementById(
            "bloodModal"
        )
        .classList.add(
            "open"
        );

}


function saveBloodResult(
    event
) {

    event.preventDefault();


    const result = {

        id:
            Date.now(),

        marker:
            document.getElementById(
                "bloodMarker"
            ).value,

        value:
            Number(
                document.getElementById(
                    "bloodValue"
                ).value
            ),

        unit:
            document.getElementById(
                "bloodUnit"
            ).value,

        date:
            document.getElementById(
                "bloodDate"
            ).value,

        min:
            Number(
                document.getElementById(
                    "bloodMin"
                ).value
            ),

        max:
            Number(
                document.getElementById(
                    "bloodMax"
                ).value
            ),

        notes:
            document.getElementById(
                "bloodNotes"
            ).value

    };


    bloodResults.push(
        result
    );


    saveData();


    closeModal(
        "bloodModal"
    );


    renderBloodResults();


    event.target.reset();


    alert(
        "Resultado salvo com sucesso!"
    );

}


/* =====================================================
   MOSTRAR RESULTADOS
===================================================== */

function renderBloodResults() {

    const container =
        document.getElementById(
            "bloodResults"
        );


    if (!container) return;


    if (!bloodResults.length) {

        container.innerHTML = `
            <div class="empty">
                Nenhum exame de sangue registrado.
            </div>
        `;

        return;

    }


    const groups = {};


    bloodResults.forEach(
        result => {

            if (
                !groups[
                    result.marker
                ]
            ) {

                groups[
                    result.marker
                ] = [];

            }


            groups[
                result.marker
            ].push(
                result
            );

        }
    );


    let html = "";


    Object.keys(
        groups
    ).forEach(
        marker => {

            const results =
                groups[marker]
                    .sort(
                        (a, b) =>
                            new Date(b.date) -
                            new Date(a.date)
                    );


            const latest =
                results[0];


            const previous =
                results[1];


            let variation =
                "Primeiro resultado";


            if (previous) {

                const difference =
                    latest.value -
                    previous.value;


                const sign =
                    difference >= 0
                    ? "+"
                    : "";


                variation =
                    `${sign}${difference.toFixed(2)} ${latest.unit || ""}`;

            }


            html += `

                <div class="card">

                    <div class="card-header">

                        <div>

                            <h2>
                                ${marker}
                            </h2>

                            <p>
                                Resultado mais recente:
                                ${latest.value}
                                ${latest.unit || ""}
                            </p>

                        </div>

                        <span class="badge green">
                            ${variation}
                        </span>

                    </div>


                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Data
                                </th>

                                <th>
                                    Resultado
                                </th>

                                <th>
                                    Referência
                                </th>

                                <th>
                                    Comparação
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            ${results.map(
                                (result, index) => {

                                    let comparison =
                                        "—";


                                    if (
                                        index === 0
                                        &&
                                        previous
                                    ) {

                                        const diff =
                                            result.value -
                                            previous.value;


                                        comparison =
                                            `${diff >= 0 ? "+" : ""}${diff.toFixed(2)}`;

                                    }


                                    return `

                                        <tr>

                                            <td>
                                                ${formatDate(
                                                    result.date
                                                )}
                                            </td>

                                            <td>

                                                <strong>
                                                    ${result.value}
                                                </strong>

                                                ${result.unit || ""}

                                            </td>

                                            <td>

                                                ${
                                                    result.min ||
                                                    result.max
                                                    ?
                                                    `${result.min || "—"} - ${result.max || "—"}`
                                                    :
                                                    "—"
                                                }

                                            </td>

                                            <td>
                                                ${comparison}
                                            </td>

                                        </tr>

                                    `;

                                }
                            ).join("")}

                        </tbody>

                    </table>

                </div>

            `;

        }
    );


    container.innerHTML =
        html;

}


/* =====================================================
   CONTADOR REGRESSIVO
===================================================== */

function startCountdowns() {

    setInterval(
        updateCountdowns,
        1000
    );

}


function updateCountdowns() {

    document
        .querySelectorAll(
            "[data-date]"
        )
        .forEach(
            element => {

                element.textContent =
                    countdown(
                        element.dataset.date
                    );

            }
        );

}


function countdown(
    date
) {

    const target =
        new Date(date).getTime();


    const now =
        new Date().getTime();


    const difference =
        target - now;


    if (
        difference <= 0
    ) {

        return "Agora";

    }


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                difference %
                (
                    1000 *
                    60 *
                    60 *
                    24
                )
            )
            /
            (
                1000 *
                60 *
                60
            )
        );


    const minutes =
        Math.floor(
            (
                difference %
                (
                    1000 *
                    60 *
                    60
                )
            )
            /
            (
                1000 *
                60
            )
        );


    const seconds =
        Math.floor(
            (
                difference %
                (
                    1000 *
                    60
                )
            )
            /
            1000
        );


    return `${days}d ${hours}h ${minutes}m ${seconds}s`;

}


/* =====================================================
   DIAS RESTANTES
===================================================== */

function getDaysRemaining(
    date
) {

    const target =
        new Date(date);


    const now =
        new Date();


    target.setHours(
        0,
        0,
        0,
        0
    );


    now.setHours(
        0,
        0,
        0,
        0
    );


    const difference =
        target - now;


    const days =
        Math.ceil(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    if (days < 0) {

        return "Consulta passada";

    }


    if (days === 0) {

        return "Hoje";

    }


    if (days === 1) {

        return "1 dia";

    }


    return `${days} dias`;

}


/* =====================================================
   DATAS
===================================================== */

function formatDate(
    date
) {

    if (!date) {

        return "—";

    }


    return new Intl.DateTimeFormat(
        "pt-BR"
    ).format(
        new Date(date)
    );

}


function formatTime(
    date
) {

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    ).format(
        new Date(date)
    );

}


function formatDateTime(
    date
) {

    return new Intl.DateTimeFormat(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    ).format(
        new Date(date)
    );

}


/* =====================================================
   MODAIS
===================================================== */

function closeModal(
    id
) {

    document
        .getElementById(
            id
        )
        .classList.remove(
            "open"
        );

}


/* =====================================================
   SALVAR LOCALSTORAGE
===================================================== */

function saveData() {

    localStorage.setItem(
        "healthAppointments",
        JSON.stringify(
            appointments
        )
    );


    localStorage.setItem(
        "healthExams",
        JSON.stringify(
            exams
        )
    );


    localStorage.setItem(
        "healthBloodResults",
        JSON.stringify(
            bloodResults
        )
    );


    localStorage.setItem(
        "healthNotes",
        JSON.stringify(
            healthNotes
        )
    );

}


/* =====================================================
   FECHAR MODAL CLICANDO FORA
===================================================== */

document.addEventListener(
    "click",
    function (event) {

        if (
            event.target.classList.contains(
                "modal"
            )
        ) {

            event.target.classList.remove(
                "open"
            );

        }

    }
);
