// https://stackoverflow.com/a/24152886
function randomInteger(rangeArray) {
  return Math.floor(Math.random() * (rangeArray[1] - rangeArray[0] + 1)) + rangeArray[0];
}


function getColorVariants(inputColor, hueVariance, satVariance, lumVariance) {

    colorSquares = document.getElementsByClassName("colorGridSquare")
    console.log(colorSquares)
    computedColorValuesArray = []

    let inputHue = /(?<=hsl\()[^,]+(?=,)/gm.exec(inputColor) // Get Hue value from hsl input
    let inputSat = /(?<=, )[^,]+(?=%,)/gm.exec(inputColor) // Get Saturation value from hsl input
    let inputLum = /(?<=%, )[^,]+(?=%)/gm.exec(inputColor) // Get Luminance value from hsl input

    // Regex matching method returns object with unneeded extra info, so get first value of the object,
    // Which is whatever the regex matched

    inputHue = Object.values(inputHue)[0]
    inputSat = Object.values(inputSat)[0]
    inputLum = Object.values(inputLum)[0]

    console.log(inputColor, inputHue, inputSat, inputLum)

    let hueRandomNumberRange = [Number(inputHue) + Number(hueVariance), Number(inputHue) - Number(hueVariance)]
    let satRandomNumberRange = [Number(inputSat) + Number(satVariance), Number(inputSat) - Number(satVariance)]
    let lumRandomNumberRange = [Number(inputLum) + Number(lumVariance), Number(inputLum) - Number(lumVariance)]

    console.log(hueRandomNumberRange, satRandomNumberRange, lumRandomNumberRange)

    let correctColorIndex = randomInteger([1, 9])

    console.log(correctColorIndex)

    for (let x = 1; x <= 9; x++) {
        if (correctColorIndex-1 == x) {
            console.log("loop index matched correct square index")
            correctSquare = console.log(colorSquares[x-1])
            correctSquare.style.setProperty("backgroundColor", inputColor)
        }

        else {

            let adjustedHueValue = randomInteger(hueRandomNumberRange)
            let adjustedSatValue = randomInteger(satRandomNumberRange)
            let adjustedLumValue = randomInteger(lumRandomNumberRange)

            satReplaced = inputColor.replace(/(?<=, )[^,]+(?=%,)/gm, satVariance)
            lumReplaced = satReplaced.replace(/(?<=%, )[^,]+(?=%)/gm, lumVariance)
            hueReplaced = lumReplaced.replace(/(?<=hsl\()[^,]+(?=,)/gm, hueVariance)
            computedColorValuesArray.push(hueReplaced)
        }
    }
    // console.log(hueReplaced)
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
        getColorVariants("hsl(100, 100%, 50%)", 5, 5, 5)
    }
})