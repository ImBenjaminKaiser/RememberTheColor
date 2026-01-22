let correctColorIndex = 0

// https://stackoverflow.com/a/24152886
function randomInteger(rangeArray) {
  return Math.floor(Math.random() * (rangeArray[1] - rangeArray[0] + 1)) + rangeArray[0];
}

function randomIntegerBetweenRanges(rangeArray) {
    arrayChoice = Math.random() < 0.5
    return arrayChoice == true ? randomInteger([rangeArray[0],rangeArray[1]]) : randomInteger([rangeArray[2],rangeArray[3]])
}


async function replaceTextForCountdown(secondsRemaining, durationTotal) {

    await setTimeout(() => {
        let span = document.getElementById("secondsRemaining")
        span.textContent = secondsRemaining
        console.log(`${secondsRemaining} remaining`)
        if (secondsRemaining == 0) {
            console.log("finished countdown")
            swapStages()
        }
        }, (1000*Math.abs((secondsRemaining + 1)-durationTotal)))
}

async function doCountdown(durationInSeconds) {
    let durationTotal = durationInSeconds+1
    let i = durationInSeconds+1
    let span = document.getElementById("secondsRemaining")
    if (getComputedStyle(span).display !== "none") {
        while (i >= 0) {
            await replaceTextForCountdown(i, durationTotal).then(i--)
        }
    }
}

function swapStages() {
    let memorizeStage = document.getElementById("memorizeStage")
    let pickStage = document.getElementById("pickStage")
    setTimeout(() => {
        if (memorizeStage.style.display !== "none" ) {
            console.log("swapping to pic stage")
            memorizeStage.style.display = "none"
            pickStage.style.display = "flex"
            let currentHSLValue = localStorage.getItem("currentHSLValue")
            setColorVariants(currentHSLValue, [15, 40], [5, 50], [10, 30])
            initializeMemorizePhaseWithoutCountDown([0, 360], [50, 90], [30, 70])
        }
        else if (pickStage.style.display == "flex") {
            console.log("swapping to memorize stage")
            memorizeStage.style.display = "flex"
            pickStage.style.display = "none"
            let currentHSLValue = localStorage.getItem("currentHSLValue")
            setColorVariants(currentHSLValue, [15, 40], [5, 50], [10, 30])
            let currentScore = localStorage.getItem("score")
            console.log("current score:")
            console.log(typeof currentScore)
            currentScore = Number(currentScore) + 1
            document.getElementById("score").textContent = currentScore
            localStorage.setItem("score", currentScore)
            doCountdown(3)
        }
    }, 10);

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
    doCountdown(3)
}

function initializeMemorizePhaseWithoutCountDown([hueMax, hueMin], [satMax, satMin], [lumMax, lumMin]) {
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
        console.log(`loop ${x}`)
        if (correctColorIndex == x) {
            console.log("correct square index reached")
            correctSquare = document.getElementsByClassName(`div${x}`)
            correctSquare = Object.values(correctSquare)[0]
            correctSquare.style.backgroundColor = inputColor
        }

        else {

            let adjustedHueValue = Math.abs(randomIntegerBetweenRanges(hueRandomNumberRange) % 255)
            let adjustedSatValue = Math.abs(randomIntegerBetweenRanges(satRandomNumberRange))
            adjustedSatValue > 100 ? adjustedSatValue = 100 : adjustedSatValue
            let adjustedLumValue = Math.abs(randomIntegerBetweenRanges(lumRandomNumberRange) % 100)
            adjustedLumValue < 20 ? adjustedLumValue = 20 : adjustedLumValue

            satReplaced = inputColor.replace(/(?<=, )[^,]+(?=%,)/gm, adjustedSatValue)
            lumReplaced = satReplaced.replace(/(?<=%, )[^,]+(?=%)/gm, adjustedLumValue)
            hueReplacedFinalColor = lumReplaced.replace(/(?<=hsl\()[^,]+(?=,)/gm, adjustedHueValue)

            squareToColor = document.getElementsByClassName(`div${x}`)
            squareToColor = Object.values(squareToColor)[0]
            console.log(hueReplacedFinalColor)
            squareToColor.style.backgroundColor = hueReplacedFinalColor
        }
    }
}

function processUserInput(currentColorGridSquare) {
    correctColorIndex = localStorage.getItem("correctColorIndexLocalStorageItem")
    // console.log(currentColorGridSquare)
    // console.log(correctColorIndex)
    if (correctColorIndex == currentColorGridSquare) {
        console.log("correct square");
        console.log("currentColorGridSquare ==> ", currentColorGridSquare);
        console.log("correctColorIndex ==> ", correctColorIndex);
        swapStages()
        // initializeMemorizePhase([0, 360], [50, 90], [30, 70])
    }
    else {
        console.log("incorrect")
        let highScore = localStorage.getItem("score")
        alert(`Incorrect! Your score was ${highScore}`)
        window.location = "homepage.html"
    }
}

function initializeEventListeners() {

    let colorGridSquaresObject = document.querySelectorAll("div.colorGridSquare")
    // console.log(colorGridSquaresObject)

    for (i = 0; i < Object.values(colorGridSquaresObject).length; i++) {

        let currentColorGridSquare = colorGridSquaresObject[i]

        currentColorGridSquare.addEventListener("click", () => {
            console.log("click")
            processUserInput(currentColorGridSquare.id)
        })

        // console.log(`target: ${event.target.id}`)
        // console.log(currentColorGridSquare)

    };
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded")
    if (page == "homepage"){
        console.log("on homepage")
        let randomLightHSL = "hsl(" + Math.random()*255 +", 90%, 90%)"
        homepage = document.getElementById("homepage")
        homepage.style.backgroundColor = randomLightHSL

        // Object.values(document.getElementsByTagName("a")).forEach(element => {
        //     randomDarkHSL = "hsl(" + Math.random()*255 + ", 90%, 20%)"
        //     element.style.setProperty("background-color", randomDarkHSL)
        // });

    }

    else if (page == "gamePage") {
        setTimeout(() => {
            localStorage.setItem("score", 0)
            initializeMemorizePhase([0, 360], [50, 90], [30, 70])
            initializeEventListeners(localStorage.getItem("correctColorIndex"))
        }, 20);

    }
})