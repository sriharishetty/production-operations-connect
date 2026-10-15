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


    /* ========================================================
       VENDOR DETAIL MODAL ELEMENTS
       ======================================================== */

    const vendorModal =
        document.getElementById("vendorModal");

    const vendorModalClose =
        document.getElementById("vendorModalClose");

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

    let currentVendor = null;


    /* ========================================================
       ESCAPE HTML
       ======================================================== */

    function escapeHtml(value) {

        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* ========================================================
       DISPLAY VALUE (for modal fields)
       ======================================================== */

    function displayValue(value) {

        const text = String(value || "").trim();

        if (!text || /^(?:n\/?a|tbd|none|no)$/i.test(text)) {
            return "—";
        }

        return escapeHtml(text);

    }


    /* ========================================================
       VENDOR HELPER FUNCTIONS (same logic as Vendors page)
       ======================================================== */

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


    function initials(company) {
        return String(company || "")
            .split(/\s+/)
            .map(part => part.charAt(0).toUpperCase())
            .filter(Boolean)
            .slice(0, 2)
            .join("") || "V";
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
        '<path d="M12 3v4m0 10v4M3 12h4m10 0h4M5.6 5.6l2.8 2.8m7.2 7.2l2.8 2.8m0-12.8-2.8 2.8m-7.2 7.2-2.8 2.8"></path><circle cx="12" cy="12" r="3"></circle>'
    ];


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

                    if (
                        typeof item === "object" &&
                        item !== null
                    ) {

                        id =
                            item.id ||
                            item.applicationId ||
                            item.name;

                    }

                    if (!id) {
                        return;
                    }

                    let normalized =
                        String(id)
                            .toLowerCase()
                            .trim();

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

        localStorage.setItem(
            "favorites",
            JSON.stringify(favorites)
        );

        localStorage.setItem(
            "productionOperationsFavorites",
            JSON.stringify(favorites)
        );

    }


    /* ========================================================
       GET APPLICATION OBJECTS
       ======================================================== */

    function getFavoriteApplications() {

        const favoriteIds = getFavorites();

        return applications.filter(function (app) {

            return favoriteIds.includes(
                app.id
            );

        });

    }


    function getFavoriteVendors() {

        const favoriteIds = getFavorites();

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
            favoriteCount.textContent = total;
        }

        if (activeFavoriteCount) {
            activeFavoriteCount.textContent = total;
        }

        if (criticalFavoriteCount) {
            criticalFavoriteCount.textContent = critical;
        }

        if (favoritesCount) {
            favoritesCount.textContent = total;
        }

    }


    /* ========================================================
       VENDOR DETAIL MODAL
       ======================================================== */

    function openVendorModal(vendor) {

        currentVendor = vendor;

        modalIcon.innerHTML = vendorIcon(vendor);

        modalTitle.textContent =
            vendor.displayName || "Vendor";

        modalCompany.textContent =
            vendor.company || vendor.vendor || "";

        modalSubtitle.textContent =
            vendor.displaySubtitle ||
            "Production Operations vendor information";

        detailSystem.innerHTML =
            displayValue(vendor.systemName || vendor.displayName);

        detailSupportedSystems.innerHTML =
            displayValue(supportedSystems(vendor).join("\n"));

        detailStatusSupport.innerHTML =
            displayValue([
                vendor.status,
                vendor.supportAvailability ||
                    vendor.supportSchedule ||
                    vendor.supportHours
            ].filter(Boolean).join("\n") ||
                "No status or support schedule recorded.");

        detailCategory.innerHTML =
            displayValue(vendor.category);

        detailCompany.innerHTML =
            displayValue(vendor.company || vendor.vendor);

        detailTeam.innerHTML =
            displayValue(vendor.aagItsTeam);

        detailVendorPoc.innerHTML =
            displayValue(vendor.vendorPoc);

        detailAagPoc.innerHTML =
            displayValue(vendor.aagItsPoc);

        detailPhone.innerHTML =
            displayValue(vendor.phone);

        detailEmail.innerHTML =
            displayValue(vendor.email);

        detailEscalation.innerHTML =
            displayValue(vendor.escalation);

        detailSourceRow.innerHTML =
            displayValue(vendor.sourceRow);

        detailUpdatedDate.innerHTML =
            displayValue(vendor.updatedDate);

        detailUpdatedBy.innerHTML =
            displayValue(vendor.updatedBy);

        detailApprovedDate.innerHTML =
            displayValue(vendor.approvedDate);

        detailApprovedBy.innerHTML =
            displayValue(vendor.approvedBy);

        vendorModal.classList.add("active");
        vendorModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        resetModalTabs();
        updateVendorFavoriteButton();
    }


    function closeVendorModal() {

        if (!vendorModal) return;

        vendorModal.classList.remove("active");
        vendorModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        currentVendor = null;
    }


    function resetModalTabs() {

        document
            .querySelectorAll(".vendor-modal-tab")
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.tab === "overview"
                );

            });

        document
            .querySelectorAll(".vendor-tab-panel")
            .forEach(panel => {

                panel.classList.toggle(
                    "active",
                    panel.dataset.panel === "overview"
                );

            });

    }


    function updateVendorFavoriteButton() {

        if (!currentVendor || !vendorFavoriteButton) {
            return;
        }

        try {
            const saved =
                JSON.parse(
                    localStorage.getItem(
                        "productionOpsVendorFavorites"
                    )
                ) || [];

            const key =
                currentVendor.id ||
                String(currentVendor.sourceRow);

            const isFavorite = saved.includes(key);

            vendorFavoriteButton.classList.toggle("active", isFavorite);

            vendorFavoriteButton.textContent =
                isFavorite
                    ? "★ Remove from Favorites"
                    : "☆ Add to Favorites";
        } catch (error) {
            // Ignore storage errors
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
                ? searchInput.value.trim().toLowerCase()
                : "";

        let filteredFavorites = allFavorites;

        if (searchText) {

            filteredFavorites =
                allFavorites.filter(function (app) {

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

                });
        }

        updateStats();

        if (allFavorites.length === 0) {

            favoritesGrid.innerHTML = "";

            if (emptyState) {
                emptyState.style.display = "flex";
            }

            if (noResults) {
                noResults.style.display = "none";
            }

            return;
        }

        if (searchText && filteredFavorites.length === 0) {

            favoritesGrid.innerHTML = "";

            if (emptyState) {
                emptyState.style.display = "none";
            }

            if (noResults) {
                noResults.style.display = "flex";
            }

            return;
        }

        if (emptyState) {
            emptyState.style.display = "none";
        }

        if (noResults) {
            noResults.style.display = "none";
        }

        favoritesGrid.innerHTML =
            filteredFavorites
                .map(function (app) {

                    const isVendor =
                        vendors.includes(app);

                    if (isVendor) {
                        return renderVendorCard(app);
                    }

                    return renderApplicationCard(app);

                })
                .join("");

        attachFavoriteEvents();

    }


    /* ========================================================
       RENDER VENDOR CARD (same design as Vendors page)
       ======================================================== */

    function renderVendorCard(vendor) {

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

        return `
            <article
                class="vendor-card"
                data-id="${escapeHtml(vendor.id)}"
                data-type="vendor"
            >

                <header class="vendor-card-header">
                    <div class="vendor-logo-frame">
                        <img
                            class="vendor-logo"
                            src="${logo.src}"
                            alt="${escapeHtml(logo.alt)}"
                            loading="lazy"
                        >
                    </div>
                    <div class="vendor-card-heading">
                        <h3 class="vendor-company-name" title="${escapeHtml(company)}">
                            ${escapeHtml(company)}
                        </h3>
                        <div class="vendor-system-count" aria-label="${systemCount} supported ${systemCount === 1 ? "system" : "systems"}">
                            <span class="vendor-system-count-icon" aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                    <rect x="3.5" y="4" width="7" height="6.5" rx="1"/>
                                    <rect x="13.5" y="4" width="7" height="6.5" rx="1"/>
                                    <rect x="3.5" y="13.5" width="7" height="6.5" rx="1"/>
                                    <rect x="13.5" y="13.5" width="7" height="6.5" rx="1"/>
                                </svg>
                            </span>
                            <strong>${systemCount}</strong>
                            <span>${systemCount === 1 ? "Supported System" : "Supported Systems"}</span>
                        </div>
                        <p class="vendor-system-summary">
                            ${escapeHtml(systemName)}${systemSubtitle && systemSubtitle !== systemName ? ` · ${escapeHtml(systemSubtitle)}` : ""}
                        </p>
                    </div>
                    <div class="vendor-card-badges" aria-label="Vendor status and support availability">
                        <span class="vendor-status-badge vendor-status-badge-status active"><i aria-hidden="true"></i>Active</span>
                        <span class="vendor-status-badge vendor-status-badge-availability">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <circle cx="12" cy="12" r="8.5"/>
                                <path d="M12 7v5l3.5 2"/>
                            </svg>
                            24x7
                        </span>
                    </div>
                </header>

                <section class="vendor-primary-contact" aria-label="Primary contact">
                    <span class="vendor-card-label">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="12" cy="8" r="3.5"/>
                            <path d="M5 20c.4-4 2.7-6 7-6s6.6 2 7 6"/>
                        </svg>
                        Primary Contact
                    </span>
                    <p class="vendor-primary-contact-text">
                        ${primaryContact ? escapeHtml(primaryContact) : '<span class="vendor-contact-missing">No primary contact listed</span>'}
                    </p>
                </section>

                <div class="vendor-card-contacts">
                    <div class="vendor-contact-line">
                        <span class="vendor-contact-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path d="M21 16.4v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.7 2 2 0 0 1 3.1 1.5h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L7 9.2a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 2 2.3Z"/>
                            </svg>
                        </span>
                        ${phoneTarget
                            ? `<a href="${escapeHtml(phoneTarget)}">${phone ? escapeHtml(phone) : "Call vendor"}</a>`
                            : `<span>${phone || "Phone not listed"}</span>`}
                    </div>
                    <div class="vendor-contact-line">
                        <span class="vendor-contact-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <rect x="2.5" y="4.5" width="19" height="15" rx="2"/>
                                <path d="m3.5 6 8.5 7 8.5-7"/>
                            </svg>
                        </span>
                        ${emailTarget
                            ? `<a href="${escapeHtml(emailTarget)}">${email ? escapeHtml(email) : "Email vendor"}</a>`
                            : `<span>${email || "Email not listed"}</span>`}
                    </div>
                </div>

                <footer class="vendor-card-footer">
                    <span class="vendor-team" title="${escapeHtml(team)}">
                        <span class="vendor-team-icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                                <path d="M3 20h18M5 20V7h14v13M9 10h2m2 0h2m-6 4h2m2 0h2M9 20v-3h6v3M8 7V4h8v3"/>
                            </svg>
                        </span>
                        <span>${escapeHtml(team)}</span>
                    </span>
                    <button
                        class="vendor-view favorite-details"
                        type="button"
                        data-id="${escapeHtml(vendor.id)}"
                        data-type="vendor"
                    >
                        View Details
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M4 12h15m-6-6 6 6-6 6"/>
                        </svg>
                    </button>
                </footer>

                <button
                    type="button"
                    class="favorite-remove"
                    data-id="${escapeHtml(vendor.id)}"
                    title="Remove from Favorites"
                    aria-label="Remove ${escapeHtml(company)} from Favorites"
                >
                    ★
                </button>

            </article>
        `;
    }


    /* ========================================================
       RENDER APPLICATION CARD (existing design)
       ======================================================== */

    function renderApplicationCard(app) {

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

        const iconMarkup = `
            <img
                src="${app.icon || ""}"
                alt="${escapeHtml(name)}"
            >
        `;

        return `
            <article
                class="favorite-card"
                data-id="${escapeHtml(app.id)}"
                data-type="application"
            >

                <div class="favorite-card-main">

                    <div class="favorite-icon">
                        ${iconMarkup}
                    </div>

                    <div class="favorite-content">

                        <div class="favorite-card-heading">

                            <div>

                                <h3>${escapeHtml(name)}</h3>

                                <p>${escapeHtml(description)}</p>

                            </div>

                        </div>

                        <div class="favorite-card-meta">

                            <span>${escapeHtml(app.category || "")}</span>

                            <span>
                                SLA: ${escapeHtml(app.response || app.sla || "")}
                            </span>

                        </div>

                    </div>

                    <span
                        class="favorite-severity ${severityClass}"
                    >
                        ${app.severity}
                    </span>

                    <button
                        type="button"
                        class="favorite-remove"
                        data-id="${escapeHtml(app.id)}"
                        title="Remove from Favorites"
                        aria-label="Remove ${escapeHtml(name)} from Favorites"
                    >
                        ★
                    </button>

                </div>

                <div class="favorite-card-footer">

                    <span>${escapeHtml(app.category || "")}</span>

                    <button
                        type="button"
                        class="favorite-details"
                        data-id="${escapeHtml(app.id)}"
                        data-type="application"
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

                        const id = button.dataset.id;
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

                        const id = button.dataset.id;
                        const type = button.dataset.type;

                        if (type === "vendor") {

                            const vendor =
                                vendors.find(function (item) {

                                    return item.id === id;

                                });

                            if (vendor) {
                                openVendorModal(vendor);
                            }

                            return;

                        }

                        const app =
                            applications.find(
                                function (item) {

                                    return item.id === id;

                                }
                            );

                        if (!app) {
                            return;
                        }

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
            favorites.filter(function (favoriteId) {

                return favoriteId !== id;

            });

        saveFavorites(updatedFavorites);

        renderFavorites();

    }


    /* ========================================================
       MODAL EVENT LISTENERS
       ======================================================== */

    if (vendorModalClose) {

        vendorModalClose.addEventListener(
            "click",
            closeVendorModal
        );

    }

    if (vendorModal) {

        vendorModal.addEventListener(
            "click",
            function (event) {

                if (event.target === vendorModal) {
                    closeVendorModal();
                }

            }
        );

    }

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                vendorModal &&
                vendorModal.classList.contains("active")
            ) {

                closeVendorModal();

            }

        }
    );


    /* ========================================================
       VENDOR MODAL ACTIONS
       ======================================================== */

    if (vendorEmailButton) {

        vendorEmailButton.addEventListener(
            "click",
            function () {

                if (
                    currentVendor &&
                    currentVendor.email &&
                    currentVendor.email !== "No"
                ) {

                    window.location.href =
                        "mailto:" + currentVendor.email;

                }

            }
        );

    }

    if (vendorCallButton) {

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

    }

    if (vendorFavoriteButton) {

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
                    String(currentVendor.sourceRow);

                const index = favorites.indexOf(key);

                if (index === -1) {

                    favorites.push(key);

                } else {

                    favorites.splice(index, 1);

                }

                saveFavorites(favorites);

                updateVendorFavoriteButton();
                renderFavorites();

            }
        );

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

                if (favorites.length === 0) {
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

                        localStorage.removeItem(key);

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
   FAVORITES (shared functions for other pages)
   ============================================================ */

const FAVORITES_KEY = "productionOperationsFavorites";

function getFavorites() {
    try {
        return JSON.parse(
            localStorage.getItem(FAVORITES_KEY)
        ) || [];
    } catch (error) {
        return [];
    }
}

function saveFavorites(favorites) {
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
}

function isFavorite(applicationId) {
    return getFavorites().some(
        item => (typeof item === "string" ? item : item.id) === applicationId
    );
}

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
