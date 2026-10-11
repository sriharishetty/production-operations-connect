(function () {
    "use strict";

    const records = window.masterData.applications;
    const applications = window.groundStopApplicationKeys
        .map(key => ({ key, record: records[key] || Object.values(records).find(app => app.id === key) }))
        .filter(item => item.record);
    const grid = document.getElementById("groundStopGrid");
    const totalStat = document.getElementById("groundStopTotalStat");
    const activeStat = document.getElementById("groundStopActiveStat");
    const highSeverityStat = document.getElementById("groundStopHighSeverityStat");
    const averageSlaStat = document.getElementById("groundStopAverageSlaStat");
    const resultCount = document.getElementById("groundStopResultCount");
    const searchInput = document.getElementById("groundStopSearch");
    const gridButton = document.getElementById("groundStopGridButton");
    const listButton = document.getElementById("groundStopListButton");
    const emptyState = document.getElementById("groundStopEmpty");
    const dialog = document.getElementById("groundStopDialog");
    const dialogIcon = document.getElementById("groundStopDialogIcon");
    const dialogTitle = document.getElementById("groundStopDialogTitle");
    const dialogDescription = document.getElementById("groundStopDialogDescription");
    const dialogSeverity = document.getElementById("groundStopSeverity");
    const dialogStatus = document.getElementById("groundStopStatus");
    const dialogBody = document.getElementById("groundStopDialogBody");
    const dialogClose = document.getElementById("groundStopDialogClose");
    const emailAction = document.getElementById("groundStopEmailAction");
    const callAction = document.getElementById("groundStopCallAction");
    const favoriteAction = document.getElementById("groundStopFavoriteAction");
    const tabs = [...dialog.querySelectorAll("[data-detail-tab]")];
    const favoriteKeys = ["favorites", "productionOperationsFavorites", "favoriteApplications"];
    let selectedApplication = null;
    let lastTrigger = null;
    let previousBodyOverflow = "";

    const documentTypes = [
        ["Application Support Guide", ["applicationSupportGuideUrl", "supportGuideUrl"]],
        ["Escalation Procedure", ["escalationProcedureUrl", "escalationUrl"]],
        ["Operational Runbook", ["operationalRunbookUrl", "runbookUrl"]],
        ["Vendor Support Information", ["vendorSupportUrl", "supportInformationUrl"]]
    ];

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function valueText(value) {
        if (Array.isArray(value)) return value.map(valueText).join("\n\n");
        if (value && typeof value === "object") return JSON.stringify(value, null, 2);
        return String(value ?? "").trim();
    }

    function present(value) {
        const text = valueText(value);
        return text && !/^(?:n\/?a|none)$/i.test(text) ? text : "Not specified";
    }

    function linkedText(value, type) {
        const text = valueText(value);
        const pattern = type === "email"
            ? /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
            : /\+?\d[\d\s().-]{5,}\d/g;
        let output = "";
        let position = 0;

        for (const match of text.matchAll(pattern)) {
            const value = match[0];
            const index = match.index;
            const target = type === "email"
                ? `mailto:${value}`
                : `tel:${value.replace(/[^\d+]/g, "")}`;

            output += escapeHtml(text.slice(position, index));
            output += `<a href="${escapeHtml(target)}">${escapeHtml(value)}</a>`;
            position = index + value.length;
        }

        return output + escapeHtml(text.slice(position));
    }

    function hasContactTarget(value, type) {
        const text = valueText(value);
        if (!text || /^(?:n\/?a|none|no|tbd)$/i.test(text)) return false;
        const pattern = type === "email"
            ? /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
            : /\+?\d[\d\s().-]{5,}\d/;
        return pattern.test(text);
    }

    function cardContact(value, type) {
        const text = valueText(value);
        if (!hasContactTarget(text, type)) {
            return '<span class="ground-stop-contact-unavailable">Not available</span>';
        }

        const pattern = type === "email"
            ? /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
            : /\+?\d[\d\s().-]{5,}\d/g;
        const contacts = [...new Set(text.match(pattern) || [])];

        return contacts.map(contact => {
            const target = type === "email"
                ? `mailto:${contact}`
                : `tel:${contact.replace(/[^\d+]/g, "")}`;
            return `<a href="${escapeHtml(target)}">${escapeHtml(contact)}</a>`;
        }).join(" · ");
    }

    function favoriteValues() {
        const values = [];

        favoriteKeys.forEach(key => {
            try {
                const stored = JSON.parse(localStorage.getItem(key) || "[]");
                if (Array.isArray(stored)) values.push(...stored);
            } catch {
                // Ignore invalid legacy favorite values.
            }
        });

        return [...new Set(values.map(value => {
            if (value && typeof value === "object") {
                return value.id || value.applicationId || value.appId || value.name;
            }
            return value;
        }).filter(Boolean).map(String))];
    }

    function isFavorite(application) {
        const identities = [application.key, application.record.id, application.record.name]
            .filter(Boolean)
            .map(value => String(value).toLowerCase());

        return favoriteValues().some(value => identities.includes(value.toLowerCase()));
    }

    function toggleFavorite(application) {
        const favorites = favoriteValues();
        const identities = [application.record.name, application.record.id, application.key]
            .filter(Boolean)
            .map(value => String(value).toLowerCase());
        const existing = favorites.some(value => identities.includes(value.toLowerCase()));
        const updated = existing
            ? favorites.filter(value => !identities.includes(value.toLowerCase()))
            : [...favorites, application.record.name];

        favoriteKeys.forEach(key => localStorage.setItem(key, JSON.stringify(updated)));
        return !existing;
    }

    function updateCardFavoriteButtons() {
        grid.querySelectorAll("[data-favorite-key]").forEach(button => {
            const application = applications.find(item => item.key === button.dataset.favoriteKey);
            if (!application) return;

            const favorite = isFavorite(application);
            button.classList.toggle("active", favorite);
            button.setAttribute("aria-pressed", String(favorite));
            button.setAttribute("aria-label", `${favorite ? "Remove" : "Add"} ${application.record.name} ${favorite ? "from" : "to"} Favorites`);
        });
    }

    function responseMinutes(value) {
        return [...valueText(value).matchAll(/(\d+(?:\.\d+)?)\s*(minutes?|mins?|hours?|hrs?)/gi)]
            .map(([, amount, unit]) => /hour|hr/i.test(unit) ? Number(amount) * 60 : Number(amount));
    }

    function updateDashboardStats() {
        const activeCount = applications.filter(({ record }) =>
            /^(?:operational|active|available)$/i.test(valueText(record.status))
        ).length;
        const highCount = applications.filter(({ record }) =>
            /^(?:critical|high)$/i.test(valueText(record.severity))
        ).length;
        const criticalResponseTimes = applications
            .filter(({ record }) => /^critical$/i.test(valueText(record.severity)))
            .flatMap(({ record }) => responseMinutes(record.response));
        const responseTimes = criticalResponseTimes.length
            ? criticalResponseTimes
            : applications.flatMap(({ record }) => responseMinutes(record.response));
        const average = responseTimes.length
            ? responseTimes.reduce((total, minutes) => total + minutes, 0) / responseTimes.length
            : null;

        totalStat.textContent = applications.length;
        activeStat.textContent = activeCount;
        highSeverityStat.textContent = highCount;
        averageSlaStat.textContent = average === null
            ? "Not specified"
            : `${Number.isInteger(average) ? average : average.toFixed(1)} min`;
    }

    function searchableText(record) {
        return [
            record.name,
            record.function,
            record.description,
            record.category,
            record.vendor,
            record.phone,
            record.email,
            record.severity,
            record.aagTeam,
            record.supportModel
        ].map(valueText).join(" ").toLowerCase();
    }

    function setViewMode(mode) {
        const isList = mode === "list";
        grid.classList.toggle("list-view", isList);
        gridButton.classList.toggle("active", !isList);
        listButton.classList.toggle("active", isList);
        gridButton.setAttribute("aria-pressed", String(!isList));
        listButton.setAttribute("aria-pressed", String(isList));
    }

    function updateFavoriteButton() {
        const favorite = selectedApplication && isFavorite(selectedApplication);
        favoriteAction.classList.toggle("active", Boolean(favorite));
        favoriteAction.innerHTML = favorite
            ? '<span aria-hidden="true">★</span><span>Remove from Favorites</span>'
            : '<span aria-hidden="true">☆</span><span>Add to Favorites</span>';
        favoriteAction.setAttribute("aria-pressed", String(Boolean(favorite)));
        updateCardFavoriteButtons();
    }

    function setActionLink(link, value, type, label) {
        const text = valueText(value);
        const pattern = type === "email"
            ? /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
            : /\+?\d[\d\s().-]{5,}\d/g;
        const targets = [...new Set(text.match(pattern) || [])];
        const href = targets.length
            ? `${type === "email" ? "mailto:" : "tel:"}${type === "email" ? targets.join(",") : targets[0].replace(/[^\d+]/g, "")}`
            : "";

        link.textContent = label;
        if (href) {
            link.href = href;
            link.removeAttribute("aria-disabled");
            link.removeAttribute("tabindex");
        } else {
            link.removeAttribute("href");
            link.setAttribute("aria-disabled", "true");
            link.setAttribute("tabindex", "-1");
        }
    }

    function detailsRows(entries) {
        return entries.map(([label, value]) => `
            <div class="ground-stop-info-row">
                <dt>${escapeHtml(label)}</dt>
                <dd>${escapeHtml(present(value))}</dd>
            </div>
        `).join("");
    }

    function overviewContent(app) {
        const record = app.record;
        const description = valueText(record.description);

        return `
            <section class="ground-stop-detail-panel">
                <h3>Application Details</h3>
                <dl class="ground-stop-info-grid">${detailsRows([
                    ["Application Name", record.name],
                    ["Function", record.function],
                    ["Category", record.category],
                    ["Vendor", record.vendor],
                    ["Environment", record.environment],
                    ["Business Criticality", record.criticality]
                ])}</dl>
            </section>
            <section class="ground-stop-detail-panel">
                <h3>Severity &amp; Status</h3>
                <dl class="ground-stop-info-grid">${detailsRows([
                    ["Severity", record.severity],
                    ["Current Status", record.status],
                    ["Response Target", record.response],
                    ["Support Model", record.supportModel]
                ])}</dl>
            </section>
            <section class="ground-stop-detail-panel ground-stop-detail-panel-wide">
                <h3>Description</h3>
                <p class="ground-stop-full-text">${escapeHtml(present(description))}</p>
            </section>
            <section class="ground-stop-detail-panel ground-stop-detail-panel-wide">
                <h3>Key Information</h3>
                <dl class="ground-stop-info-grid">${detailsRows([
                    ["Primary Vendor", record.vendor],
                    ["ITS Team", record.aagTeam],
                    ["Last Updated", record.lastUpdated || record.updatedDate || record.infoUpdatedDate]
                ])}</dl>
            </section>
        `;
    }

    function contactsContent(app) {
        const record = app.record;
        const email = valueText(record.email);
        const phone = valueText(record.phone);

        return `
            <section class="ground-stop-detail-panel ground-stop-detail-panel-wide">
                <h3>Operational Contacts</h3>
                <div class="ground-stop-contact-grid">
                    <article class="ground-stop-contact-card"><h4>Vendor</h4><p>${escapeHtml(present(record.vendor))}</p><div>${escapeHtml(present(record.vendorPOC))}</div></article>
                    <article class="ground-stop-contact-card"><h4>AAG ITS POC</h4><p>${escapeHtml(present(record.aagPOC))}</p><div>${escapeHtml(present(record.aagTeam))}</div></article>
                    <article class="ground-stop-contact-card"><h4>Phone</h4><p>${phone === "Not specified" ? phone : linkedText(phone, "phone")}</p><div>${escapeHtml(present(record.phoneNote))}</div></article>
                    <article class="ground-stop-contact-card"><h4>Email</h4><p>${email === "Not specified" ? email : linkedText(email, "email")}</p></article>
                </div>
            </section>
        `;
    }

    function supportContent(app) {
        const record = app.record;
        const targets = [
            ["Severity", record.severity, "Recorded application severity"],
            ["Response", record.response, "Recorded response target"],
            ["Resolution", record.resolution, "Recorded resolution target"],
            ["Escalation", record.escalation, "Recorded escalation information"]
        ];

        return `
            <section class="ground-stop-detail-panel ground-stop-detail-panel-wide">
                <h3>SLA &amp; Support Targets</h3>
                <div class="ground-stop-sla-grid">${targets.map(([label, value, description]) => `
                    <article class="ground-stop-sla-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(present(value))}</strong><small>${escapeHtml(description)}</small></article>
                `).join("")}</div>
            </section>
            <section class="ground-stop-detail-panel ground-stop-detail-panel-wide">
                <h3>Support Model</h3>
                <p class="ground-stop-full-text">${escapeHtml(present(record.supportModel))}</p>
                <p class="ground-stop-full-text ground-stop-support-description">${escapeHtml(present(record.supportDescription))}</p>
            </section>
        `;
    }

    function escalationContent(app) {
        const steps = app.record.escalationSteps;
        const procedure = valueText(app.record.escalation);

        if (Array.isArray(steps) && steps.length) {
            return `
                <section class="ground-stop-detail-panel ground-stop-detail-panel-wide">
                    <h3>Escalation Process</h3>
                    <ol class="ground-stop-escalation-list">${steps.map(step => `<li>${escapeHtml(valueText(step))}</li>`).join("")}</ol>
                    ${procedure && !/^(?:tbd|n\/?a)$/i.test(procedure) ? `<p class="ground-stop-full-text ground-stop-escalation-note">${escapeHtml(procedure)}</p>` : ""}
                </section>
            `;
        }

        return procedure && !/^(?:tbd|n\/?a)$/i.test(procedure)
            ? `<section class="ground-stop-detail-panel ground-stop-detail-panel-wide"><h3>Escalation Process</h3><p class="ground-stop-full-text">${escapeHtml(procedure)}</p></section>`
            : '<section class="ground-stop-detail-panel ground-stop-detail-panel-wide"><h3>Escalation Process</h3><p class="ground-stop-empty-message">Escalation procedure not available.</p></section>';
    }

    function documentContent(app) {
        const record = app.record;
        const rows = documentTypes.map(([title, keys]) => {
            const url = keys.map(key => record[key]).find(value => typeof value === "string" && value.trim());
            const validUrl = url && /^(?:https?:\/\/|\/|\.\.?\/)/i.test(url.trim());

            return `
                <div class="ground-stop-document-row">
                    <span class="ground-stop-document-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6zM14 3v5h5M9 13h6m-6 4h6"/></svg></span>
                    <strong>${escapeHtml(title)}</strong>
                    ${validUrl ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">Open <span aria-hidden="true">→</span></a>` : '<span class="ground-stop-document-unavailable">Not available</span>'}
                </div>
            `;
        });

        return `<section class="ground-stop-detail-panel ground-stop-detail-panel-wide"><h3>Application Documents</h3><div class="ground-stop-document-list">${rows.join("")}</div></section>`;
    }

    function renderTab(tabName) {
        const content = {
            overview: overviewContent,
            contacts: contactsContent,
            support: supportContent,
            escalation: escalationContent,
            documents: documentContent
        }[tabName](selectedApplication);

        dialogBody.innerHTML = content;
        const activeTab = tabs.find(tab => tab.dataset.detailTab === tabName);
        dialogBody.setAttribute("aria-labelledby", activeTab.id);
    }

    function activateTab(tab, moveFocus = false) {
        tabs.forEach(item => {
            const active = item === tab;
            item.setAttribute("aria-selected", String(active));
            item.tabIndex = active ? 0 : -1;
        });
        renderTab(tab.dataset.detailTab);
        if (moveFocus) tab.focus();
    }

    function renderCards() {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = query
            ? applications.filter(({ record }) => searchableText(record).includes(query))
            : applications;

        grid.innerHTML = filtered.map(({ key, record }) => {
            const severity = present(record.severity);
            const severityClass = severity.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const description = valueText(record.description || record.function);
            const vendor = present(record.vendor);
            const shortName = key === "wam"
                ? "WAM"
                : key === "Smart4Aviation (S4A)"
                    ? "S4A"
                    : record.name;
            const response = valueText(record.response);
            const sla = response && !/^(?:tbd|n\/?a|none)$/i.test(response)
                ? response
                : "Not specified";
            const favorite = isFavorite({ key, record });

            return `
            <article class="ground-stop-card">
                <div class="ground-stop-card-logo"><img src="${escapeHtml(record.icon)}" alt="" loading="lazy"></div>
                <div class="ground-stop-card-content">
                    <header class="ground-stop-card-top">
                        <div class="ground-stop-card-title-group">
                            <h2 title="${escapeHtml(record.name)}">${escapeHtml(shortName)}</h2>
                            <p class="ground-stop-card-description" title="${escapeHtml(description)}">${escapeHtml(description || "Not available")}</p>
                        </div>
                        <div class="ground-stop-card-actions">
                            <span class="ground-stop-card-severity ${escapeHtml(severityClass)}">${escapeHtml(severity)}</span>
                            <button class="ground-stop-card-favorite${favorite ? " active" : ""}" type="button" data-favorite-key="${escapeHtml(key)}" aria-label="${favorite ? "Remove" : "Add"} ${escapeHtml(record.name)} ${favorite ? "from" : "to"} Favorites" aria-pressed="${favorite}">
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9z"/></svg>
                            </button>
                        </div>
                    </header>
                    <div class="ground-stop-card-meta">
                        <div class="ground-stop-card-meta-row">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16.4v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.7 2 2 0 0 1 3.1 1.5h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L7 9.2a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7a2 2 0 0 1 2 2.3Z"/></svg>
                            <p title="${escapeHtml(valueText(record.phone))}">${cardContact(record.phone, "phone")}</p>
                        </div>
                        <div class="ground-stop-card-meta-row">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3.5 6 8.5 7 8.5-7"/></svg>
                            <p title="${escapeHtml(valueText(record.email))}">${cardContact(record.email, "email")}</p>
                        </div>
                    </div>
                    <footer class="ground-stop-card-footer">
                        <div class="ground-stop-card-footer-info">
                            <span class="ground-stop-card-vendor" title="${escapeHtml(vendor)}">${escapeHtml(vendor)}</span>
                            <span class="ground-stop-card-sla" title="SLA: ${escapeHtml(sla)}"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/></svg>SLA: ${escapeHtml(sla)}</span>
                        </div>
                        <button type="button" class="ground-stop-details-button" data-app-key="${escapeHtml(key)}">View Details <span aria-hidden="true">→</span></button>
                    </footer>
                </div>
            </article>
        `;
        }).join("");
        resultCount.textContent = `(${filtered.length})`;
        emptyState.hidden = filtered.length !== 0;
    }

    function openDetails(key, trigger) {
        selectedApplication = applications.find(item => item.key === key);
        if (!selectedApplication) return;

        const record = selectedApplication.record;
        lastTrigger = trigger;
        dialogIcon.src = record.icon || "";
        dialogTitle.textContent = record.name || "Application";
        dialogDescription.textContent = present(record.description || record.function);
        dialogSeverity.textContent = present(record.severity);
        dialogStatus.textContent = present(record.status);
        setActionLink(emailAction, record.email, "email", "Send Email");
        setActionLink(callAction, record.phone, "phone", "Call Support");
        activateTab(tabs[0]);
        updateFavoriteButton();
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        dialog.showModal();
        tabs[0].focus();
    }

    grid.addEventListener("click", event => {
        const favoriteButton = event.target.closest("[data-favorite-key]");
        if (favoriteButton) {
            const application = applications.find(item => item.key === favoriteButton.dataset.favoriteKey);
            if (application) {
                toggleFavorite(application);
                updateCardFavoriteButtons();
                if (selectedApplication?.key === application.key) updateFavoriteButton();
            }
            return;
        }

        const button = event.target.closest("[data-app-key]");
        if (button) openDetails(button.dataset.appKey, button);
    });

    searchInput.addEventListener("input", renderCards);
    gridButton.addEventListener("click", () => setViewMode("grid"));
    listButton.addEventListener("click", () => setViewMode("list"));

    dialogClose.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", event => {
        if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", () => {
        document.body.style.overflow = previousBodyOverflow;
        if (lastTrigger?.isConnected) lastTrigger.focus();
        selectedApplication = null;
    });

    tabs.forEach(tab => {
        tab.addEventListener("click", () => activateTab(tab));
        tab.addEventListener("keydown", event => {
            const current = tabs.indexOf(tab);
            let next = null;
            if (event.key === "ArrowRight") next = tabs[(current + 1) % tabs.length];
            if (event.key === "ArrowLeft") next = tabs[(current - 1 + tabs.length) % tabs.length];
            if (event.key === "Home") next = tabs[0];
            if (event.key === "End") next = tabs[tabs.length - 1];
            if (next) {
                event.preventDefault();
                activateTab(next, true);
            }
        });
    });

    favoriteAction.addEventListener("click", () => {
        if (!selectedApplication) return;
        toggleFavorite(selectedApplication);
        updateFavoriteButton();
    });

    updateDashboardStats();
    renderCards();
}());