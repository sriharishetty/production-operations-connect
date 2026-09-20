/* ============================================================
   PRODUCTION OPERATIONS CONNECT
   FAVORITES PAGE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================================
       APPLICATION DATA
       ======================================================== */

    const applications = [

        {
            id: "acars",
            name: "ACARS",
            description:
                "Aircraft Communications Addressing and Reporting System",
            icon: "public/applications/acars.png",
            category: "ITS Flight Operations",
            severity: "Critical",
            sla: "15 minutes"
        },

        {
            id: "wam",
            name: "WAM",
            description:
                "Weight and Balance Management",
            icon: "public/applications/wam.png",
            category: "ITS Flight Operations",
            severity: "High",
            sla: "30 minutes"
        },

        {
            id: "jetplan",
            name: "JetPlan",
            description:
                "Flight Planning System",
            icon: "public/applications/jetplan.png",
            category: "ITS Flight Operations",
            severity: "Critical",
            sla: "15 minutes"
        },

        {
            id: "s4a",
            name: "S4A",
            description:
                "Schedule for America",
            icon: "public/applications/s4a.png",
            category: "ITS Flight Operations",
            severity: "High",
            sla: "30 minutes"
        },

        {
            id: "jcte",
            name: "JCTE",
            description:
                "Joint Carrier Technical Engineering",
            icon: "public/applications/jcte.png",
            category: "Production Operations",
            severity: "Medium",
            sla: "1 hour"
        },

        {
            id: "airtrack",
            name: "AirTrack",
            description:
                "Aircraft Tracking",
            icon: "public/applications/airtrack.png",
            category: "ITS Flight Operations",
            severity: "Low",
            sla: "4 hours"
        },

        {
            id: "pilot-briefing",
            name: "Pilot Briefing",
            description:
                "Electronic Flight Bag Briefing System",
            icon: "public/applications/pilot-briefing.png",
            category: "Production Operations",
            severity: "High",
            sla: "30 minutes"
        },

        {
            id: "aircraft-maintenance",
            name: "Aircraft Maintenance",
            description:
                "Maintenance Tracking and Management",
            icon: "public/applications/aircraft-maintenance.png",
            category: "Production Operations",
            severity: "Medium",
            sla: "1 hour"
        },

        {
            id: "aims",
            name: "AIMS",
            description:
                "Airline Information Management System",
            icon: "public/applications/aims.png",
            category: "Production Operations",
            severity: "Critical",
            sla: "15 minutes"
        }

    ];


    /* ========================================================
       STORAGE
       ======================================================== */

    const STORAGE_KEYS = [
        "favorites",
        "favoriteApplications",
        "productionOperationsFavorites"
    ];


    /* ========================================================
       HTML ELEMENTS
       ======================================================== */

    const favoritesGrid =
        document.getElementById("favoritesGrid");

    const emptyState =
        document.getElementById("emptyState");

    const noResults =
        document.getElementById("noResults");

    const favoriteCount =
        document.getElementById("favoriteCount");

    const activeFavoriteCount =
        document.getElementById("activeFavoriteCount");

    const criticalFavoriteCount =
        document.getElementById("criticalFavoriteCount");

    const favoritesCount =
        document.getElementById("favoritesCount");

    const searchInput =
        document.getElementById("favoriteSearch");

    const clearButton =
        document.getElementById("clearFavorites");


    /* ========================================================
       READ FAVORITES
       ======================================================== */

    function getFavorites() {

        let favorites = [];

        STORAGE_KEYS.forEach(function (key) {

            try {

                const saved =
                    localStorage.getItem(key);

                if (!saved) {
                    return;
                }

                const parsed =
                    JSON.parse(saved);

                if (!Array.isArray(parsed)) {
                    return;
                }

                parsed.forEach(function (item) {

                    let id = item;

                    /*
                     * Supports:
                     *
                     * ["wam", "acars"]
                     *
                     * and:
                     *
                     * [{id:"wam"}]
                     */

                    if (
                        typeof item === "object" &&
                        item !== null
                    ) {

                        id =
                            item.id ||
                            item.applicationId ||
                            item.appId ||
                            item.name;

                    }

                    if (!id) {
                        return;
                    }

                    let normalized =
                        String(id)
                            .toLowerCase()
                            .trim();


                    /*
                     * Convert application names to IDs.
                     */

                    const matchingApplication =
                        applications.find(function (app) {

                            return (
                                app.id === normalized ||
                                app.name.toLowerCase() === normalized
                            );

                        });


                    if (matchingApplication) {

                        normalized =
                            matchingApplication.id;

                    } else {

                        normalized =
                            normalized
                                .replace(/\s+/g, "-");

                    }


                    if (
                        !favorites.includes(normalized)
                    ) {

                        favorites.push(normalized);

                    }

                });

            } catch (error) {

                console.warn(
                    "Could not read favorites:",
                    key
                );

            }

        });


        return favorites;

    }


    /* ========================================================
       SAVE FAVORITES
       ======================================================== */

    function saveFavorites(favorites) {

        /*
         * Main storage key.
         */

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );


        /*
         * Keep the Production Operations key
         * synchronized.
         */

        localStorage.setItem(
            "productionOperationsFavorites",
            JSON.stringify(favorites)
        );

    }


    /* ========================================================
       GET APPLICATION OBJECTS
       ======================================================== */

    function getFavoriteApplications() {

        const favoriteIds =
            getFavorites();


        return applications.filter(function (app) {

            return favoriteIds.includes(
                app.id
            );

        });

    }


    /* ========================================================
       UPDATE STATISTICS
       ======================================================== */

    function updateStats() {

        const favoriteApplications =
            getFavoriteApplications();


        const total =
            favoriteApplications.length;


        const critical =
            favoriteApplications.filter(
                function (app) {

                    return (
                        app.severity === "Critical"
                    );

                }
            ).length;


        if (favoriteCount) {

            favoriteCount.textContent =
                total;

        }


        if (activeFavoriteCount) {

            activeFavoriteCount.textContent =
                total;

        }


        if (criticalFavoriteCount) {

            criticalFavoriteCount.textContent =
                critical;

        }


        if (favoritesCount) {

            favoritesCount.textContent =
                total;

        }

    }


    /* ========================================================
       RENDER
       ======================================================== */

    function renderFavorites() {

        if (!favoritesGrid) {

            console.error(
                "favoritesGrid not found in favorites.html"
            );

            return;

        }


        const allFavorites =
            getFavoriteApplications();


        const searchText =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        let filteredFavorites =
            allFavorites;


        /* SEARCH */

        if (searchText) {

            filteredFavorites =
                allFavorites.filter(
                    function (app) {

                        return (
                            app.name
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            app.description
                                .toLowerCase()
                                .includes(searchText)
                        );

                    }
                );

        }


        /* UPDATE COUNTERS */

        updateStats();


        /* ====================================================
           NO FAVORITES
           ==================================================== */

        if (allFavorites.length === 0) {

            favoritesGrid.innerHTML = "";


            if (emptyState) {

                emptyState.style.display =
                    "flex";

            }


            if (noResults) {

                noResults.style.display =
                    "none";

            }


            return;

        }


        /* ====================================================
           SEARCH WITH NO RESULTS
           ==================================================== */

        if (
            searchText &&
            filteredFavorites.length === 0
        ) {

            favoritesGrid.innerHTML = "";


            if (emptyState) {

                emptyState.style.display =
                    "none";

            }


            if (noResults) {

                noResults.style.display =
                    "flex";

            }


            return;

        }


        /* ====================================================
           NORMAL DISPLAY
           ==================================================== */

        if (emptyState) {

            emptyState.style.display =
                "none";

        }


        if (noResults) {

            noResults.style.display =
                "none";

        }


        favoritesGrid.innerHTML =
            filteredFavorites
                .map(function (app) {

                    return createFavoriteCard(app);

                })
                .join("");


        attachFavoriteEvents();

    }


    /* ========================================================
       CREATE FAVORITE CARD
       ======================================================== */

    function createFavoriteCard(app) {

        const severityClass =
            app.severity
                .toLowerCase()
                .replace(/\s+/g, "-");


        return `

            <article
                class="favorite-card"
                data-id="${app.id}"
            >

                <div class="favorite-card-main">


                    <!-- APPLICATION ICON -->

                    <div class="favorite-icon">

                        <img
                            src="${app.icon}"
                            alt="${app.name}"
                        >

                    </div>


                    <!-- APPLICATION INFORMATION -->

                    <div class="favorite-content">

                        <div class="favorite-card-heading">

                            <div>

                                <h3>
                                    ${app.name}
                                </h3>

                                <p>
                                    ${app.description}
                                </p>

                            </div>

                        </div>


                        <div class="favorite-card-meta">

                            <span>
                                ${app.category}
                            </span>

                            <span>
                                SLA: ${app.sla}
                            </span>

                        </div>

                    </div>


                    <!-- SEVERITY -->

                    <span
                        class="
                            favorite-severity
                            ${severityClass}
                        "
                    >
                        ${app.severity}
                    </span>


                    <!-- FAVORITE BUTTON -->

                    <button
                        type="button"
                        class="favorite-remove"
                        data-id="${app.id}"
                        title="Remove from Favorites"
                        aria-label="Remove ${app.name} from Favorites"
                    >
                        ★
                    </button>


                </div>


                <!-- CARD FOOTER -->

                <div class="favorite-card-footer">

                    <span>
                        ${app.category}
                    </span>


                    <button
                        type="button"
                        class="favorite-details"
                        data-id="${app.id}"
                    >
                        View Details →
                    </button>

                </div>


            </article>

        `;

    }


    /* ========================================================
       EVENTS
       ======================================================== */

    function attachFavoriteEvents() {


        /* ====================================================
           REMOVE FAVORITE
           ==================================================== */

        document
            .querySelectorAll(".favorite-remove")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const id =
                            button.dataset.id;


                        removeFavorite(id);

                    }
                );

            });


        /* ====================================================
           VIEW DETAILS
           ==================================================== */

        document
            .querySelectorAll(".favorite-details")
            .forEach(function (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();
                        event.stopPropagation();


                        const id =
                            button.dataset.id;


                        const app =
                            applications.find(
                                function (item) {

                                    return (
                                        item.id === id
                                    );

                                }
                            );


                        if (!app) {
                            return;
                        }


                        /*
                         * Open the Home page and tell
                         * dashboard.js which application
                         * should be opened.
                         */

                        window.location.href =
                            "home.html?application=" +
                            encodeURIComponent(app.id);

                    }
                );

            });

    }


    /* ========================================================
       REMOVE FAVORITE
       ======================================================== */

    function removeFavorite(id) {

        const favorites =
            getFavorites();


        const updatedFavorites =
            favorites.filter(function (
                favoriteId
            ) {

                return favoriteId !== id;

            });


        saveFavorites(
            updatedFavorites
        );


        renderFavorites();

    }


    /* ========================================================
       CLEAR ALL
       ======================================================== */

    if (clearButton) {

        clearButton.addEventListener(
            "click",
            function () {

                const favorites =
                    getFavorites();


                if (
                    favorites.length === 0
                ) {

                    return;

                }


                const confirmed =
                    window.confirm(
                        "Remove all favorite applications?"
                    );


                if (!confirmed) {
                    return;
                }


                STORAGE_KEYS.forEach(
                    function (key) {

                        localStorage.removeItem(
                            key
                        );

                    }
                );


                renderFavorites();

            }
        );

    }


    /* ========================================================
       SEARCH
       ======================================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                renderFavorites();

            }
        );

    }


    /* ========================================================
       UPDATE WHEN STORAGE CHANGES
       ======================================================== */

    window.addEventListener(
        "storage",
        function (event) {

            if (
                STORAGE_KEYS.includes(
                    event.key
                )
            ) {

                renderFavorites();

            }

        }
    );


    /* ========================================================
       UPDATE WHEN PAGE GETS FOCUS
       ======================================================== */

    window.addEventListener(
        "focus",
        function () {

            renderFavorites();

        }
    );


    /* ========================================================
       INITIAL LOAD
       ======================================================== */

    renderFavorites();

});

/* ============================================================
   FAVORITES
   ============================================================ */

const FAVORITES_KEY = "productionOperationsFavorites";

/* Get saved favorites */
function getFavorites() {
    try {
        return JSON.parse(
            localStorage.getItem(FAVORITES_KEY)
        ) || [];
    } catch (error) {
        return [];
    }
}

/* Save favorites */
function saveFavorites(favorites) {
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}

/* Check if application is favorite */
function isFavorite(applicationName) {
    return getFavorites().some(
        item => item.name === applicationName
    );
}

/* Toggle favorite */
function toggleFavorite(application) {

    let favorites = getFavorites();

    const existingIndex = favorites.findIndex(
        item => item.name === application.name
    );

    if (existingIndex >= 0) {

        favorites.splice(existingIndex, 1);

    } else {

        favorites.push(application);

    }

    saveFavorites(favorites);

    updateFavoriteButtons();
}


/* Update all star buttons */
function updateFavoriteButtons() {

    const buttons =
        document.querySelectorAll(".favorite-application");

    buttons.forEach(button => {

        const name =
            button.dataset.application;

        const active =
            isFavorite(name);

        button.classList.toggle(
            "active",
            active
        );

        button.innerHTML =
            active ? "★" : "☆";

        button.title =
            active
                ? "Remove from Favorites"
                : "Add to Favorites";
    });
}


/* Create favorite buttons */
function setupApplicationFavorites() {

    const cards =
        document.querySelectorAll(
            ".application-card"
        );

    cards.forEach(card => {

        if (
            card.querySelector(
                ".favorite-application"
            )
        ) {
            return;
        }

        const title =
            card.querySelector(
                ".application-name h3"
            );

        if (!title) {
            return;
        }

        const applicationName =
            title.textContent.trim();

        const descriptionElement =
            card.querySelector(
                ".application-name p"
            );

        const description =
            descriptionElement
                ? descriptionElement.textContent.trim()
                : "";

        const iconElement =
            card.querySelector(
                ".application-icon img"
            );

        const icon =
            iconElement
                ? iconElement.getAttribute("src")
                : "";

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "favorite-application";

        button.dataset.application =
            applicationName;

        button.innerHTML =
            isFavorite(applicationName)
                ? "★"
                : "☆";

        button.title =
            isFavorite(applicationName)
                ? "Remove from Favorites"
                : "Add to Favorites";

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                toggleFavorite({
                    name: applicationName,
                    description: description,
                    icon: icon
                });

            }
        );

        card.appendChild(button);
    });

    updateFavoriteButtons();
}


/* Start Favorites */
document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupApplicationFavorites();

    }
);