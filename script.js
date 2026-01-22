let correctColorIndex = 0

// Helper to get random int
function randomInteger(rangeArray) {
  return Math.floor(Math.random() * (rangeArray[1] - rangeArray[0] + 1)) + rangeArray[0];
}

// Helper for split ranges
function randomIntegerBetweenRanges(rangeArray) {
    let arrayChoice = Math.random() < 0.5
    return arrayChoice === true ? randomInteger([rangeArray[0],rangeArray[1]]) : randomInteger([rangeArray[2],rangeArray[3]])
}

async function replaceTextForCountdown(secondsRemaining, durationTotal) {
    await new Promise(resolve => setTimeout(() => {
        let span = document.getElementById("secondsRemaining")
        if(span) span.textContent = secondsRemaining
        
        console.log(`${secondsRemaining} remaining`)
        if (secondsRemaining == 0) {
            console.log("finished countdown")
            manageEndCountDown()
        }
        resolve()
    }, 1000))
}

async function doCountdown(durationInSeconds) {
    let durationTotal = durationInSeconds + 1
    let i = durationInSeconds
    // Changed loop slightly to ensure smooth countdown
    while (i >= 0) {
        await replaceTextForCountdown(i, durationTotal)
        i--
    }
}

function manageEndCountDown() {
    swapStages()
}

function swapStages() {
    let memorizeStage = document.getElementById("memorizeStage")
    let pickStage = document.getElementById("pickStage")
    
    // Check if we are currently looking at the Memorize Stage
    // If it is NOT "none", it is visible. So we hide it and show the grid.
    if (getComputedStyle(memorizeStage).display !== "none" ) {
        memorizeStage.style.display = "none"
        pickStage.style.display = "flex"

        // --- FIX: Generate Colors HERE ---
        let currentHSLValue = localStorage.getItem("currentHSLValue")
        setColorVariants(currentHSLValue, [15, 40], [-5, -50], [10, 30])
    }
    else {
        // We are going back to Memorize Stage (Restarting round)
        memorizeStage.style.display = "flex"
        pickStage.style.display = "none"
        
        // --- FIX: Start Timer HERE ---
        initializeMemorizePhase([0, 360], [50, 90], [30, 70])
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
    let randomHSL = generateRandomHSLValueBetweenRanges([hueMax, hueMin], [satMax, satMin], [lumMax, lumMin])
    
    console.log("Target Color:", randomHSL)
    localStorage.setItem("currentHSLValue", randomHSL)
    
    rememberColorDiv.style.backgroundColor = randomHSL
    doCountdown(5)
}

function setColorVariants(inputColor, [hueVarianceMin, hueVarianceMax], [satVarianceMin, satVarianceMax], [lumVarianceMin, lumVarianceMax]) {
    
    // Parse the input color
    let inputHue = /(?<=hsl\()[^,]+(?=,)/gm.exec(inputColor)
    let inputSat = /(?<=, )[^,]+(?=%,)/gm.exec(inputColor)
    let inputLum = /(?<=%, )[^,]+(?=%)/gm.exec(inputColor)

    inputHue = Number(Object.values(inputHue)[0])
    inputSat = Number(Object.values(inputSat)[0])
    inputLum = Number(Object.values(inputLum)[0])

    let hueRandomNumberRange = [hueVarianceMin + inputHue, hueVarianceMax + inputHue, hueVarianceMin - inputHue, hueVarianceMax - inputHue]
    let satRandomNumberRange = [satVarianceMin + inputSat, satVarianceMax + inputSat, satVarianceMin - inputSat, satVarianceMax - inputSat]
    let lumRandomNumberRange = [lumVarianceMin + inputLum, lumVarianceMax + inputLum, lumVarianceMin - inputLum, lumVarianceMax - inputLum]

    correctColorIndex = randomInteger([1,9])
    localStorage.setItem("correctColorIndexLocalStorageItem", correctColorIndex)

    console.log("Correct Square ID:", correctColorIndex)

    for (let x = 1; x <= 9; x++) {
        let currentSquare = document.getElementById(x.toString()) // Select by ID directly

        if (correctColorIndex == x) {
            currentSquare.style.backgroundColor = inputColor
        }
        else {
            // --- FIX: Use correct random range function ---
            let adjustedHueValue = randomIntegerBetweenRanges(hueRandomNumberRange) % 360
            let adjustedSatValue = randomIntegerBetweenRanges(satRandomNumberRange)
            if (adjustedSatValue > 100) adjustedSatValue = 100
            if (adjustedSatValue < 0) adjustedSatValue = 0
            
            let adjustedLumValue = randomIntegerBetweenRanges(lumRandomNumberRange)
            if (adjustedLumValue > 100) adjustedLumValue = 100
            if (adjustedLumValue < 0) adjustedLumValue = 0

            let hueReplacedFinalColor = `hsl(${adjustedHueValue}, ${adjustedSatValue}%, ${adjustedLumValue}%)`
            currentSquare.style.backgroundColor = hueReplacedFinalColor
        }
    }
}

function processUserInput(clickedSquareId) {
    let storedCorrectIndex = localStorage.getItem("correctColorIndexLocalStorageItem")
    
    // Compare strings
    if (storedCorrectIndex == clickedSquareId) {
        console.log("Correct! Restarting...")
        swapStages() 
    }
    else {
        console.log(`Incorrect. Clicked: ${clickedSquareId}, Correct: ${storedCorrectIndex}`)
    }
}

function initializeEventListeners() {
    let colorGridSquares = document.querySelectorAll(".colorGridSquare")
    
    // --- FIX: Use forEach for safer looping ---
    colorGridSquares.forEach(square => {
        square.addEventListener("click", () => {
            console.log("Click detected on square:", square.id)
            processUserInput(square.id)
        })
    })
}

document.addEventListener("DOMContentLoaded", () => {
    if (typeof page !== 'undefined' && page == "gamePage") {
        // Initialize listeners once at the start
        initializeEventListeners()
        
        // Start the first round
        setTimeout(() => {
            initializeMemorizePhase([0, 360], [50, 90], [30, 70])
        }, 20);
    }
})