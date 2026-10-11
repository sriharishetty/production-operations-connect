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

    const detailSupportedSystems =
        document.getElementById("detailSupportedSystems");

    const detailCategory =
        document.getElementById("detailCategory");

    const detailCompany =
        document.getElementById("detailCompany");

    const detailTeam =
        document.getElementById("detailTeam");

    const detailStatusSupport =
        document.getElementById("detailStatusSupport");

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


    function usableCardValue(value) {
        const text = String(value || "").trim();
        return text && !/^(?:n\/?a|tbd|none|no)$/i.test(text)
            ? text
            : "";
    }


    function cardContactSummary(value) {
        return (Array.isArray(value) ? value.join("\n") : String(value || ""))
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(usableCardValue)
            .join(" · ");
    }


    const verifiedVendorLogos = Object.freeze({});


    function vendorLogo(vendor, company) {
        const verifiedLogo = verifiedVendorLogos[String(vendor.id || "")];

        if (verifiedLogo) {
            return {
                src: verifiedLogo,
                alt: `${company} logo`
            };
        }

        let hash = 0;
        const identity = company.toLocaleLowerCase();

        for (let index = 0; index < identity.length; index += 1) {
            hash = (hash * 31 + identity.charCodeAt(index)) >>> 0;
        }

        const palettes = [
            { background: "#e8f4fb", foreground: "#155f8c", accent: "#74c5e7" },
            { background: "#e8f5f1", foreground: "#176a58", accent: "#69c6a6" },
            { background: "#eef0fb", foreground: "#3d4f93", accent: "#9daaf0" },
            { background: "#fff3e8", foreground: "#9a5426", accent: "#f0aa70" },
            { background: "#f1edf8", foreground: "#674b88", accent: "#b7a0d7" }
        ];
        const palette = palettes[hash % palettes.length];
        const mark = initials(company);
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="20" fill="${palette.background}"/><path d="M12 68c18-22 42-30 72-22v38H12Z" fill="${palette.accent}" opacity=".36"/><circle cx="72" cy="25" r="12" fill="${palette.accent}" opacity=".55"/><text x="48" y="57" text-anchor="middle" font-family="Arial,sans-serif" font-size="30" font-weight="700" fill="${palette.foreground}">${mark}</text></svg>`;

        return {
            src: `data:image/svg+xml,${encodeURIComponent(svg)}`,
            alt: `${company} monogram placeholder, not an official logo`
        };
    }


    function contactTarget(value, type) {
        const text = Array.isArray(value) ? value.join("\n") : String(value || "");

        if (type === "email") {
            const addresses = [...new Set(
                text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || []
            )];

            return addresses.length
                ? `mailto:${addresses.join(",")}`
                : "";
        }

        const numbers = text.match(/\+?\d[\d\s().-]{5,}\d/g) || [];
        const phone = numbers
            .map(number => number.trim())
            .find(number => number.replace(/\D/g, "").length >= 7);

        return phone
            ? `tel:${phone.replace(/[^\d+]/g, "")}`
            : "";
    }


    function companyName(vendor) {
        return usableCardValue(vendor.company) ||
            usableCardValue(vendor.vendor) ||
            usableCardValue(vendor.displayName) ||
            "Vendor";
    }


    function supportedSystems(vendor) {
        const company = companyName(vendor).toLocaleLowerCase();
        const systems = new Map();

        vendors.forEach(record => {
            if (companyName(record).toLocaleLowerCase() !== company) {
                return;
            }

            const system = usableCardValue(
                record.systemName || record.displayName
            );

            if (system) {
                systems.set(system.toLocaleLowerCase(), system);
            }
        });

        return [...systems.values()];
    }


    function supportedSystemCount(vendor) {
        return Math.max(supportedSystems(vendor).length, 1);
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


    function setupCustomFilter(select) {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "vendor-filter-custom";

        select.parentNode.insertBefore(
            wrapper,
            select
        );

        wrapper.appendChild(select);

        const button =
            document.createElement("button");

        button.type =
            "button";

        button.className =
            "vendor-filter-trigger";

        button.setAttribute(
            "aria-haspopup",
            "listbox"
        );

        const menu =
            document.createElement("div");

        menu.className =
            "vendor-filter-menu";

        menu.setAttribute(
            "role",
            "listbox"
        );

        function syncSelection() {

            const selected =
                select.options[select.selectedIndex];

            button.textContent =
                selected
                    ? selected.textContent
                    : "";

            menu
                .querySelectorAll("[role='option']")
                .forEach(function (option) {

                    const active =
                        option.dataset.value ===
                        select.value;

                    option.classList.toggle(
                        "selected",
                        active
                    );

                    option.setAttribute(
                        "aria-selected",
                        String(active)
                    );

                });

        }

        Array.from(select.options).forEach(
            function (option) {

                const item =
                    document.createElement("button");

                item.type =
                    "button";

                item.className =
                    "vendor-filter-option";

                item.dataset.value =
                    option.value;

                item.textContent =
                    option.textContent;

                item.setAttribute(
                    "role",
                    "option"
                );

                item.addEventListener(
                    "click",
                    function () {

                        select.value =
                            item.dataset.value;

                        select.dispatchEvent(
                            new Event("change", {
                                bubbles: true
                            })
                        );

                        wrapper.classList.remove(
                            "open"
                        );

                    }
                );

                menu.appendChild(item);

            }
        );

        button.addEventListener(
            "click",
            function () {

                const isOpen =
                    wrapper.classList.contains(
                        "open"
                    );

                document
                    .querySelectorAll(
                        ".vendor-filter-custom.open"
                    )
                    .forEach(function (item) {

                        item.classList.remove(
                            "open"
                        );

                    });

                if (!isOpen) {

                    wrapper.classList.add(
                        "open"
                    );

                }

            }
        );

        select.addEventListener(
            "change",
            syncSelection
        );

        wrapper.appendChild(button);
        wrapper.appendChild(menu);
        syncSelection();

        document.addEventListener(
            "click",
            function (event) {

                if (!wrapper.contains(event.target)) {

                    wrapper.classList.remove(
                        "open"
                    );

                }

            }
        );

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
            vendor => {

                const originalIndex =
                    vendors.indexOf(vendor);


                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "vendor-card";


                const company = companyName(vendor);
                const systemCount = supportedSystemCount(vendor);
                const logo = vendorLogo(vendor, company);
                const systemName = usableCardValue(
                    vendor.systemName || vendor.displayName
                );
                const systemSubtitle = usableCardValue(vendor.displaySubtitle);
                const primaryContact = cardContactSummary(
                    usableCardValue(vendor.vendorPoc) ||
                    usableCardValue(vendor.aagItsPoc)
                );
                const phone = cardContactSummary(vendor.phone);
                const email = cardContactSummary(vendor.email);
                const phoneTarget = contactTarget(vendor.phone, "phone");
                const emailTarget = contactTarget(vendor.email, "email");
                const team = usableCardValue(vendor.aagItsTeam) ||
                    usableCardValue(vendor.category) ||
                    "Department not listed";
                card.innerHTML = `
                    <header class="vendor-card-header">
                        <div class="vendor-logo-frame">
                            <img class="vendor-logo" src="${logo.src}" alt="${escapeHtml(logo.alt)}" loading="lazy">
                        </div>
                        <div class="vendor-card-heading">
                            <h3 class="vendor-company-name" title="${escapeHtml(company)}">
                                ${escapeHtml(company)}
                            </h3>
                            <div class="vendor-system-count" aria-label="${systemCount} supported ${systemCount === 1 ? "system" : "systems"}">
                                <span class="vendor-system-count-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3.5" y="4" width="7" height="6.5" rx="1"/><rect x="13.5" y="4" width="7" height="6.5" rx="1"/><rect x="3.5" y="13.5" width="7" height="6.5" rx="1"/><rect x="13.5" y="13.5" width="7" height="6.5" rx="1"/></svg></span>
                                <strong>${systemCount}</strong>
                                <span>${systemCount === 1 ? "Supported System" : "Supported Systems"}</span>
                            </div>
                            <p class="vendor-system-summary">
                                ${escapeHtml(systemName)}${systemSubtitle && systemSubtitle !== systemName ? ` · ${escapeHtml(systemSubtitle)}` : ""}
                            </p>
                        </div>
                        <div class="vendor-card-badges" aria-label="Vendor status and support availability">
                            <span class="vendor-status-badge vendor-status-badge-status active"><i aria-hidden="true"></i>Active</span>
                            <span class="vendor-status-badge vendor-status-badge-availability"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></svg>24x7</span>
                        </div>
                    </header>

                    <section class="vendor-primary-contact" aria-label="Primary contact">
                        <span class="vendor-card-label"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.4-4 2.7-6 7-6s6.6 2 7 6"/></svg>Primary Contact</span>
                        <p class="vendor-primary-contact-text">${primaryContact ? escapeHtml(primaryContact) : '<span class="vendor-contact-missing">No primary contact listed</span>'}</p>
                    </section>

                    <div class="vendor-card-contacts">
                        <div class="vendor-contact-line"><span class="vendor-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 16.4v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.7 2 2 0 0 1 3.1 1.5h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L7 9.2a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 2 2.3Z"/></svg></span>${phoneTarget ? `<a href="${escapeHtml(phoneTarget)}">${phone ? escapeHtml(phone) : "Call vendor"}</a>` : `<span>${phone || "Phone not listed"}</span>`}</div>
                        <div class="vendor-contact-line"><span class="vendor-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></svg></span>${emailTarget ? `<a href="${escapeHtml(emailTarget)}">${email ? escapeHtml(email) : "Email vendor"}</a>` : `<span>${email || "Email not listed"}</span>`}</div>

                    <footer class="vendor-card-footer">
                        <span class="vendor-team" title="${escapeHtml(team)}"><span class="vendor-team-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M3 20h18M5 20V7h14v13M9 10h2m2 0h2m-6 4h2m2 0h2M9 20v-3h6v3M8 7V4h8v3"/></svg></span><span>${escapeHtml(team)}</span></span>
                        <button class="vendor-view" type="button" data-index="${originalIndex}">
                            View Details <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg>
                        </button>
                    </footer>
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


        detailSupportedSystems.innerHTML =
            displayValue(
                supportedSystems(vendor).join("\n")
            );


        detailStatusSupport.innerHTML =
            displayValue([
                vendor.status,
                vendor.supportAvailability || vendor.supportSchedule || vendor.supportHours
            ].filter(Boolean).join("\n") || "No status or support schedule recorded.");


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

            categoryFilter.dispatchEvent(
                new Event("change")
            );

            teamFilter.dispatchEvent(
                new Event("change")
            );

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
    setupCustomFilter(categoryFilter);
    setupCustomFilter(teamFilter);

    calculateStats();

    renderVendors();

})();
