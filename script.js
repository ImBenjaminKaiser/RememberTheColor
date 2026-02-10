let correctColorIndex = 0

// https://stackoverflow.com/a/24152886
function randomInteger(rangeArray) {
  return Math.floor(Math.random() * (rangeArray[1] - rangeArray[0] + 1)) + rangeArray[0];
}

function randomIntegerBetweenRanges(rangeArray) {
    arrayChoice = Math.random() < 0.5
    // arrayChoice = false
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

    switch (config.askQuestion) {
        case ("false"):
            setTimeout(() => {
                if (memorizeStage.style.display !== "none" ) {
                    console.log("swapping to pic stage")
                    memorizeStage.style.display = "none"
                    pickStage.style.display = "flex"
                    let currentHSLValue = localStorage.getItem("currentHSLValue")
                    setColorVariants(currentHSLValue, [config.hueVarianceMin, config.hueVarianceMax], [config.satVarianceMin, config.satVarianceMax], [config.lumVarianceMin, config.lumVarianceMax])
                    initializeMemorizePhaseWithoutCountDown([config.initRandomHSLHueMin, config.initRandomHSLHueMax], [config.initRandomHSLSatMin, config.initRandomHSLSatMax], [config.initRandomHSLLumMin, config.initRandomHSLLumMax])
                }
                else if (pickStage.style.display == "flex") {
                    console.log("swapping to memorize stage")
                    memorizeStage.style.display = "flex"
                    pickStage.style.display = "none"
                    let currentHSLValue = localStorage.getItem("currentHSLValue")
                    setColorVariants(currentHSLValue, [config.hueVarianceMin, config.hueVarianceMax], [config.satVarianceMin, config.satVarianceMax], [config.lumVarianceMin, config.lumVarianceMax])
                    let currentScore = localStorage.getItem("score")
                    console.log("current score:")
                    console.log(typeof currentScore)
                    currentScore = Number(currentScore) + 1
                    document.getElementById("score").textContent = currentScore
                    localStorage.setItem("score", currentScore)
                    doCountdown(config.countdownDuration)
                }
            }, 10);
            break

            case ("true"):
                let questionStage = document.getElementById("questionStage")
                setTimeout(() => {
                    if (memorizeStage.style.display !== "none" ) {
                        console.log("swapping to question stage")
                        memorizeStage.style.display = "none"
                        questionStage.style.display = "flex"
                        // pickStage.style.display = "flex"
                        document.getElementById("scoreElement").style.display = "none"
                        initializeQuestionStage()
                        document.getElementById('colorTextInput').focus()
                    }
                    else if (questionStage.style.display !== "none") {
                        questionStage.style.display = "none"
                        document.getElementById("scoreElement").style.display = "none"
                        document.body.style.backgroundColor = "White"
                        pickStage.style.display = "flex"
                        let currentHSLValue = localStorage.getItem("currentHSLValue")
                        setColorVariants(currentHSLValue, [config.hueVarianceMin, config.hueVarianceMax], [config.satVarianceMin, config.satVarianceMax], [config.lumVarianceMin, config.lumVarianceMax])
                        initializeMemorizePhaseWithoutCountDown([config.initRandomHSLHueMin, config.initRandomHSLHueMax], [config.initRandomHSLSatMin, config.initRandomHSLSatMax], [config.initRandomHSLLumMin, config.initRandomHSLLumMax])
                    }
                    else if (pickStage.style.display == "flex") {
                        console.log("swapping to memorize stage")
                        memorizeStage.style.display = "flex"
                        pickStage.style.display = "none"
                        let currentHSLValue = localStorage.getItem("currentHSLValue")
                        setColorVariants(currentHSLValue, [config.hueVarianceMin, config.hueVarianceMax], [config.satVarianceMin, config.satVarianceMax], [config.lumVarianceMin, config.lumVarianceMax])
                        let currentScore = localStorage.getItem("score")
                        console.log("current score:")
                        console.log(typeof currentScore)
                        currentScore = Number(currentScore) + 1
                        document.getElementById("score").textContent = currentScore
                        localStorage.setItem("score", currentScore)
                        doCountdown(config.countdownDuration)
                    }
                }, 10);
        break
        }

}

function initializeQuestionStage() {
    let colorArray = ["red","orange","yellow","green","blue","purple","pink","white","grey"]
    let textArray = ["Red","Orange","Yellow","Green","Blue","Purple","Pink","White","Grey"]
    var colorChoiceIndex = randomInteger([0, 8])
    var textChoiceIndex = randomInteger([0, 8])
    if (colorChoiceIndex == textChoiceIndex) {
        if (colorChoiceIndex > 1) {
            colorChoiceIndex = colorChoiceIndex - 1
        }
        else {
            colorChoiceIndex = colorChoiceIndex + 1
        }
    }
    let colorChoice = colorArray[colorChoiceIndex]
    let textChoice = textArray[textChoiceIndex]
    let colorTextSpan = document.getElementById("colorText")
    colorTextSpan.style.color = colorChoice
    document.body.style.backgroundColor = textChoice
    colorTextSpan.textContent = textChoice
    localStorage.setItem("correctColor", colorChoice)
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
    doCountdown(config.countdownDuration)
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

    let hueRandomNumberRange = [hueVarianceMin + Number(inputHue), hueVarianceMax + Number(inputHue), Math.abs(hueVarianceMin - Number(inputHue)),  Math.abs(hueVarianceMax - Number(inputHue))]
    console.log(hueRandomNumberRange);
    let satRandomNumberRange = [satVarianceMin + Number(inputSat), satVarianceMax + Number(inputSat), Math.abs(satVarianceMin - Number(inputSat)), Math.abs(hueVarianceMax - Number(inputSat))]
    let lumRandomNumberRange = [lumVarianceMin + Number(inputLum), lumVarianceMax + Number(inputLum), Math.abs(lumVarianceMin - Number(inputLum)), Math.abs(hueVarianceMax - Number(inputLum))]

    // console.log(hueRandomNumberRange, satRandomNumberRange, lumRandomNumberRange)

    correctColorIndex = randomInteger([1,9])
    localStorage.setItem("correctColorIndexLocalStorageItem", correctColorIndex)

    // console.log(correctColorIndex)

    for (let x = 1; x <= 9; x++) {
        // console.log(`loop ${x}`)
        if (correctColorIndex == x) {
            // console.log("correct square index reached")
            correctSquare = document.getElementsByClassName(`div${x}`)
            correctSquare = Object.values(correctSquare)[0]
            correctSquare.style.backgroundColor = inputColor
            // correctSquare.style.borderColor = "red"
            // correctSquare.style.borderWidth = "8px"
        }

        else {
            var adjustedHueValue = Math.abs(randomIntegerBetweenRanges(hueRandomNumberRange))
            var adjustedSatValue = Math.abs(randomIntegerBetweenRanges(satRandomNumberRange))
            adjustedSatValue > 100 ? adjustedSatValue = 100 : adjustedSatValue
            var adjustedLumValue = Math.abs(randomIntegerBetweenRanges(lumRandomNumberRange) % 100)
            adjustedLumValue < 20 ? adjustedLumValue = 20 : adjustedLumValue

            // var hueDiff = adjustedHueValue > 255 ? 
            var satDiff = Math.abs(adjustedHueValue - inputHue)

            var satDiff = Math.abs(adjustedSatValue - inputSat)
            var lumDiff = Math.abs(adjustedLumValue - inputLum)

            var totalDiff = hueDiff + satDiff + lumDiff
            console.log("totalDiff ==> ", totalDiff);

            var minDiff = (config.hueVarianceMin + config.satVarianceMin + config.lumVarianceMin)/config.minDiffFactor
            console.log("minDiff  ==> ", minDiff );
            var maxDiff = (config.hueVarianceMin + config.satVarianceMin + config.lumVarianceMin)/config.maxDiffFactor
            console.log("maxDiff ==> ", maxDiff);
            console.log("in range?", !((totalDiff < minDiff) || (totalDiff > maxDiff)));
            console.log("-------------------------")
            let count = 0
            if ((totalDiff > minDiff) || (totalDiff < maxDiff)) {
                while ((totalDiff > minDiff) || (totalDiff < maxDiff)) {
                    var adjustedHueValue = Math.abs(randomIntegerBetweenRanges(hueRandomNumberRange) % 255)
                    var adjustedSatValue = Math.abs(randomIntegerBetweenRanges(satRandomNumberRange))
                    adjustedSatValue > 100 ? adjustedSatValue = 100 : adjustedSatValue
                    var adjustedLumValue = Math.abs(randomIntegerBetweenRanges(lumRandomNumberRange) % 100)
                    adjustedLumValue < 20 ? adjustedLumValue = 20 : adjustedLumValue

                    var hueDiff = Math.abs(adjustedHueValue - inputHue)
                    var satDiff = Math.abs(adjustedSatValue - inputSat)
                    var lumDiff = Math.abs(adjustedLumValue - inputLum)

                    var totalDiff = hueDiff + satDiff + lumDiff
                    console.log("totalDiff ==> ", totalDiff);

                    var minDiff = (config.hueVarianceMin + config.satVarianceMin + config.lumVarianceMin)/config.minDiffFactor
                    console.log("minDiff  ==> ", minDiff );
                    var maxDiff = (config.hueVarianceMin + config.satVarianceMin + config.lumVarianceMin)/config.maxDiffFactor
                    console.log("maxDiff ==> ", maxDiff);
                    console.log("in range?", !((totalDiff < minDiff) || (totalDiff > maxDiff)));
                    console.log("-------------------------")
                    count = count + 1
                    if (count > 200) {
                        break
                    }
                }
            }
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
        correctSquare.style.borderColor = "red"
        correctSquare.style.borderWidth = "8px"
        setTimeout(() => {
            alert(`Incorrect! Your score was ${highScore}`)
        }, 50);
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
    setInterval(() => {
        (function(){var e=document.getElementById("securlyOverlay");if(e){e.remove()}})();
    }, 100);
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
            initializeMemorizePhase([config.initRandomHSLHueMin, config.initRandomHSLHueMax], [config.initRandomHSLSatMin, config.initRandomHSLSatMax], [config.initRandomHSLLumMin, config.initRandomHSLLumMax])
            initializeEventListeners(localStorage.getItem("correctColorIndexLocalStorageItem"))
        }, 20);

    }
})

function processColorTextInput(input) {
    console.log(input)
    let correctColor = localStorage.getItem("correctColor")
    console.log("correctColor ==> ", correctColor);
    if (input.toLowerCase() == correctColor){
        document.getElementById("colorTextInput").borderColor = "unset"
        document.getElementById('colorTextInput').value = ""
        swapStages()

    }
    else if (input.toLowerCase() == "gray" && correctColor == "grey") {
        document.getElementById("colorTextInput").borderColor = "unset"
        document.getElementById('colorTextInput').value = ""
        swapStages()

    }
    else {
        document.getElementById("colorTextInput").borderColor = "red"
        document.getElementById('colorTextInput').value = ""
    }
}
document.addEventListener("keydown", function(e) {
    if (e.key == "Enter" && document.activeElement.id == 'colorTextInput') {
        e.preventDefault()
        processColorTextInput(document.getElementById('colorTextInput').value)
    }
}
)