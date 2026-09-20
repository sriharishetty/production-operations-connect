/* Keep exactly one sidebar item active, based on the current page and hash. */
(() => {
    const normalizePath = pathname => pathname.replace(/\\/g, "/").replace(/\/$/, "").toLowerCase();
    const links = [...document.querySelectorAll(".sidebar .nav-item[href]")];

    if (!links.length) return;

    const updateActiveItem = () => {
        const current = new URL(window.location.href);
        const currentPath = normalizePath(current.pathname);

        links.forEach(link => link.classList.remove("active"));

        const matchingPage = links.filter(link => normalizePath(new URL(link.href, current.href).pathname) === currentPath);
        const exactHash = matchingPage.find(link => new URL(link.href, current.href).hash === current.hash);
        const plainPage = matchingPage.find(link => !new URL(link.href, current.href).hash);
        const activeLink = exactHash || plainPage || matchingPage[0];

        if (activeLink) activeLink.classList.add("active");
    };

    updateActiveItem();
    window.addEventListener("hashchange", updateActiveItem);
})();
