/* =========================================================
   PRODUCTION OPERATIONS CONNECT
   CATEGORIES PAGE
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       CATEGORY DATA

       These are functional groupings created from the
       systems/applications present in the actual vendor
       workbook.
       ===================================================== */

    const categories = [

        {
            id: "flight-operations",
            name: "Flight Operations",
            icon: "✈",
            description:
                "Systems supporting flight planning, aircraft communication, flight information and operational decision-making.",
            systems: [
                {
                    name: "ACARS",
                    description:
                        "Aircraft Communications Addressing and Reporting System"
                },
                {
                    name: "Flight Planning",
                    description:
                        "Flight planning and operational support"
                },
                {
                    name: "JCTE",
                    description:
                        "Joint Carrier Technical Engineering"
                },
                {
                    name: "S4A",
                    description:
                        "Smart4Aviation / Weight and Balance"
                },
                {
                    name: "Aircraft Performance",
                    description:
                        "Aircraft performance data"
                },
                {
                    name: "Boeing Toolbox",
                    description:
                        "Boeing operational data and support"
                }
            ]
        },


        {
            id: "crew",
            name: "Crew",
            icon: "♟",
            description:
                "Applications supporting crew tracking, crew planning and crew-facing operational processes.",
            systems: [
                {
                    name: "AIMS",
                    description:
                        "AIMS / Horizon Crew Tracking / eCrew"
                },
                {
                    name: "JCTE",
                    description:
                        "Jeppesen Crew Tracking"
                },
                {
                    name: "Pilot Briefing",
                    description:
                        "Electronic Flight Bag briefing system"
                },
                {
                    name: "CSA Mobile",
                    description:
                        "Mobile boarding and lobby applications"
                }
            ]
        },


        {
            id: "airport-operations",
            name: "Airport Operations",
            icon: "▦",
            description:
                "Systems supporting airport operations, gates, passenger processing and operational displays.",
            systems: [
                {
                    name: "Real Time Gates",
                    description:
                        "RTG / Groundstar / Gatesheet"
                },
                {
                    name: "Web / Kiosk Check-In",
                    description:
                        "Web and kiosk check-in"
                },
                {
                    name: "Information Display Applications",
                    description:
                        "FIDS / GIDS / LIDS / RIDS / xIDS"
                },
                {
                    name: "NetTracer System",
                    description:
                        "Baggage tracking"
                },
                {
                    name: "Baggage",
                    description:
                        "Airport baggage operations"
                }
            ]
        },


        {
            id: "cargo",
            name: "Cargo",
            icon: "▣",
            description:
                "Systems supporting cargo processing, cargo payment and cargo operations.",
            systems: [
                {
                    name: "iCargo System",
                    description:
                        "Cargo and CargoSpot"
                },
                {
                    name: "Cargo Spot",
                    description:
                        "Cargo payment services"
                }
            ]
        },


        {
            id: "ecommerce",
            name: "E-Commerce",
            icon: "◇",
            description:
                "Customer-facing commerce, reservations, shopping and loyalty-related systems.",
            systems: [
                {
                    name: "Sabre",
                    description:
                        "Sabre airline reservation services"
                },
                {
                    name: "Image Reservations",
                    description:
                        "Reservation services"
                },
                {
                    name: "Shopping Service System",
                    description:
                        "QPX / QPXconnect / QPXReshop"
                },
                {
                    name: "SOLAR - Mileage Plan",
                    description:
                        "Mileage Plan / Siebel / LMS"
                },
                {
                    name: "Accelya",
                    description:
                        "Revera suite"
                }
            ]
        },


        {
            id: "maintenance",
            name: "Maintenance & Engineering",
            icon: "🔧",
            description:
                "Applications and services supporting aircraft maintenance and engineering operations.",
            systems: [
                {
                    name: "AS TRAX System",
                    description:
                        "Alaska Airlines TRAX"
                },
                {
                    name: "QX TRAX System",
                    description:
                        "QX TRAX"
                },
                {
                    name: "Aircraft Performance",
                    description:
                        "Aircraft performance data"
                }
            ]
        },


        {
            id: "corporate-applications",
            name: "Corporate Applications",
            icon: "▤",
            description:
                "Enterprise applications supporting corporate business processes and workforce operations.",
            systems: [
                {
                    name: "PeopleSoft Financials",
                    description:
                        "PeopleSoft Financials / PSFin"
                },
                {
                    name: "PeopleSoft HCM",
                    description:
                        "PeopleSoft Human Capital Management"
                },
                {
                    name: "TIBCO",
                    description:
                        "Enterprise integration platform"
                }
            ]
        },


        {
            id: "weather",
            name: "Weather",
            icon: "☁",
            description:
                "Weather data, feeds and operational meteorological services.",
            systems: [
                {
                    name: "Weather",
                    description:
                        "Weather services"
                },
                {
                    name: "Weather Feed",
                    description:
                        "IBM / WSI / Weather Company"
                },
                {
                    name: "WSI Fusion",
                    description:
                        "Weather data fusion"
                }
            ]
        },


        {
            id: "communications",
            name: "Communications",
            icon: "⌁",
            description:
                "Aircraft communication and operational communication platforms.",
            systems: [
                {
                    name: "ACARS",
                    description:
                        "Aircraft communications"
                },
                {
                    name: "ARINC",
                    description:
                        "Communication to aircraft"
                },
                {
                    name: "AvTec",
                    description:
                        "AVTEC communications platform"
                }
            ]
        },


        {
            id: "contact-centers",
            name: "Contact Centers",
            icon: "♧",
            description:
                "Platforms supporting customer contact center and workforce operations.",
            systems: [
                {
                    name: "Intelligent Cloud Contact Center",
                    description:
                        "Five9 cloud contact center"
                },
                {
                    name: "Alvaria",
                    description:
                        "Alvaria / Aspect WFM / WFO"
                }
            ]
        },

        {
            id: "infrastructure",
            name: "Infrastructure & Technology",
            icon: "⬡",
            description:
                "Technology platforms and enterprise services supporting Production Operations.",
            systems: [
                {
                    name: "TIBCO",
                    description:
                        "Enterprise integration"
                },
                {
                    name: "Microsoft Azure",
                    description:
                        "Cloud services supporting applications"
                },
                {
                    name: "NetTracer",
                    description:
                        "Operational baggage technology"
                }
            ]
        }

    ];


    /* Resolve category system labels from the effective master records. */
    const masterApplications = Object.values(window.masterData.applications);
    const masterVendors = window.masterData.vendors;
    const masterSystems = masterApplications.map(app => ({ name: app.name, description: app.description || app.function || "" }))
        .concat(masterVendors.map(vendor => ({ name: vendor.displayName || vendor.systemName || vendor.vendor, description: vendor.displaySubtitle || vendor.category || "" })));

    categories.forEach(function (category) {
        category.systems = category.systems.map(function (system) {
            const systemName = String(system.name).toLowerCase();
            const record = masterSystems.find(function (item) {
                const name = String(item.name || "").toLowerCase();
                return name === systemName || name.includes(systemName) || systemName.includes(name);
            });
            return record || system;
        });
    });

    /* =====================================================
       GROUND STOP APPLICATIONS
       ===================================================== */

    const groundStopApplications = [

        "ACARS",
        "WAM",
        "JetPlan",
        "S4A",
        "JCTE",
        "AirTrack",
        "Pilot Briefing",
        "Aircraft Maintenance",
        "AIMS"

    ];


    /* =====================================================
       DOM ELEMENTS
       ===================================================== */

    const categoryGrid =
        document.getElementById(
            "categoryGrid"
        );


    const categorySearch =
        document.getElementById(
            "categorySearch"
        );


    const clearCategorySearch =
        document.getElementById(
            "clearCategorySearch"
        );


    const noCategoryResults =
        document.getElementById(
            "noCategoryResults"
        );


    const categoryCount =
        document.getElementById(
            "categoryCount"
        );


    const systemCount =
        document.getElementById(
            "systemCount"
        );


    const vendorCount =
        document.getElementById(
            "vendorCount"
        );


    const applicationCount =
        document.getElementById(
            "applicationCount"
        );


    /* =====================================================
       MODAL ELEMENTS
       ===================================================== */

    const categoryModal =
        document.getElementById(
            "categoryModal"
        );


    const categoryModalClose =
        document.getElementById(
            "categoryModalClose"
        );


    const categoryModalIcon =
        document.getElementById(
            "categoryModalIcon"
        );


    const categoryModalTitle =
        document.getElementById(
            "categoryModalTitle"
        );


    const categoryModalDescription =
        document.getElementById(
            "categoryModalDescription"
        );


    const modalSystemCount =
        document.getElementById(
            "modalSystemCount"
        );


    const modalVendorCount =
        document.getElementById(
            "modalVendorCount"
        );


    const modalSystems =
        document.getElementById(
            "modalSystems"
        );


    /* =====================================================
       UTILITY
       ===================================================== */

    function escapeHtml(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* =====================================================
       STATISTICS
       ===================================================== */

    function updateStatistics() {

        categoryCount.textContent =
            categories.length;


        const uniqueSystems =
            new Set();


        categories.forEach(category => {

            category.systems.forEach(system => {

                uniqueSystems.add(
                    system.name
                );

            });

        });


        systemCount.textContent =
            uniqueSystems.size;


        /*
         * The workbook contains multiple records for some
         * vendors. This page therefore shows category-level
         * vendor connections rather than claiming these are
         * unique companies.
         */

        const vendorConnections =
            categories.reduce(
                (total, category) =>
                    total +
                    category.systems.length,
                0
            );


        vendorCount.textContent =
            masterVendors.length;


        applicationCount.textContent =
            masterApplications.length;

    }


    /* =====================================================
       RENDER CATEGORY CARD
       ===================================================== */

    function createCategoryCard(
        category,
        index
    ) {

        const card =
            document.createElement(
                "article"
            );


        card.className =
            "category-card";


        const previewSystems =
            category.systems.slice(
                0,
                3
            );


        const remaining =
            category.systems.length -
            previewSystems.length;


        const systemChips =
            previewSystems
                .map(system => `

                    <span
                        class="system-chip"
                        title="${escapeHtml(
                            system.description
                        )}"
                    >
                        ${escapeHtml(
                            system.name
                        )}
                    </span>

                `)
                .join("");


        const moreChip =
            remaining > 0
                ? `

                    <span
                        class="system-chip more"
                    >
                        +${remaining} more
                    </span>

                  `
                : "";


        card.innerHTML = `

            <div class="category-card-header">

                <div class="category-icon">
                    ${escapeHtml(
                        category.icon
                    )}
                </div>

                <div>

                    <h3>
                        ${escapeHtml(
                            category.name
                        )}
                    </h3>

                    <p class="category-card-description">
                        ${escapeHtml(
                            category.description
                        )}
                    </p>

                </div>

            </div>


            <div class="category-card-stats">

                <div class="category-mini-stat">

                    <strong>
                        ${category.systems.length}
                    </strong>

                    Systems

                </div>


                <div class="category-mini-stat">

                    <strong>
                        ${category.systems.length}
                    </strong>

                    Connections

                </div>

            </div>


            <div class="category-system-preview">

                ${systemChips}

                ${moreChip}

            </div>


            <div class="category-card-footer">

                <button
                    class="view-category"
                    type="button"
                    data-category-index="${index}"
                >
                    View Category →
                </button>

            </div>

        `;


        return card;

    }


    /* =====================================================
       RENDER CATEGORIES
       ===================================================== */

    function renderCategories() {

        const query =
            categorySearch.value
                .trim()
                .toLowerCase();


        categoryGrid.innerHTML = "";


        const filtered =
            categories.filter(
                category => {

                    if (!query) {
                        return true;
                    }


                    const categoryText =
                        [

                            category.name,
                            category.description,

                            ...category.systems.map(
                                system =>
                                    system.name
                            ),

                            ...category.systems.map(
                                system =>
                                    system.description
                            )

                        ]
                            .join(" ")
                            .toLowerCase();


                    return categoryText
                        .includes(query);

                }
            );


        filtered.forEach(
            category => {

                const originalIndex =
                    categories.indexOf(
                        category
                    );


                categoryGrid.appendChild(
                    createCategoryCard(
                        category,
                        originalIndex
                    )
                );

            }
        );


        noCategoryResults.hidden =
            filtered.length !== 0;

    }


    /* =====================================================
       OPEN CATEGORY MODAL
       ===================================================== */

    function openCategoryModal(
        category
    ) {

        categoryModalIcon.textContent =
            category.icon;


        categoryModalTitle.textContent =
            category.name;


        categoryModalDescription.textContent =
            category.description;


        modalSystemCount.textContent =
            category.systems.length;


        /*
         * Category vendor count is deliberately based on
         * system/vendor connections rather than claiming
         * unique vendor companies.
         */

        modalVendorCount.textContent =
            category.systems.length;


        modalSystems.innerHTML = "";


        category.systems.forEach(
            system => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "modal-system";


                item.innerHTML = `

                    <strong>
                        ${escapeHtml(
                            system.name
                        )}
                    </strong>

                    <span>
                        ${escapeHtml(
                            system.description
                        )}
                    </span>

                `;


                modalSystems.appendChild(
                    item
                );

            }
        );


        categoryModal.classList.add(
            "active"
        );


        categoryModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE MODAL
       ===================================================== */

    function closeCategoryModal() {

        categoryModal.classList.remove(
            "active"
        );


        categoryModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       CATEGORY CARD CLICK
       ===================================================== */

    categoryGrid.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".view-category"
                );


            if (!button) {
                return;
            }


            const index =
                Number(
                    button.dataset
                        .categoryIndex
                );


            if (
                !Number.isNaN(index) &&
                categories[index]
            ) {

                openCategoryModal(
                    categories[index]
                );

            }

        }
    );


    /* =====================================================
       SEARCH
       ===================================================== */

    categorySearch.addEventListener(
        "input",
        renderCategories
    );


    /* =====================================================
       CLEAR SEARCH
       ===================================================== */

    clearCategorySearch.addEventListener(
        "click",
        function () {

            categorySearch.value = "";

            renderCategories();

            categorySearch.focus();

        }
    );


    /* =====================================================
       CLOSE BUTTON
       ===================================================== */

    categoryModalClose.addEventListener(
        "click",
        closeCategoryModal
    );


    /* =====================================================
       CLOSE BY OVERLAY
       ===================================================== */

    categoryModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target.classList.contains(
                    "category-modal-overlay"
                )
            ) {

                closeCategoryModal();

            }

        }
    );


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                categoryModal.classList.contains(
                    "active"
                )
            ) {

                closeCategoryModal();

            }

        }
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateStatistics();

    renderCategories();

})();