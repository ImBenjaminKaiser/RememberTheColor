let correctColorIndex = 0

// https://stackoverflow.com/a/24152886
function randomInteger(rangeArray) {
  return Math.floor(Math.random() * (rangeArray[1] - rangeArray[0] + 1)) + rangeArray[0];
}

function randomIntegerBetweenRanges(rangeArray) {
    arrayChoice = Math.random() < 0.5
    return arrayChoice == true ? randomInteger([rangeArray[0],rangeArray[1]]) : randomInteger([rangeArray[2],rangeArray[3]])
}

function manageCountdown(durationInSeconds) {
    let span = document.getElementById("secondsRemaining")
    console.log(span)
    for (x = 0; x < durationInSeconds; x++) {
        setTimeout( () => {
            span.innerText = x
        }, 1000);
    }
}

function generateRandomHSLValueBetweenRanges([hueMax, hueMin], [satMax, satMin], [lumMax, lumMin]) {
    let computedHue = randomInteger([hueMax, hueMin])
    let computedSat = randomInteger([satMax, satMin])
    let computedLum = randomInteger([lumMax, lumMin])
    return `hsl(${computedHue}, ${computedSat}%, ${computedLum}%)`
}

function initializeMemorizePhase([hueMax, hueMin], [satMax, satMin], [lumMax, lumMin]) {
    let rememberColorDiv = document.getElementById("rememberThisColor")
    // console.log(rememberColorDiv)
    let randomHSL = generateRandomHSLValueBetweenRanges([hueMax, hueMin], [satMax, satMin], [lumMax, lumMin])
    console.log(randomHSL)
    localStorage.setItem("currentHSLValue", randomHSL)
    rememberColorDiv.style.backgroundColor = randomHSL
}

function setColorVariants(inputColor, [hueVarianceMin, hueVarianceMax], [satVarianceMin, satVarianceMax], [lumVarianceMin, lumVarianceMax]) {

    colorSquares = document.getElementsByClassName("colorGridSquare")
    // console.log(colorSquares)
    computedColorValuesArray = []

    let inputHue = /(?<=hsl\()[^,]+(?=,)/gm.exec(inputColor) // Get Hue value from hsl input
    let inputSat = /(?<=, )[^,]+(?=%,)/gm.exec(inputColor) // Get Saturation value from hsl input
    let inputLum = /(?<=%, )[^,]+(?=%)/gm.exec(inputColor) // Get Luminance value from hsl input

    // Regex matching method returns object with unneeded extra info, so get first value of the object,
    // Which is whatever the regex matched

    inputHue = Object.values(inputHue)[0]
    inputSat = Object.values(inputSat)[0]
    inputLum = Object.values(inputLum)[0]

    // console.log(inputColor, inputHue, inputSat, inputLum)

    let hueRandomNumberRange = [hueVarianceMin + Number(inputHue), hueVarianceMax + Number(inputHue), hueVarianceMin - Number(inputHue), hueVarianceMax - Number(inputHue)]
    let satRandomNumberRange = [satVarianceMin + Number(inputSat), satVarianceMax + Number(inputSat), satVarianceMin - Number(inputSat), hueVarianceMax - Number(inputSat)]
    let lumRandomNumberRange = [lumVarianceMin + Number(inputLum), lumVarianceMax + Number(inputLum), lumVarianceMin - Number(inputLum), hueVarianceMax - Number(inputLum)]

    // console.log(hueRandomNumberRange, satRandomNumberRange, lumRandomNumberRange)

    correctColorIndex = randomInteger([1,9])
    localStorage.setItem("correctColorIndexLocalStorageItem", correctColorIndex)

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

function processUserInput(currentColorGridSquare) {
    correctColorIndex = localStorage.getItem("correctColorIndexLocalStorageItem")
    // console.log(currentColorGridSquare)
    // console.log(correctColorIndex)
    if (correctColorIndex == currentColorGridSquare) {
        console.log("correct square clicked")
    }
    else {
        console.log("incorrect square")
    }
}

function initializeEventListeners() {

    let colorGridSquaresObject = document.querySelectorAll("div.colorGridSquare")
    // console.log(colorGridSquaresObject)

    for (i = 0; i < Object.values(colorGridSquaresObject).length; i++) {

        let currentColorGridSquare = colorGridSquaresObject[i]

        currentColorGridSquare.addEventListener("click", () => {
            processUserInput(currentColorGridSquare.id)
        })

        // console.log(`target: ${event.target.id}`)
        // console.log(currentColorGridSquare)

    };
}


document.addEventListener("DOMContentLoaded", () => {

    if (page == "homepage"){

        let randomLightHSL = "hsl(" + Math.random()*255 +", 90%, 90%)"
        document.body.style.setProperty("background-color", randomLightHSL)

        // Object.values(document.getElementsByTagName("a")).forEach(element => {
        //     randomDarkHSL = "hsl(" + Math.random()*255 + ", 90%, 20%)"
        //     element.style.setProperty("background-color", randomDarkHSL)
        // });

    }

    if (page == "gamePage") {
        setTimeout(() => {
            initializeMemorizePhase([0, 360], [50, 90], [30, 70])
            manageCountdown()
            setColorVariants("hsl(100, 100%, 50%)", [15, 40], [-5, -50], [10, 30])

            initializeEventListeners(localStorage.getItem("correctColorIndex"))
        }, 20);
        // document.body.style.backgroundColor = "hsl(100, 100%, 50%)"
    }
})