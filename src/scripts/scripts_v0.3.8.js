function init() {
  const intro = document.querySelector("#intro");
  const introContainer = intro.querySelector("#intro-container");
  const introContent = introContainer.querySelector("#intro-content");
  const introButtons = introContent.querySelectorAll("button");
  const content = document.querySelector("#content");
  const letterBtns = content.querySelectorAll("button.letter");
  const wordContainer = content.querySelector("#word-container");
  const parTxt = content.querySelector("#par");
  const originHdr = content.querySelector("#origin-header");
  const originTxt = content.querySelector("#origin-text");
  const defTxt = content.querySelector("#definition-text");
  const score = content.querySelector("#score");
  const winPopup = content.querySelector("#win-popup.popup-container");
  const disconnectPopup = document.querySelector("#disconnect-popup.popup-container");
  const gameBtns = content.querySelectorAll("#content button");
  const btnPlayAgain = content.querySelectorAll("button.play-again");
  const btnChangeMode = content.querySelectorAll("button.change-mode");
  const btnBMC = content.querySelectorAll("button.bmc");
  const bmcContainer = content.querySelector(".bmc-container");
  const closeX = content.querySelector("div.close-x")
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
  const introOutDuration = 0.3;
  const contentInDuration = 0.3;
  const introInDuration = 0.3;
  const contentOutDuration = 0.3;
  const popupOutDuration = 0.3;

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
  introButtons.forEach(button => button.addEventListener("click", initGame));
  btnPlayAgain.forEach(btn => {
    btn.addEventListener("click", () => {
      if (wordObj) {
        initGame(savedGameModeEvent)
      }
    })
  });
  btnChangeMode.forEach(btn => {
    btn.addEventListener("click", initRestart)
  })
  closeX.addEventListener('click', () => hidePopup(winPopup))
  document.addEventListener("keydown", processInput);
  letterBtns.forEach(btn => {
    btn.addEventListener("click", processInput);
  });
  if (window.location.pathname === '/no-bmc') {
    bmcContainer.style.display = 'none';
  }

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
    parTxt.textContent = "";
    defTxt.textContent = "loading...";
    originTxt.style.display = "none";
    originHdr.style.display = "none";
    confetti.stop();
    wordObj = null;
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
  function initRestart(e) {
    sceneSwap(e, content, intro, contentOutDuration, introInDuration);
  }
  function initGame(e) {
    if (winPopup.style.display !== 'none') {
      hidePopup(winPopup);
    }
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
    cngBtnsColor(gameBtns, color);
    getRandomWord(urlRandomWord);
  }
  function renderGame() {
    score.textContent = `${badPoints} bad points`;
    setDefinition();
    setOrigin();
    setPar();
    for (letter of wordObj.word) {
      const newLetter = document.createElement("div")
      newLetter.className = "word-letter";
      wordContainer.append(newLetter);
    }
    createSpacer();
    fillSpecialChars();
    startGame();
  }
  function setDefinition() {
    const mode = savedGameModeEvent.target.name;
    const word = wordObj.word.toLowerCase();
    let meaning = wordObj.meanings.find(m => m.partOfSpeech === mode);
    if (!meaning) {
      meaning = wordObj.meanings[0];
    }
    let definition = meaning.definitions.find(d => (
      !d.definition.toLowerCase().includes(word)
    ))?.definition;
    if (!definition) {
      definition = meaning.definitions[0].definition;
    }
    defTxt.textContent = definition;
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
  function setPar() {
    const wordLength = wordObj.word.length;
    const uniqueLettersLength = new Set(wordObj.word).size;
    const par = Math.floor((wordLength + uniqueLettersLength) / 3) + 2;
    // Slightly harder
    //const par = Math.ceil((wordLength + uniqueLettersLength) / 3) + 1;
    parTxt.textContent = `par ${par}`;
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
    
  }
  function checkIfLetterWasGuessed(letter) {
    return guessedLetters.indexOf(letter) >= 0;
  }
  function processInput(e) {
    if (!checkIfWon() && wordObj) {
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
      if (checkIfWon()) {
        winScreen();
      };
    }
  }
  function checkIfWon() {
    const wordGuessElements = [...wordContainer.children];
    const wordGuessed = wordGuessElements.map(element => element.textContent).join("");
    return wordAnswerAsArray.join("") === wordGuessed;
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
    btnsObj.forEach(btn => {
      for (let c of ['red', 'green', 'blue']) {
        btn.classList.remove(c);
      }
      if (!btn.className.includes('bmc')) {
        btn.classList.add(color);
      }
    })
  }
  function fetchGET(url, cb) {
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
    fetchGET(urlRandomWord, data => dictionarySearchFor(data[0], urlRandomWord));
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
}

document.addEventListener("DOMContentLoaded", init)
