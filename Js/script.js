// Get Difficulty Mode Buttons (Easy or Hard)
const navButtonsBox = document.querySelector(".nav-buttons-box");

// Get Test Time Buttons
const timeBtns = document.querySelectorAll(".time-btn");

// Get User Input (Textarea)
const userInput = document.getElementById("user-input");

// Get to Move Test Paragraph When User Write
const testParaContainerHalfWidth = parseFloat(getComputedStyle(document.querySelector(".test-para-container")).width) / 2;

const testParaSpanWidth = parseFloat(getComputedStyle(document.querySelectorAll(".test-para-box span")[0]).width) + 3;

// Get Sound for Keys
const keySounds = document.querySelectorAll(".keySound");
const [correctKeySound, wrongKeySound] = keySounds;



// Test Paragraphs
const testModeParas = {
    easyModePars: [`Images is the only way to help the client understand what the concept behind your design is without these elements the finished product can look quite odd and the client be able to mentally project his own content uploaded on the site images is the only way to help the client understand what the concept behind your design is without these elements the finished product can look quite odd and the client won be able to mentally project his own content uploaded on the site`,
        `The English language is enriched with more than a million words there are numerous difficult words in English vocabulary Learning an approximate count of 3000 words is enough for an individual to actively participate in an everyday English conversation A rich vocabulary eases the trouble of expression and it helps individuals improve their communication skills The following article on difficult words in English will help you to build a wide and varied vocabulary`,
        `There are many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form by injected humour or randomised words which do look even slightly believable If you are going to use a passage of Lorem Ipsum you need to be sure there is anything embarrassing hidden in the middle of text All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary making this the first true generator on the Internet It uses a dictionary of over 200 Latin words combined with a handful of model sentence structures to generate Lorem Ipsum which looks reasonable The generated Lorem Ipsum is therefore always free from repetition injected humour or non-characteristic words`
    ],

    hardModeParas: [`PT2, October 1991, Passage #3: Waterbugs
    This was the first “hard science” passage ever to appear on the LSAT.The passage discusses adaptive responses in organisms and features an extended discussion of developmental responses in waterbugs… hence the name.The text includes fun terms like “dimorphic,” “macropterous,” and “micropterous,” which were quickly forgotten by the end of the passage.PT10, February 1994, Passage #4: Civil Rights Theories.This passage contained only six questions,PT10, February 1994 theories(“relative deprivation” and “J - curve,” to name two) in Civil Rights movement literature caused fits for most students.`,
        `PT78, June 2016, Passage #3: Clay Tablets and Tokens.This passage covers clay tokens and envelopes that date back to 4000 BC. According to one writer, these tokens and tablets were a precursor to the development of written language. After reading this, you won’t even want to look at a clay pot again. PT 79, September 2016, Passage #2: Eileen Gray/Lacquer theories(“relative deprivation” andr Eileen Gray’s fascinating career journey with lacquer, furniture design, and architecture. She was extremely detailed in her designs, and often focused on simple, clean looks with multiple usages. She’s actually quite fascinating, but the questions in this passage make for a rough go of it.`,
        `#3: Isamu NoguchiPT71, December 2013, Passage #4: MirrorsOne striking thing about the list is that none of the PT22, June 1997, Passage #4: Language in Science PT45, December 2004, Passage #2: Hippocrati Oathpassages on the list or in the honorable mentions appeared first in a section. Every passage listed above appeared second, third,#3: Isamu NoguchiPT71, December 2013, Passage #4: MirrorsOne. This does not mean, of course, that hard passages never appear first in a section. In these cases, test makers kindly chose not to place those passages at the very front. One final note PT59, December 2009, Passage  about the list. By definition, any such list is subjective, and what challenges one student may not be difficult for another.`
    ]
};

let selectedModeParas = testModeParas.easyModePars, currentIndex = 0, testTimeDuration = 1, testStarted = false, wrongChars = 0, testDifficultyMode = "easy";


// Call to Generate Para to Set Paragraph for Test
generateTestPara();


// Function to Start Test
function startTest() {

    // Start Test
    testStarted = true;

    // Start Countdown
    startCoundown();


    // If User click Anywhere in Textarea then Set Caret Position to Last Char
    userInput.addEventListener('click', function () {
        this.selectionStart = this.value.length;
    })


    // Add Event Listner to Make Changes When User Start Writting
    userInput.addEventListener('input', function (event) {



        // Get Test Para Inner Spans
        const testParaSpans = document.querySelectorAll(".test-para-box span");


        let userInputValue = this.value, lastCharOfInputValue = this.value.substr(-1), testParaChar = testParaSpans[currentIndex].innerHTML, inputType = event.inputType;

        // Match Entered Char And Make Changes
        if (inputType != "insertLineBreak" && inputType != "deleteContentBackward" && inputType != "deleteContentForward") {

            if (lastCharOfInputValue == testParaChar || testParaChar == "&nbsp;" & lastCharOfInputValue == " ") {
                testParaSpans[currentIndex].style.cssText = "color:green;background-color:rgba(0,255,0,0.5)";
                correctKeySound.play();
            } else {
                testParaSpans[currentIndex].style.cssText = "color:red;background-color:rgba(255,0,0,0.5)";
                wrongKeySound.play();
                wrongChars++;
            }
            currentIndex++;

        }

        // If User Press Backspace Key
        if (inputType == "deleteContentBackward" && currentIndex) {
            testParaSpans[--currentIndex].style.cssText = "color:var(--greyish);background-color:transparent";
        }

        // If User Click Try to Write In Between the String then Delete Entered Character
        if (this.selectionStart < userInputValue.length) {
            this.value = userInputValue.slice(0, this.selectionStart - 1) + userInputValue.slice(this.selectionStart, userInputValue.length);
        }

        // Move Test Para When User Write
        testParaSpans[currentIndex].parentElement.style.left = testParaContainerHalfWidth + currentIndex * -testParaSpanWidth + "px";

    })

}

// Function to End Test
function endTest() {

    // End Test
    testStarted = false;
    userInput.disabled = true;

    // Call to Display Result After 2 Seconds to Show Resut
    setTimeout(displayResult, 2000);

}

// Function to Display Test Result
function displayResult() {

    const resultOverlay = document.querySelector(".result-screen-overlay");
    const resultBox = document.querySelector(".result-box");
    const closeIcon = document.querySelector(".close-icon");
    const timeDuration = document.getElementById("time-duration");
    const testMode = document.getElementById("test-mode");
    const wpm = document.getElementById("wpm");
    const cpm = document.getElementById("cpm");
    const accuracy = document.getElementById("accuracy");
    const userInputValue = userInput.value;

    // Create And Show Loader
    const loader = document.createElement("div");
    loader.classList.add("result-loader");
    resultOverlay.appendChild(loader);

    resultBox.style.display = "none";

    // Display Result Box After Some Moment And Hide Loader
    setTimeout(() => {
        loader.style.display = "none"
        resultBox.style.display = "flex";
    }, 1300)

    const arrayOfWords = userInputValue.trim().split(" ").filter(word => word != '');
    const totalWords = arrayOfWords.length;
    const totalChars = arrayOfWords.join(" ").length;

    const wordPerMin = Math.floor(totalWords / testTimeDuration);
    const charPerMin = Math.floor(totalChars / testTimeDuration);
    const accuracyPercentage = totalChars ? 100 - Math.floor(wrongChars / totalChars * 100) : 0;

    timeDuration.innerHTML = testTimeDuration + ' Min';
    testMode.innerHTML = testDifficultyMode;
    wpm.innerHTML = wordPerMin + ' <abbr title="Word Per Minute">wpm</abbr>';
    cpm.innerHTML = charPerMin + ' <abbr title="Character Per Minute">cpm</abbr>';
    accuracy.innerHTML = accuracyPercentage + '%';


    // Show Result Box
    resultOverlay.style.display = "grid";
    makeBallsOnResultBox();

    // Reload When User Click on Close Icon
    closeIcon.onclick = function () {
        location.reload();
    }

}

// Function to Make Balls on Result Box
function makeBallsOnResultBox() {

    const resultBox = document.querySelector(".result-box");

    for (let i = 0; i < 10; i++) {
        const ball = document.createElement("span");
        ball.style.cssText = `background-color:#64628426;border-radius:50%;position:absolute;
        left:${randomBetweenMtoN(1, 60)}%;top:${randomBetweenMtoN(1, 80)}%;
        width:${randomBetweenMtoN(2, 5)}rem;aspect-ratio:1/1;
        `;
        resultBox.appendChild(ball);
    }
}

// Function to Change Difficulty Mode
function changeMode(event) {

    if (!testStarted) {

        const targetElement = event.target;

        // Make Changes to Buttons and Also change Test Paragraph
        if (targetElement.classList.contains("easy-mode-btn") && !targetElement.classList.contains("active")) {

            this.parentElement.style.setProperty('--changeDeg', '-180deg');
            targetElement.nextElementSibling.classList.remove("active");

            // Insert Easy Paragraph
            selectedModeParas = testModeParas.easyModePars;

            // Change Mode
            testDifficultyMode = "easy";

            // Generate Test Paragraph According to Mode
            generateTestPara();

        } else if (!targetElement.classList.contains("active")) {
            this.parentElement.style.setProperty('--changeDeg', '0deg');
            targetElement.previousElementSibling.classList.remove("active");

            // Insert Hard Paragraph
            selectedModeParas = testModeParas.hardModeParas;

            // Change Mode
            testDifficultyMode = "hard";

            // Generate Test Paragraph According to Mode
            generateTestPara();
        }

        targetElement.classList.add("active");
    }
}



// Function to Change Test Time
function changeTestTime() {

    if (!testStarted) {

        if (!this.classList.contains("active")) {

            // Set Test Time Duration
            testTimeDuration = +this.firstElementChild.innerText;

            // Get Minutes And Change According to Selected Duration
            document.getElementById("minutes").innerHTML = '0' + this.firstElementChild.innerText;

            // Changes to Time Buttons
            for (let timeBtn of timeBtns)
                timeBtn.classList.remove("active");

            this.classList.add("active");

            generateTestPara();
        }
    }
}


// Function to Generate Test Paragraph
function generateTestPara() {
    const insertPara = selectedModeParas[randomBetweenMtoN(0, selectedModeParas.length - 1)];
    const testParaBox = document.querySelector(".test-para-box");
    testParaBox.innerHTML = "";

    for (let j = 0; j < testTimeDuration; j++) {
        for (let i = 0; i < insertPara.length; i++) {
            const span = document.createElement("span");
            span.innerHTML = insertPara[i] == " " ? "&nbsp" : insertPara[i];
            testParaBox.appendChild(span);
        }
    }
}


// Function to Start Countdown
function startCoundown() {

    const minutes = document.getElementById("minutes");
    const seconds = document.getElementById("seconds");
    const milliseconds = document.getElementById("milliseconds");

    let testMin = +minutes.innerText, min, sec, millisec, countdownStop = false, rmAniFrame, timeDiff;
    const startTime = new Date();

    function coundownRunning() {

        if (!countdownStop) {

            timeDiff = new Date() - startTime;
            min = Math.floor(timeDiff / 60000);
            sec = Math.floor(timeDiff % 60000 / 1000);
            millisec = Math.floor(timeDiff % 1000 / 10);

            if (min == testMin)
                countdownStop = true;

            min = Math.abs((min - testMin) < 0 ? (min - testMin + 1) : (min - testMin));
            sec = Math.abs(sec - 59);
            millisec = Math.abs(millisec - 99);

            minutes.innerText = "0" + min;
            seconds.innerText = sec < 10 ? "0" + sec : sec;
            milliseconds.innerText = millisec < 10 ? "0" + millisec : millisec;

            rmAniFrame = requestAnimationFrame(coundownRunning);
        }
        else {
            endTest();
            cancelAnimationFrame(rmAniFrame);
            minutes.innerText = "00";
            seconds.innerText = "00";
            milliseconds.innerText = "00";
        }
    }

    requestAnimationFrame(coundownRunning);
}


// Function to Generate Random Numbers Between Given Two Numbers
function randomBetweenMtoN(lowerNum, upperNum) {
    return (Math.floor(Math.random() * (upperNum - lowerNum + 1) + lowerNum));
}


// Add Event Listner to Swicth Between Difficulty Modes
navButtonsBox.addEventListener('click', changeMode)


// Add Event Listner to Switch Between Test Time Duration
timeBtns.forEach(function (timeBtn) {
    timeBtn.addEventListener('click', changeTestTime);
})


// Add Event Listner to Start Test
userInput.addEventListener('keydown', function (event) {

    const key = event.key;

    if (!testStarted) {
        startTest();
    }

    if (key == "ArrowLeft" || key == "ArrowUp" || key == "ArrowDown")
        this.selectionStart = this.value.length;
})

// Reload Page When User Change Tabs
window.addEventListener('blur', function () {
    // this.location.reload();
})







