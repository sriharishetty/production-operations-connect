/* Vendor records are supplied exclusively by js/data/master-data.js. */

(function () {

    "use strict";

    const vendors = window.masterData.vendors;

    const vendorGrid =
        document.getElementById("vendorGrid");

    const vendorSearch =
        document.getElementById("vendorSearch");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const teamFilter =
        document.getElementById("teamFilter");

    const vendorResultCount =
        document.getElementById("vendorResultCount");

    const noVendorResults =
        document.getElementById("noVendorResults");

    const clearVendorFilters =
        document.getElementById("clearVendorFilters");

    const vendorModal =
        document.getElementById("vendorModal");

    const vendorModalClose =
        document.getElementById("vendorModalClose");


    /* ========================================================
       MODAL ELEMENTS
       ======================================================== */

    const modalIcon =
        document.getElementById("vendorModalIcon");

    const modalTitle =
        document.getElementById("vendorModalTitle");

    const modalCompany =
        document.getElementById("vendorModalCompany");

    const modalSubtitle =
        document.getElementById("vendorModalSubtitle");

    const detailSystem =
        document.getElementById("detailSystem");

    const detailCategory =
        document.getElementById("detailCategory");

    const detailCompany =
        document.getElementById("detailCompany");

    const detailTeam =
        document.getElementById("detailTeam");

    const detailVendorPoc =
        document.getElementById("detailVendorPoc");

    const detailAagPoc =
        document.getElementById("detailAagPoc");

    const detailPhone =
        document.getElementById("detailPhone");

    const detailEmail =
        document.getElementById("detailEmail");

    const detailEscalation =
        document.getElementById("detailEscalation");

    const detailSourceRow =
        document.getElementById("detailSourceRow");

    const detailUpdatedDate =
        document.getElementById("detailUpdatedDate");

    const detailUpdatedBy =
        document.getElementById("detailUpdatedBy");

    const detailApprovedDate =
        document.getElementById("detailApprovedDate");

    const detailApprovedBy =
        document.getElementById("detailApprovedBy");

    const vendorEmailButton =
        document.getElementById("vendorEmailButton");

    const vendorCallButton =
        document.getElementById("vendorCallButton");

    const vendorFavoriteButton =
        document.getElementById("vendorFavoriteButton");

    const vendorCompanyCount =
        document.getElementById("vendorCompanyCount");

    const vendorContactCount =
        document.getElementById("vendorContactCount");

    const vendorEscalationCount =
        document.getElementById("vendorEscalationCount");


    let currentVendor = null;


    /* ========================================================
       HELPERS
       ======================================================== */

    function escapeHtml(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function displayValue(value) {

        if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
        ) {
            return "";
        }

        return escapeHtml(value)
            .replace(/\n/g, "<br>");

    }


    function initials(value) {

        const text =
            String(value || "VENDOR")
                .trim();

        const words =
            text
                .replace(/[^A-Za-z0-9 ]/g, " ")
                .split(/\s+/)
                .filter(Boolean);

        if (!words.length) {
            return "V";
        }


        if (words.length === 1) {

            return words[0]
                .substring(0, 2)
                .toUpperCase();

        }

        return (
            words[0][0] +
            words[1][0]
        ).toUpperCase();

    }


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

        const path = icons[hash % icons.length];
        const accentX = 4 + (ordinal % 7) * 2.6;
        const accentY = 4 + (Math.floor(ordinal / 7) % 6) * 3;
        const accentRadius = 0.8 + (ordinal % 3) * 0.25;

        return `<svg viewBox="0 0 24 24" aria-hidden="true">${path}<circle class="vendor-icon-accent" cx="${accentX}" cy="${accentY}" r="${accentRadius}"></circle></svg>`;

    }


    function uniqueSorted(values) {

        return [
            ...new Set(
                values
                    .map(value =>
                        String(value || "").trim()
                    )
                    .filter(Boolean)
            )
        ].sort(
            (a, b) =>
                a.localeCompare(b)
        );

    }


    function searchableText(vendor) {

        return [

            vendor.systemName,
            vendor.displayName,
            vendor.displaySubtitle,
            vendor.category,
            vendor.company || vendor.vendor,
            vendor.escalation,
            vendor.phone,
            vendor.email,
            vendor.vendorPoc,
            vendor.aagItsPoc,
            vendor.aagItsTeam

        ]
            .join(" ")
            .toLowerCase();

    }


    /* ========================================================
       FILTER OPTIONS
       ======================================================== */

    function populateFilters() {

        const categories =
            uniqueSorted(
                vendors.flatMap(vendor =>

                    String(
                        vendor.category || ""
                    )
                        .split("•")
                        .map(item =>
                            item.trim()
                        )

                )
            );


        const teams =
            uniqueSorted(
                vendors.map(vendor =>
                    vendor.aagItsTeam
                )
            );


        categories.forEach(category => {

            const option =
                document.createElement("option");

            option.value = category;

            option.textContent = category;

            categoryFilter.appendChild(
                option
            );

        });


        teams.forEach(team => {

            const option =
                document.createElement("option");

            option.value = team;

            option.textContent = team;

            teamFilter.appendChild(
                option
            );

        });

    }


    /* ========================================================
       STATISTICS
       ======================================================== */

    function calculateStats() {

        const companies =
            new Set(

                vendors
                    .map(vendor =>
                        String(
                            vendor.company || vendor.vendor || ""
                        )
                            .replace(/\s+/g, " ")
                            .trim()
                    )
                    .filter(Boolean)

            );


        const contacts =
            vendors.filter(vendor =>

                vendor.phone ||
                vendor.email ||
                vendor.vendorPoc ||
                vendor.aagItsPoc

            ).length;


        const escalations =
            vendors.filter(vendor =>
                vendor.escalation
            ).length;


        if (vendorCompanyCount) {
            vendorCompanyCount.textContent =
                companies.size;
        }


        if (vendorContactCount) {
            vendorContactCount.textContent =
                contacts;
        }


        if (vendorEscalationCount) {
            vendorEscalationCount.textContent =
                escalations;
        }

    }


    /* ========================================================
       RENDER VENDOR CARDS
       ======================================================== */

    function renderVendors() {

        const query =
            vendorSearch.value
                .trim()
                .toLowerCase();


        const selectedCategory =
            categoryFilter.value;


        const selectedTeam =
            teamFilter.value;


        const filtered =
            vendors.filter(vendor => {

                const matchesSearch =
                    !query ||
                    searchableText(vendor)
                        .includes(query);


                const categoryParts =
                    String(
                        vendor.category || ""
                    )
                        .split("•")
                        .map(item =>
                            item.trim()
                        );


                const matchesCategory =
                    !selectedCategory ||
                    categoryParts.includes(
                        selectedCategory
                    );


                const matchesTeam =
                    !selectedTeam ||
                    vendor.aagItsTeam ===
                    selectedTeam;


                return (
                    matchesSearch &&
                    matchesCategory &&
                    matchesTeam
                );

            });


        vendorGrid.innerHTML = "";


        filtered.forEach(
            (vendor, filteredIndex) => {

                const originalIndex =
                    vendors.indexOf(vendor);


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "vendor-card";


                const colorClass =
                    "color-" +
                    (filteredIndex % 6);


                card.innerHTML = `

                    <div class="vendor-card-top">

                        <div class="vendor-avatar ${colorClass}">
                            ${vendorIcon(vendor)}
                        </div>

                        <div class="vendor-card-heading">

                            <h3>
                                ${escapeHtml(
                                    vendor.displayName
                                )}
                            </h3>

                            <p>
                                ${escapeHtml(
                                    vendor.displaySubtitle
                                )}
                            </p>

                        </div>

                    </div>


                    <div class="vendor-company">

                        <span>
                            Vendor Company
                        </span>

                        <strong
                            title="${escapeHtml(
                                vendor.company || vendor.vendor
                            )}"
                        >
                            ${escapeHtml(
                                vendor.company || vendor.vendor ||
                                ""
                            )}
                        </strong>

                    </div>

                    <div class="vendor-card-contact">

                        <span title="${escapeHtml(
                            vendor.phone || "Not provided"
                        )}">
                            ☎ ${escapeHtml(
                                vendor.phone || "Not provided"
                            )}
                        </span>

                        <span title="${escapeHtml(
                            vendor.email || "Not provided"
                        )}">
                            ✉ ${escapeHtml(
                                vendor.email || "Not provided"
                            )}
                        </span>

                    </div>


                    <div class="vendor-card-footer">

                        <span
                            class="vendor-team"
                            title="${escapeHtml(
                                vendor.aagItsTeam
                            )}"
                        >
                            ${escapeHtml(
                                vendor.aagItsTeam ||
                                ""
                            )}
                        </span>

                        <button
                            class="vendor-view"
                            type="button"
                            data-index="${originalIndex}"
                        >
                            View Details →
                        </button>

                    </div>

                `;


                vendorGrid.appendChild(card);

            }
        );


        vendorResultCount.textContent =
            `Showing ${filtered.length} of ${vendors.length} vendor records`;


        noVendorResults.hidden =
            filtered.length !== 0;

    }


    /* ========================================================
       OPEN VENDOR MODAL
       ======================================================== */

    function openVendorModal(vendor) {

        currentVendor = vendor;


        modalIcon.innerHTML =
            vendorIcon(vendor);


        modalTitle.textContent =
            vendor.displayName ||
            "Vendor";


        modalCompany.textContent =
            vendor.company || vendor.vendor ||
            "";


        modalSubtitle.textContent =
            vendor.displaySubtitle ||
            "Production Operations vendor information";


        detailSystem.innerHTML =
            displayValue(
                vendor.systemName ||
                vendor.displayName
            );


        detailCategory.innerHTML =
            displayValue(
                vendor.category
            );


        detailCompany.innerHTML =
            displayValue(
                vendor.company || vendor.vendor
            );


        detailTeam.innerHTML =
            displayValue(
                vendor.aagItsTeam
            );


        detailVendorPoc.innerHTML =
            displayValue(
                vendor.vendorPoc
            );


        detailAagPoc.innerHTML =
            displayValue(
                vendor.aagItsPoc
            );


        detailPhone.innerHTML =
            displayValue(
                vendor.phone
            );


        detailEmail.innerHTML =
            displayValue(
                vendor.email
            );


        detailEscalation.innerHTML =
            displayValue(
                vendor.escalation
            );


        detailSourceRow.innerHTML =
            displayValue(
                vendor.sourceRow
            );


        detailUpdatedDate.innerHTML =
            displayValue(
                vendor.updatedDate
            );


        detailUpdatedBy.innerHTML =
            displayValue(
                vendor.updatedBy
            );


        detailApprovedDate.innerHTML =
            displayValue(
                vendor.approvedDate
            );


        detailApprovedBy.innerHTML =
            displayValue(
                vendor.approvedBy
            );


        vendorModal.classList.add(
            "active"
        );


        vendorModal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        resetModalTabs();

        updateFavoriteButton();

    }


    /* ========================================================
       CLOSE MODAL
       ======================================================== */

    function closeVendorModal() {

        vendorModal.classList.remove(
            "active"
        );


        vendorModal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";


        currentVendor = null;

    }


    /* ========================================================
       MODAL TABS
       ======================================================== */

    function resetModalTabs() {

        document
            .querySelectorAll(
                ".vendor-modal-tab"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.tab ===
                    "overview"
                );

            });


        document
            .querySelectorAll(
                ".vendor-tab-panel"
            )
            .forEach(panel => {

                panel.classList.toggle(
                    "active",
                    panel.dataset.panel ===
                    "overview"
                );

            });

    }


    document
        .querySelectorAll(
            ".vendor-modal-tab"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    const tab =
                        this.dataset.tab;


                    document
                        .querySelectorAll(
                            ".vendor-modal-tab"
                        )
                        .forEach(item => {

                            item.classList.toggle(
                                "active",
                                item === this
                            );

                        });


                    document
                        .querySelectorAll(
                            ".vendor-tab-panel"
                        )
                        .forEach(panel => {

                            panel.classList.toggle(
                                "active",
                                panel.dataset.panel ===
                                tab
                            );

                        });

                }
            );

        });


    /* ========================================================
       CARD CLICK
       ======================================================== */

    vendorGrid.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".vendor-view"
                );


            if (!button) {
                return;
            }


            const index =
                Number(
                    button.dataset.index
                );


            if (
                !Number.isNaN(index) &&
                vendors[index]
            ) {

                openVendorModal(
                    vendors[index]
                );

            }

        }
    );


    /* ========================================================
       SEARCH
       ======================================================== */

    vendorSearch.addEventListener(
        "input",
        renderVendors
    );


    categoryFilter.addEventListener(
        "change",
        renderVendors
    );


    teamFilter.addEventListener(
        "change",
        renderVendors
    );


    /* ========================================================
       CLEAR FILTERS
       ======================================================== */

    clearVendorFilters.addEventListener(
        "click",
        function () {

            vendorSearch.value = "";

            categoryFilter.value = "";

            teamFilter.value = "";

            renderVendors();

        }
    );


    /* ========================================================
       CLOSE MODAL
       ======================================================== */

    vendorModalClose.addEventListener(
        "click",
        closeVendorModal
    );


    vendorModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                vendorModal
            ) {

                closeVendorModal();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                vendorModal.classList.contains(
                    "active"
                )
            ) {

                closeVendorModal();

            }

        }
    );


    /* ========================================================
       EMAIL
       ======================================================== */

    vendorEmailButton.addEventListener(
        "click",
        function () {

            if (
                currentVendor &&
                currentVendor.email &&
                currentVendor.email !== "No"
            ) {

                window.location.href =
                    "mailto:" +
                    currentVendor.email;

            }

        }
    );


    /* ========================================================
       PHONE
       ======================================================== */

    vendorCallButton.addEventListener(
        "click",
        function () {

            if (
                currentVendor &&
                currentVendor.phone &&
                currentVendor.phone !== "No"
            ) {

                const phone =
                    currentVendor.phone
                        .match(
                            /\+?\d[\d\s().-]{6,}/
                        );


                if (phone) {

                    window.location.href =
                        "tel:" +
                        phone[0]
                            .replace(
                                /[^0-9+]/g,
                                ""
                            );

                }

            }

        }
    );


    /* ========================================================
       FAVORITES
       ======================================================== */

    function getFavorites() {

        try {

            const saved =
                JSON.parse(
                localStorage.getItem(
                    "productionOpsVendorFavorites"
                )
                ) || [];

            return saved.map(function (item) {

                const value =
                    typeof item === "object" && item !== null
                        ? item.id || item.sourceRow || item.name
                        : item;

                const vendor =
                    vendors.find(function (candidate) {

                        return (
                            String(candidate.id) === String(value) ||
                            String(candidate.sourceRow) === String(value) ||
                            String(candidate.displayName).toLowerCase() ===
                                String(value).toLowerCase()
                        );

                    });

                return vendor
                    ? vendor.id
                    : String(value);

            });

        } catch (error) {

            return [];

        }

    }


    function saveFavorites(
        favorites
    ) {

        localStorage.setItem(
            "productionOpsVendorFavorites",
            JSON.stringify(
                favorites
            )
        );

    }


    function updateFavoriteButton() {

        if (!currentVendor) {
            return;
        }


        const favorites =
            getFavorites();


        const key =
            currentVendor.id ||
            String(
                currentVendor.sourceRow
            );


        const isFavorite =
            favorites.includes(key);


        vendorFavoriteButton.classList.toggle(
            "active",
            isFavorite
        );


        vendorFavoriteButton.textContent =
            isFavorite
                ? "★ Remove from Favorites"
                : "☆ Add to Favorites";

    }


    vendorFavoriteButton.addEventListener(
        "click",
        function () {

            if (!currentVendor) {
                return;
            }


            const favorites =
                getFavorites();


            const key =
                currentVendor.id ||
                String(
                    currentVendor.sourceRow
                );


            const index =
                favorites.indexOf(key);


            if (index === -1) {

                favorites.push(key);

            } else {

                favorites.splice(
                    index,
                    1
                );

            }


            saveFavorites(
                favorites
            );


            updateFavoriteButton();

        }
    );


    /* ========================================================
       INITIALIZE
       ======================================================== */

    populateFilters();

    calculateStats();

    renderVendors();

})();
