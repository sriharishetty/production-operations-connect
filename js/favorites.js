/* ============================================================
   PRODUCTION OPERATIONS CONNECT
   FAVORITES PAGE
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ========================================================
       APPLICATION DATA
       ======================================================== */

    const applications = Object.values(window.masterData.applications);
    const vendors = window.masterData.vendors;


    /* ========================================================
       STORAGE
       ======================================================== */

    const STORAGE_KEYS = [
        "favorites",
        "favoriteApplications",
        "productionOperationsFavorites",
        "productionOpsVendorFavorites"
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


    function escapeHtml(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


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

                    const matchingVendor =
                        vendors.find(function (vendor) {

                            return (
                                vendor.id === normalized ||
                                String(vendor.sourceRow) === normalized ||
                                vendor.displayName.toLowerCase() === normalized
                            );

                        });


                    if (matchingApplication) {

                        normalized =
                            matchingApplication.id;

                    } else if (matchingVendor) {

                        normalized =
                            matchingVendor.id;

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


    function getFavoriteVendors() {

        const favoriteIds =
            getFavorites();


        return vendors.filter(function (vendor) {

            return favoriteIds.includes(
                vendor.id
            );

        });

    }


    /* ========================================================
       UPDATE STATISTICS
       ======================================================== */

    function updateStats() {

        const favoriteApplications =
            getFavoriteApplications();

        const favoriteVendors =
            getFavoriteVendors();


        const total =
            favoriteApplications.length +
            favoriteVendors.length;


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
            return;

        }


        const allFavorites =
            getFavoriteApplications().concat(
                getFavoriteVendors()
            );


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

                        const name =
                            app.name ||
                            app.displayName ||
                            "";

                        const description =
                            app.description ||
                            app.displaySubtitle ||
                            "";

                        return (
                            name
                                .toLowerCase()
                                .includes(searchText)

                            ||

                            description
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

    function vendorIcon(vendor) {

        const label = [
            vendor.company,
            vendor.vendor,
            vendor.displayName,
            vendor.category
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const icons = [
            '<path d="M4 20V5l8-2 8 2v15"></path><path d="M8 8h2m4 0h2M8 12h2m4 0h2M8 16h2m4 0h2"></path>',
            '<path d="M7 18h10a3.5 3.5 0 0 0 .4-7A5.5 5.5 0 0 0 7 9.5 4.25 4.25 0 0 0 7 18Z"></path><path d="m8 21 1-1m4 1 1-1m4 1 1-1"></path>',
            '<path d="M4 8h16v12H4z"></path><path d="M8 8V5h8v3M8 12v4m8-4v4"></path>',
            '<path d="m2.5 12 7.1-1.1 3.1-6.7 1.8.5-1 6.6 4.1.2 4-2.2.8.6-2.8 2.8 2.8 2.8-.8.6-4-2.2-4.1.2 1 6.6-1.8.5-3.1-6.7L2.5 12Z"></path>',
            '<path d="M4 10a8 8 0 0 1 16 0"></path><path d="M7 10v6m10-6v6M5 16h3m8 0h3M9 20h6"></path>',
            '<rect x="4" y="5" width="16" height="14" rx="2"></rect><path d="M8 9h8M8 13h5m-5 3h3"></path>',
            '<circle cx="9" cy="8" r="3"></circle><path d="M3.5 19c.5-3.1 2.3-4.7 5.5-4.7s5 1.6 5.5 4.7M15 6a3 3 0 0 1 0 5.8M16 14.5c2.4.4 3.8 1.8 4.2 4.5"></path>',
            '<circle cx="12" cy="12" r="7"></circle><path d="M12 5v7l4 2"></path>',
            '<path d="m12 3 7 4v10l-7 4-7-4V7l7-4Z"></path><path d="m8 10 4 2 4-2M8 14l4 2 4-2"></path>',
            '<path d="M5 5h14v14H5z"></path><path d="M8 9h8M8 12h8M8 15h5"></path>',
            '<path d="M4 18h16M6 18V8h12v10M9 8V5h6v3"></path>',
            '<path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2 2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8"></path><circle cx="12" cy="12" r="3"></circle>'
        ];

        const ordinal =
            Math.max(0, vendors.indexOf(vendor));

        let hash = ordinal;

        if (/(weather|wsi|rain|fusion)/.test(label)) {
            hash += 1;
        } else if (/(baggage|cargo|icargo|spot|nettracer)/.test(label)) {
            hash += 2;
        } else if (/(flight|aircraft|aerodata|boeing|avtec|jetplan|jeppesen)/.test(label)) {
            hash += 3;
        }

        const accentX = 4 + (ordinal % 7) * 2.6;
        const accentY = 4 + (Math.floor(ordinal / 7) % 6) * 3;
        const accentRadius = 0.8 + (ordinal % 3) * 0.25;

        return `
            <svg viewBox="0 0 24 24" aria-hidden="true">
                ${icons[hash % icons.length]}
                <circle
                    class="vendor-icon-accent"
                    cx="${accentX}"
                    cy="${accentY}"
                    r="${accentRadius}"
                ></circle>
            </svg>
        `;

    }


    function createFavoriteCard(app) {

        const isVendor =
            vendors.includes(app);

        const name =
            app.name ||
            app.displayName ||
            "";

        const description =
            app.description ||
            app.displaySubtitle ||
            "";

        const severityClass =
            (app.severity || "low")
                .toLowerCase()
                .replace(/\s+/g, "-");

        const iconMarkup =
            isVendor
                ? vendorIcon(app)
                : `
                    <img
                        src="${app.icon || ""}"
                        alt="${name}"
                    >
                `;

        const iconClass =
            isVendor
                ? `favorite-icon color-${vendors.indexOf(app) % 6}`
                : "favorite-icon";

        if (isVendor) {

            const colorClass =
                "color-" +
                (vendors.indexOf(app) % 6);

            return `

                <article
                    class="vendor-card"
                    data-id="${app.id}"
                    data-type="vendor"
                >

                    <div class="vendor-card-top">

                        <div class="vendor-avatar ${colorClass}">
                            ${vendorIcon(app)}
                        </div>

                        <div class="vendor-card-heading">

                            <h3>
                                ${escapeHtml(name)}
                            </h3>

                            <p>
                                ${escapeHtml(description)}
                            </p>

                        </div>

                    </div>

                    <div class="vendor-company">

                        <span>
                            Vendor Company
                        </span>

                        <strong
                            title="${escapeHtml(
                                app.company || app.vendor
                            )}"
                        >
                            ${escapeHtml(
                                app.company || app.vendor || ""
                            )}
                        </strong>

                    </div>

                    <div class="vendor-card-contact">

                        <span title="${escapeHtml(
                            app.phone || "Not provided"
                        )}">
                            ☎ ${escapeHtml(
                                app.phone || "Not provided"
                            )}
                        </span>

                        <span title="${escapeHtml(
                            app.email || "Not provided"
                        )}">
                            ✉ ${escapeHtml(
                                app.email || "Not provided"
                            )}
                        </span>

                    </div>

                    <div class="vendor-card-footer">

                        <span
                            class="vendor-team"
                            title="${escapeHtml(app.aagItsTeam)}"
                        >
                            ${escapeHtml(app.aagItsTeam || "")}
                        </span>

                        <button
                            class="vendor-view favorite-details"
                            type="button"
                            data-id="${app.id}"
                            data-type="vendor"
                        >
                            View Details →
                        </button>

                    </div>

                    <button
                        type="button"
                        class="favorite-remove"
                        data-id="${app.id}"
                        title="Remove from Favorites"
                        aria-label="Remove ${name} from Favorites"
                    >
                        ★
                    </button>

                </article>

            `;

        }


        return `

            <article
                class="favorite-card"
                data-id="${app.id}"
                data-type="${isVendor ? "vendor" : "application"}"
            >

                <div class="favorite-card-main">


                    <!-- APPLICATION ICON -->

                    <div class="${iconClass}">

                        ${iconMarkup}

                    </div>


                    <!-- APPLICATION INFORMATION -->

                    <div class="favorite-content">

                        <div class="favorite-card-heading">

                            <div>

                                <h3>
                                    ${name}
                                </h3>

                                <p>
                                    ${description}
                                </p>

                            </div>

                        </div>


                        <div class="favorite-card-meta">

                            <span>
                                ${app.category}
                            </span>

                            <span>
                                ${isVendor
                                    ? app.company || app.vendor || ""
                                    : "SLA: " + (app.response || app.sla || "")}
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
                        ${isVendor ? "Vendor" : app.severity}
                    </span>


                    <!-- FAVORITE BUTTON -->

                    <button
                        type="button"
                        class="favorite-remove"
                        data-id="${app.id}"
                        title="Remove from Favorites"
                        aria-label="Remove ${name} from Favorites"
                    >
                        ★
                    </button>


                </div>


                <!-- CARD FOOTER -->

                <div class="favorite-card-footer">

                    <span>
                        ${app.category || ""}
                    </span>


                    <button
                        type="button"
                        class="favorite-details"
                        data-id="${app.id}"
                        data-type="${isVendor ? "vendor" : "application"}"
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

                        const type =
                            button.dataset.type;

                        if (type === "vendor") {

                            window.location.href =
                                "vendors.html";

                            return;

                        }


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

        const vendor =
            vendors.find(function (item) {

                return item.id === id;

            });

        if (vendor) {

            let vendorFavorites = [];

            try {

                vendorFavorites =
                    JSON.parse(
                        localStorage.getItem(
                            "productionOpsVendorFavorites"
                        )
                    ) || [];

            } catch (error) {

                vendorFavorites = [];

            }

            vendorFavorites =
                vendorFavorites.filter(function (item) {

                    const value =
                        typeof item === "object" && item !== null
                            ? item.id || item.sourceRow || item.name
                            : item;

                    return !(
                        String(value) === String(vendor.id) ||
                        String(value) === String(vendor.sourceRow) ||
                        String(value).toLowerCase() ===
                            String(vendor.displayName).toLowerCase()
                    );

                });

            localStorage.setItem(
                "productionOpsVendorFavorites",
                JSON.stringify(vendorFavorites)
            );

            renderFavorites();

            return;

        }

        const favorites =
            getFavorites().filter(function (favoriteId) {

                return applications.some(function (app) {

                    return app.id === favoriteId;

                });

            });


        const updatedFavorites =
            favorites.filter(function (
                favoriteId
            ) {

                return favoriteId !== id;

            });


        saveFavorites(updatedFavorites);


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
function isFavorite(applicationId) {
    return getFavorites().some(
        item => (typeof item === "string" ? item : item.id) === applicationId
    );
}

/* Toggle favorite */
function toggleFavorite(application) {

    let favorites = getFavorites()
        .map(item => typeof item === "string" ? item : item.id)
        .filter(Boolean);

    const existingIndex = favorites.findIndex(
        item => item === application.id
    );

    if (existingIndex >= 0) {

        favorites.splice(existingIndex, 1);

    } else {

        favorites.push(application.id);

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
            (Object.values(window.masterData.applications).find(
                app => app.name === applicationName
            ) || {}).id || applicationName;

        button.innerHTML =
            isFavorite(button.dataset.application)
                ? "★"
                : "☆";

        button.title =
            isFavorite(button.dataset.application)
                ? "Remove from Favorites"
                : "Add to Favorites";

        button.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();

                const application = Object.values(
                    window.masterData.applications
                ).find(app => app.id === button.dataset.application);

                if (application) {
                    toggleFavorite(application);
                }

            }
        );

        const cardTop =
            card.querySelector(
                ".application-card-top"
            );

        const severity =
            card.querySelector(
                ".severity-badge"
            );

        let actions =
            card.querySelector(
                ".application-actions"
            );

        if (!actions && cardTop) {

            actions =
                document.createElement("div");

            actions.className =
                "application-actions";

            cardTop.appendChild(actions);

        }

        if (actions) {

            if (severity) {
                actions.appendChild(severity);
            }

            actions.appendChild(button);

        } else {

            card.appendChild(button);

        }
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
