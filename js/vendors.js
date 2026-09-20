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
                            ${escapeHtml(
                                initials(
                                    vendor.company || vendor.vendor ||
                                    vendor.displayName
                                )
                            )}
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


        modalIcon.textContent =
            initials(
                vendor.company || vendor.vendor ||
                vendor.displayName
            );


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

            return JSON.parse(
                localStorage.getItem(
                    "productionOpsVendorFavorites"
                )
            ) || [];

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
