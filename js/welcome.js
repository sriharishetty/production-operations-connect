const getStartedButton =
    document.getElementById("getStartedButton");


getStartedButton.addEventListener(
    "click",
    function () {

        getStartedButton.classList.add(
            "loading"
        );

        getStartedButton.querySelector(
            "span:first-child"
        ).textContent = "LOADING...";


        setTimeout(function () {

            document.body.classList.add("page-is-leaving");
            setTimeout(function () {
                window.location.href = "home.html";
            }, 180);

        }, 700);

    }
);
