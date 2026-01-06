// https://stackoverflow.com/a/24152886
function randomInteger(rangeArray) {
  return Math.floor(Math.random() * (rangeArray[1] - rangeArray[0] + 1)) + rangeArray[0];
}


function getColorVariants(inputColor, hueVarianceMin, hueVarianceMax, satVarianceMin, satVarianceMax, lumVarianceMin, lumVarianceMax) {

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

    let hueRandomNumberRange = [hueVarianceMin + Number(inputHue), hueVarianceMax + Number(inputHue)]
    let satRandomNumberRange = [satVarianceMin + Number(inputSat), satVarianceMax + Number(inputSat)]
    let lumRandomNumberRange = [lumVarianceMin + Number(inputLum), lumVarianceMax + Number(inputLum)]

    console.log(hueRandomNumberRange, satRandomNumberRange, lumRandomNumberRange)

    let correctColorIndex = randomInteger([1,9])

    console.log(correctColorIndex)

    for (let x = 1; x <= 9; x++) {
        // console.log(`loop ${x}`)
        if (correctColorIndex == x) {
            correctSquare = document.getElementsByClassName(`div${x}`)
            correctSquare = Object.values(correctSquare)[0]
            correctSquare.style.backgroundColor = inputColor
        }

        else {

            let adjustedHueValue = randomInteger(hueRandomNumberRange) % 255
            let adjustedSatValue = randomInteger(satRandomNumberRange)
            adjustedSatValue > 100 ? adjustedSatValue : 100
            let adjustedLumValue = randomInteger(lumRandomNumberRange) % 100

            satReplaced = inputColor.replace(/(?<=, )[^,]+(?=%,)/gm, adjustedSatValue)
            lumReplaced = satReplaced.replace(/(?<=%, )[^,]+(?=%)/gm, adjustedLumValue)
            hueReplacedFinalColor = lumReplaced.replace(/(?<=hsl\()[^,]+(?=,)/gm, adjustedHueValue)

            squareToColor = document.getElementsByClassName(`div${x}`)
            squareToColor = Object.values(squareToColor)[0]
            squareToColor.style.backgroundColor = hueReplacedFinalColor
        }
    }
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
        setTimeout(() => {
            getColorVariants("hsl(100, 100%, 50%)", 15, 80, -5, -50, 10, 10)
        }, 20);
        // document.body.style.backgroundColor = "hsl(100, 100%, 50%)"
    }
})