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

        const applications = [

            {
                id: "acars",
                name: "ACARS",
                description:
                    "Aircraft Communications Addressing and Reporting System",
                icon:
                    "public/applications/acars.png",
                severity:
                    "Critical",
                status:
                    "Operational",
                vendor:
                    "SITA"
            },

            {
                id: "wam",
                name: "WAM",
                description:
                    "Weight and Balance Management",
                icon:
                    "public/applications/wam.png",
                severity:
                    "High",
                status:
                    "Operational",
                vendor:
                    "Smart4Aviation"
            },

            {
                id: "jetplan",
                name: "JetPlan",
                description:
                    "Flight Planning System",
                icon:
                    "public/applications/jetplan.png",
                severity:
                    "Critical",
                status:
                    "Operational",
                vendor:
                    "Jeppesen"
            },

            {
                id: "s4a",
                name: "S4A",
                description:
                    "Smart4Aviation Weight and Balance",
                icon:
                    "public/applications/s4a.png",
                severity:
                    "High",
                status:
                    "Operational",
                vendor:
                    "Smart4Aviation"
            },

            {
                id: "jcte",
                name: "JCTE",
                description:
                    "Crew Tracking / JCTE",
                icon:
                    "public/applications/jcte.png",
                severity:
                    "Medium",
                status:
                    "Operational",
                vendor:
                    "Jeppesen"
            },

            {
                id: "airtrack",
                name: "AirTrack",
                description:
                    "Aircraft Tracking",
                icon:
                    "public/applications/airtrack.png",
                severity:
                    "Low",
                status:
                    "Operational",
                vendor:
                    "AirTrack"
            },

            {
                id: "pilot-briefing",
                name: "Pilot Briefing",
                description:
                    "Pilot briefing application",
                icon:
                    "public/applications/pilot-briefing.png",
                severity:
                    "High",
                status:
                    "Operational",
                vendor:
                    "Production Operations"
            },

            {
                id: "aircraft-maintenance",
                name: "Aircraft Maintenance",
                description:
                    "Aircraft maintenance systems",
                icon:
                    "public/applications/aircraft-maintenance.png",
                severity:
                    "Medium",
                status:
                    "Operational",
                vendor:
                    "Production Operations"
            },

            {
                id: "aims",
                name: "AIMS",
                description:
                    "Airline Information Management System",
                icon:
                    "public/applications/aims.png",
                severity:
                    "Critical",
                status:
                    "Operational",
                vendor:
                    "AIMS"
            }

        ];


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
            vendors.length;


        document.getElementById(
            "dataVendorCount"
        ).textContent =
            vendors.length;


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