document.addEventListener("DOMContentLoaded", () => {

    if (page == "homepage"){

        let randomLightHSL = "hsl(" + Math.random()*255 +", 90%, 90%)"
        document.body.style.setProperty("background-color", randomLightHSL)

        Object.values(document.getElementsByTagName("a")).forEach(element => {
            randomDarkHSL = "hsl(" + Math.random()*255 + ", 90%, 20%)"
            element.style.setProperty("background-color", randomDarkHSL)
        });

    }

    if (page == "gamePage") {

    }
})