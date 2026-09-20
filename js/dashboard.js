/* ============================================================
   PRODUCTION OPERATIONS CONNECT
   DASHBOARD ADMIN DATA SYNC
   ============================================================ */

const ADMIN_APPLICATIONS_KEY =
    "productionOperationsApplications";


/* ============================================================
   LOAD ADMIN APPLICATION DATA
   ============================================================ */

function getAdminApplications() {

    try {

        const stored =
            localStorage.getItem(
                ADMIN_APPLICATIONS_KEY
            );

        if (!stored) {
            return null;
        }

        const data =
            JSON.parse(stored);

        if (!Array.isArray(data)) {
            return null;
        }

        return data;

    } catch (error) {

        console.error(
            "Unable to load Admin application data:",
            error
        );

        return null;
    }
}


/* ============================================================
   FIND HOME CARD BY STABLE ID
   ============================================================ */

function findHomeApplicationCard(application) {

    if (!application) {
        return null;
    }


    /* First choice: stable ID */

    if (application.id) {

        const card =
            document.querySelector(
                `.application-card[data-id="${CSS.escape(application.id)}"]`
            );

        if (card) {
            return card;
        }
    }


    /* Fallback: original application name */

    const cards =
        document.querySelectorAll(
            ".application-card"
        );


    return Array.from(cards).find(
        function (card) {

            const name =
                card
                    .querySelector(
                        ".application-name h3"
                    )
                    ?.textContent
                    ?.trim()
                    ?.toLowerCase();


            return (
                name ===
                String(application.name || "")
                    .trim()
                    .toLowerCase()
            );

        }
    ) || null;
}


/* ============================================================
   UPDATE HOME CARD
   ============================================================ */

function updateHomeApplicationCard(
    card,
    application
) {

    if (!card || !application) {
        return;
    }


    /* Stable ID */

    if (application.id) {

        card.dataset.id =
            application.id;

    }


    /* Application name */

    const title =
        card.querySelector(
            ".application-name h3"
        );


    if (title) {

        title.textContent =
            application.name || "";

    }


    /* Description */

    const description =
        card.querySelector(
            ".application-name p"
        );


    if (description) {

        description.textContent =
            application.description ||
            application.function ||
            "";

    }


    /* Application function */

    card.dataset.function =
        application.function ||
        application.description ||
        "";


    /* Application name */

    card.dataset.application =
        application.name ||
        "";


    /* Severity */

    const severity =
        card.querySelector(
            ".severity-badge"
        );


    if (severity) {

        const severityValue =
            String(
                application.severity ||
                ""
            ).trim();


        severity.textContent =
            severityValue;


        severity.className =
            "severity-badge " +
            severityValue
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );

    }


    /* Icon */

    const icon =
        card.querySelector(
            ".application-icon img"
        );


    if (
        icon &&
        application.icon
    ) {

        icon.src =
            application.icon;

        icon.alt =
            application.name || "";

    }


    /* View Details button */

    const detailsButton =
        card.querySelector(
            ".view-details"
        );


    if (detailsButton) {

        detailsButton.dataset.app =
            application.name || "";

    }


    /* SLA */

    const bottom =
        card.querySelector(
            ".application-card-bottom"
        );


    if (
        bottom &&
        application.response
    ) {

        const spans =
            bottom.querySelectorAll(
                "span"
            );


        if (spans.length) {

            spans[0].textContent =
                "◷ SLA: " +
                application.response;

        }

    }
}


/* ============================================================
   UPDATE GLOBAL HOME APPLICATION OBJECT
   ============================================================

   Home currently contains:

       const applications = {
           "ACARS": {...},
           "WAM": {...}
       };

   We update that object so:

       ACARS → ACAR

   also changes the modal data.
   ============================================================ */

function updateHomeApplicationObject(
    application
) {

    if (
        typeof applications ===
        "undefined"
    ) {

        console.warn(
            "Home applications object is not available yet."
        );

        return;
    }


    const newName =
        String(
            application.name || ""
        ).trim();


    if (!newName) {
        return;
    }


    /* Find existing object by stable ID */

    let oldKey = null;


    const existingKeys =
        Object.keys(
            applications
        );


    for (
        let i = 0;
        i < existingKeys.length;
        i++
    ) {

        const key =
            existingKeys[i];


        const existing =
            applications[key];


        if (
            existing &&
            application.id &&
            existing.id &&
            existing.id ===
            application.id
        ) {

            oldKey = key;
            break;

        }

    }


    /* Fallback to previous card name */

    if (!oldKey) {

        for (
            let i = 0;
            i < existingKeys.length;
            i++
        ) {

            const key =
                existingKeys[i];


            const existing =
                applications[key];


            if (
                existing &&
                String(
                    existing.name || ""
                ).toLowerCase() ===
                newName.toLowerCase()
            ) {

                oldKey = key;
                break;

            }

        }

    }


    /* Create application object */

    const currentData =
        oldKey &&
        applications[oldKey]
            ? applications[oldKey]
            : {};


    const updatedData = {

        ...currentData,

        id:
            application.id ||
            currentData.id,

        name:
            application.name ||
            currentData.name,

        icon:
            application.icon ||
            currentData.icon,

        function:
            application.function ||
            application.description ||
            currentData.function,

        category:
            application.category ||
            currentData.category,

        vendor:
            application.vendor ||
            currentData.vendor,

        vendorPOC:
            application.vendorPOC ||
            currentData.vendorPOC,

        vendorEmail:
            application.vendorEmail ||
            currentData.vendorEmail,

        vendorPhone:
            application.vendorPhone ||
            currentData.vendorPhone,

        aagPOC:
            application.aagPOC ||
            currentData.aagPOC,

        aagTeam:
            application.team ||
            currentData.aagTeam,

        severity:
            application.severity ||
            currentData.severity,

        status:
            application.status ||
            currentData.status,

        description:
            application.description ||
            currentData.description,

        escalation:
            application.escalation ||
            currentData.escalation,

        response:
            application.sla ||
            application.response,

        supportModel:
            application.supportModel ||
            currentData.supportModel

    };


    /*
       IMPORTANT:

       Remove the old key.

       ACARS:
           applications["ACARS"]

       becomes:

           applications["ACAR"]
    */

    if (
        oldKey &&
        oldKey !== newName
    ) {

        delete applications[oldKey];

    }


    applications[newName] =
        updatedData;
}


/* ============================================================
   SYNC ALL ADMIN APPLICATIONS
   ============================================================ */

function syncAdminApplications() {

    const adminApplications =
        getAdminApplications();


    if (!adminApplications) {
        return;
    }


    adminApplications.forEach(
        function (application) {

            const card =
                findHomeApplicationCard(
                    application
                );


            if (card) {

                updateHomeApplicationCard(
                    card,
                    application
                );

            }


            updateHomeApplicationObject(
                application
            );

        }
    );


    console.log(
        "Admin application data synchronized with Home."
    );
}


/* ============================================================
   OPEN APPLICATION FROM FAVORITES
   ============================================================ */

function openApplicationFromQuery() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const applicationId =
        params.get(
            "application"
        );


    if (!applicationId) {
        return;
    }


    setTimeout(
        function () {

            const card =
                document.querySelector(
                    `.application-card[data-id="${CSS.escape(applicationId)}"]`
                );


            if (!card) {

                console.warn(
                    "Application card not found:",
                    applicationId
                );

                return;
            }


            const button =
                card.querySelector(
                    ".view-details"
                );


            if (button) {

                button.click();

            }

        },
        300
    );
}


/* ============================================================
   LISTEN FOR ADMIN CHANGES
   ============================================================ */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key ===
            ADMIN_APPLICATIONS_KEY
        ) {

            /*
               Another browser tab/window changed
               Admin application data.

               Refresh the dashboard automatically.
            */

            window.location.reload();

        }

    }
);


/* ============================================================
   INITIALIZE
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
           IMPORTANT:
           The inline application object in home.html
           must already exist before this runs.
        */

        syncAdminApplications();

        openApplicationFromQuery();

    }
);