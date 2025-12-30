
function getColorVariants(inputColor, hueVariance, SaturationVariance, LuminanceVariance) {
    satReplaced = inputColor.replace(/(?<=, )[^,]+(?=%,)/gm, SaturationVariance)
    lumReplaced = satReplaced.replace(/(?<=%, )[^,]+(?=%)/gm, LuminanceVariance)
    hueReplaced = lumReplaced.replace(/(?<=hsl\()[^,]+(?=,)/gm, hueVariance)

    console.log(hueReplaced)
}

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
        getColorVariants("hsl(100, 100%, 50%)", "replace", "5", "5")
    }
})