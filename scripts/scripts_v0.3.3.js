function init() {
  const intro = document.querySelector("#intro");
  const introContainer = intro.querySelector("#intro-container");
  const introContent = introContainer.querySelector("#intro-content");
  const introButtons = introContent.querySelectorAll("button");
  const content = document.querySelector("#content");
  const letterBtns = content.querySelectorAll("button.letter");
  const wordContainer = content.querySelector("#word-container");
  const lettersLeftTxt = content.querySelector("#letters-left");
  const originHdr = content.querySelector("#origin-header");
  const originTxt = content.querySelector("#origin-text");
  const defTxt = content.querySelector("#definition-text");
  const score = content.querySelector("#score");
  const winPopup = content.querySelector("#win-popup.popup-container");
  const disconnectPopup = document.querySelector("#disconnect-popup.popup-container");
  const popBtns = content.querySelectorAll("#popup button");
  const btnPlayAgain = content.querySelector("#popup button#play-again");
  const btnChangeMode = content.querySelector("#popup button#change-mode");
  const btnBMC = content.querySelectorAll("button.bmc");
  let savedGameModeEvent;
  let badPoints = 0;
  let wordObj;
  let wordAnswerAsArray;
  let guessedLetters = [];
  let onReconnect = () => {}

  /////////////////////////////////////////////
  //// INTRO STYILING
  // CONFIG
  // in seconds
  const introOutDuration = 0.5;
  const contentInDuration = 0.5;
  const introInDuration = 0.5;
  const contentOutDuration = 0.5;
  const popupOutDuration = 0.5;

  function sceneSwap(e, sceneOut, sceneIn, outDuration, inDuration) {
    sceneOut.className = "fade-out";
    sceneOut.style.animationName = "fadeOut";
    sceneOut.style.animationDuration = `${outDuration}s`;
    sceneIn.className = "fade-in";
    sceneIn.style.animationName = "fadeIn";
    sceneIn.style.animationDuration = `${inDuration}s`;
    setTimeout( () => {
      sceneOut.style.display = "none";
      sceneIn.style.display = sceneIn === intro ? "flex" : "block";
    }, outDuration * 1000 );
  }
  function showPopup(element) {
    element.style.display = "block";
  }
  function hidePopup(element) {
    element.style.animationDuration = `${popupOutDuration}s`;
    element.classList.add("fade-out");
    setTimeout(() => {
      element.style.display = "none";
      element.classList.remove("fade-out");
    }, popupOutDuration * 1000);
  }
  /////////////////////////////////////////////////////
  //// GAME LOGIC
  window.addEventListener('online', () => {
    hidePopup(disconnectPopup)
    onReconnect();
    onReconnect = () => {};
  });

  function resetGame() {
    wordAnswerAsArray = [...wordObj.word.toUpperCase()];
    badPoints = 0;
    guessedLetters = [];
    for (btn of letterBtns) {
      btn.disabled = false;
    }
  }
  function resetStyle() {
    wordContainer.replaceChildren();
    score.textContent = "";
    lettersLeftTxt.textContent = "";
    defTxt.textContent = "loading...";
    originTxt.style.display = "none";
    originHdr.style.display = "none";
    confetti.stop();
    popBtns.forEach(btn => btn.className = "small");
    letterBtns.forEach(btn => btn.className = "letter big");
  }
  function createSpacer() {
    const firstLetter = wordContainer.firstChild;
    firstLetter.textContent = ".";
    firstLetter.style.color = "white";
  }
  function deleteSpacer() {
    const firstLetter = wordContainer.firstChild;
    if (firstLetter.textContent === ".") {
      firstLetter.textContent = "";
      firstLetter.style.color = "";
    }
  }
  function disableLetter(letter) {
    for (btn of letterBtns) {
      if (btn.textContent === letter) {
        btn.disabled = true;
        btn.className = "letter big";
      }
    }
  }
  function initMenu() {
    introButtons.forEach(button => button.addEventListener("click", initGame));
    btnPlayAgain.addEventListener("click", e => initGame(savedGameModeEvent));
    btnChangeMode.addEventListener("click", initRestart)
  }
  function initRestart(e) {
    sceneSwap(e, content, intro, contentOutDuration, introInDuration);
  }
  function initGame(e) {
    hidePopup(winPopup);
    savedGameModeEvent = e;
    sceneSwap(e, intro, content, introOutDuration, contentInDuration);
    let urlRandomWord = "https://random-word-form.herokuapp.com/random/";
    let color;
    switch (e.target.name) {
      case "noun":
        color = "green";
        urlRandomWord += "noun";
        break;
      case "adjective":
        color = "green";
        urlRandomWord += "adjective";
        break;
      case "animal":
        color = "blue";
        urlRandomWord += "animal";
        break;
      case "everything":
        color = "red";
        urlRandomWord = "https://random-word-api.herokuapp.com/word?number=1";
        break;
      default:
        console.error("MAYDAY!! URL CAN'T BE FOUND! WE'RE GOING DOWN!! *crash*");
        alert("The dictionary cannot be reached. Please ask the developer to look at API URLs.");
    }
    resetStyle();
    cngBtnsColor(letterBtns, color);
    cngBtnsColor(popBtns, color);
    getRandomWord(urlRandomWord);
  }
  function renderGame() {
    score.textContent = `${badPoints} bad points`;
    defTxt.textContent = wordObj.meanings[0].definitions[0].definition;
    setOrigin();
    lettersLeftTxt.textContent = `${wordObj.word.length} letters left`;
    for (letter of wordObj.word) {
      const newLetter = document.createElement("div")
      newLetter.className = "word-letter";
      wordContainer.append(newLetter);
    }
    createSpacer();
    fillSpecialChars();
    startGame();
  }
  function setOrigin() {
    if (wordObj.origin) {
      let origin = wordObj.origin;
      if (origin.length > 250) {
        origin = origin.slice(0, 250) + "...";
      }
      originTxt.textContent = origin;
      originTxt.style.display = "";
      originHdr.style.display = "";
    }
  }
  function fillSpecialChars() {
    const specialChars = ["-", " "];
    for (char of specialChars) {
      const letterGuessed = char;
      if (isLetterMatch(letterGuessed)) {
        const indexNums = findIndexNums(letterGuessed);
        updateWordGuess(indexNums, letterGuessed, true);
      }
    }
  }
  function startGame() {
    document.removeEventListener("keydown", processInput);
    document.addEventListener("keydown", processInput);
    letterBtns.forEach(btn => {
      btn.removeEventListener("click", processInput);
      btn.addEventListener("click", processInput);
    });
  }
  function checkIfLetterWasGuessed(letter) {
    return guessedLetters.indexOf(letter) >= 0;
  }
  function processInput(e) {
    let letterGuessed;
    if (e.type === "keydown") {
      letterGuessed = e.key.toUpperCase();
    } else if (e.type === "click") {
      letterGuessed = e.target.textContent;
    }
    if (!checkIfLetterWasGuessed(letterGuessed)) {
      guessedLetters.push(letterGuessed);
      if (isLetterMatch(letterGuessed)) {
        const indexNums = findIndexNums(letterGuessed);
        deleteSpacer();
        updateWordGuess(indexNums, letterGuessed);
      } else {
        score.textContent = `${++badPoints} bad points`;
      }
    }
    disableLetter(letterGuessed);
    checkIfWon(wordAnswerAsArray.join(""));
  }
  function checkIfWon(wordAnswerAsString) {
    const wordGuessElements = [...wordContainer.children];
    const wordGuessed = wordGuessElements.map(element => element.textContent).join("");
    if (wordAnswerAsString === wordGuessed) {
      winScreen();
    }
  }
  function winScreen() {
    showPopup(winPopup)
    confetti.start();
    setTimeout(confetti.stop, 3000);
  }
  function findIndexNums(letterGuessed) {
    const indexNums = [];
    for (let i = 0; i < wordAnswerAsArray.length; i++) {
      const letter = wordAnswerAsArray[i];
      if (letter === letterGuessed) {
        indexNums.push(i);
      }
    }
    return indexNums;
  }
  function updateWordGuess(indexNums, letterGuessed, isSpecialChar = false) {
    const letterElements = [...wordContainer.children];
    indexNums.forEach(index => {
      letterElements[index].textContent = letterGuessed;
      if (isSpecialChar) {
        letterElements[index].style.borderBottom = "none";
      }
    });
  }
  function isLetterMatch(letter) {
    const isMatch = wordAnswerAsArray.indexOf(letter) >= 0;
    return isMatch;
  }
  function cngBtnsColor(btnsObj, color) {
    btnsObj.forEach(btn => btn.classList.add(color))
  }
  function fetchGET(url, cb, randomWordIfError) {
    const get = () => {
      fetch(url)
      .then(r => r.json())
      .then(data => {
        onReconnect = () => {}
        cb(data)
      })
      .catch(error => {
        if (navigator.onLine) {
          console.error("HOLD THE PHONE!!! Fetch error -->", error);
        } else {
          showPopup(disconnectPopup);
        }
        
      })
    };
    onReconnect = get;
    get();
  }
  function getRandomWord(urlRandomWord) {
    fetchGET(urlRandomWord, data => dictionarySearchFor(data[0], urlRandomWord), true);
  }
  function dictionarySearchFor(word, urlRandomWord) {
    const urlDictionary = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    fetchGET(urlDictionary + word, data => {
      const isSuccess = !!data[0];
      if (isSuccess) {
        wordObj = data[0];
        // wordObj.word = "for testing"; UNCOMMENT if you want to choose the word
        resetGame();
        renderGame();
      } else {
        getRandomWord(urlRandomWord);
      }
    });
  }

  for (let btn of btnBMC) {
    btn.addEventListener('click', () => {
      window.open('https://www.buymeacoffee.com/joshuaholmes', '_newtab')
    });
  }

  /////////////////////////////////////////////////////
  //// GAME BEGINS
  initMenu();
}

document.addEventListener("DOMContentLoaded", init)
