/* ============================================================
   PRODUCTION OPERATIONS CONNECT
   REPORTS JAVASCRIPT
   ============================================================ */


document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* ====================================================
           APPLICATION DATA
           ==================================================== */

        const applications = Object.values(window.masterData.applications);
        const vendorRecords = window.masterData.vendors;


        /* ====================================================
           ELEMENTS
           ==================================================== */

        const applicationList =
            document.getElementById(
                "applicationList"
            );

        const vendorList =
            document.getElementById(
                "vendorList"
            );


        /* ====================================================
           COUNT APPLICATIONS
           ==================================================== */

        const totalApplications =
            applications.length;


        const criticalApplications =
            applications.filter(
                function (app) {

                    return (
                        app.severity === "Critical"
                    );

                }
            ).length;


        const activeApplications =
            applications.filter(
                function (app) {

                    return (
                        app.status === "Operational"
                    );

                }
            ).length;


        /* ====================================================
           UPDATE STATISTICS
           ==================================================== */

        document.getElementById(
            "totalApplications"
        ).textContent =
            totalApplications;


        document.getElementById(
            "criticalApplications"
        ).textContent =
            criticalApplications;


        document.getElementById(
            "activeApplications"
        ).textContent =
            activeApplications;


        /* ====================================================
           SEVERITY COUNTS
           ==================================================== */

        const severityCounts = {

            Critical: 0,
            High: 0,
            Medium: 0,
            Low: 0

        };


        applications.forEach(
            function (app) {

                if (
                    severityCounts[
                        app.severity
                    ] !== undefined
                ) {

                    severityCounts[
                        app.severity
                    ]++;

                }

            }
        );


        document.getElementById(
            "criticalCount"
        ).textContent =
            severityCounts.Critical;


        document.getElementById(
            "highCount"
        ).textContent =
            severityCounts.High;


        document.getElementById(
            "mediumCount"
        ).textContent =
            severityCounts.Medium;


        document.getElementById(
            "lowCount"
        ).textContent =
            severityCounts.Low;


        /* ====================================================
           SEVERITY BARS
           ==================================================== */

        const total =
            applications.length;


        function percentage(value) {

            if (!total) {
                return 0;
            }

            return (
                value /
                total *
                100
            );

        }


        document.getElementById(
            "criticalBar"
        ).style.width =
            percentage(
                severityCounts.Critical
            ) + "%";


        document.getElementById(
            "highBar"
        ).style.width =
            percentage(
                severityCounts.High
            ) + "%";


        document.getElementById(
            "mediumBar"
        ).style.width =
            percentage(
                severityCounts.Medium
            ) + "%";


        document.getElementById(
            "lowBar"
        ).style.width =
            percentage(
                severityCounts.Low
            ) + "%";


        /* ====================================================
           RENDER APPLICATIONS
           ==================================================== */

        if (applicationList) {

            applicationList.innerHTML =
                applications
                    .map(
                        function (app) {

                            return `

                                <div
                                    class="application-row"
                                >

                                    <div
                                        class="application-row-icon"
                                    >

                                        <img
                                            src="${app.icon}"
                                            alt="${app.name}"
                                            onerror="
                                                this.style.display='none';
                                            "
                                        >

                                    </div>


                                    <div
                                        class="application-row-name"
                                    >

                                        <strong>
                                            ${app.name}
                                        </strong>

                                        <span>
                                            ${app.description}
                                        </span>

                                    </div>


                                    <span
                                        class="
                                            health-status
                                            ${app.status
                                                .toLowerCase()
                                                .replace(
                                                    /\s+/g,
                                                    "-"
                                                )}
                                        "
                                    >
                                        ${app.status}
                                    </span>


                                    <span
                                        class="
                                            row-severity
                                            ${app.severity
                                                .toLowerCase()}
                                        "
                                    >
                                        ${app.severity}
                                    </span>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }


        /* ====================================================
           VENDOR INSIGHTS
           ==================================================== */

        const vendorMap = {};


        applications.forEach(
            function (app) {

                const vendor =
                    app.vendor ||
                    "Unassigned";


                if (
                    !vendorMap[vendor]
                ) {

                    vendorMap[vendor] = [];

                }


                vendorMap[vendor].push(
                    app.name
                );

            }
        );


        const vendors =
            Object.keys(vendorMap)
                .sort(
                    function (a, b) {

                        return (
                            vendorMap[b].length -
                            vendorMap[a].length
                        );

                    }
                );


        document.getElementById(
            "vendorCount"
        ).textContent =
            vendorRecords.length;


        document.getElementById(
            "dataVendorCount"
        ).textContent =
            vendorRecords.length;


        if (vendorList) {

            vendorList.innerHTML =
                vendors
                    .map(
                        function (vendor, index) {

                            const apps =
                                vendorMap[vendor];


                            return `

                                <div
                                    class="vendor-row"
                                >

                                    <div
                                        class="vendor-rank"
                                    >
                                        ${String(
                                            index + 1
                                        ).padStart(
                                            2,
                                            "0"
                                        )}
                                    </div>


                                    <div
                                        class="vendor-info"
                                    >

                                        <strong>
                                            ${vendor}
                                        </strong>

                                        <span>
                                            ${apps.length}
                                            application${apps.length === 1 ? "" : "s"}
                                            •
                                            ${apps.join(", ")}
                                        </span>

                                    </div>

                                </div>

                            `;

                        }
                    )
                    .join("");

        }


        /* ====================================================
           REPORT PAGE READY
           ==================================================== */

        document.body.classList.add(
            "reports-ready"
        );


    }
);