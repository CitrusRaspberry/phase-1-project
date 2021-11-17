function init() {
  const intro = document.querySelector("#intro");
  const introContainer = intro.querySelector("#intro-container");
  const introContent = introContainer.querySelector("#intro-content");
  const introButtons = introContent.querySelectorAll("button");
  const content = document.querySelector("#content");
  const letterBtns = content.querySelectorAll("button.letter");
  const formContainer = content.querySelector("#form-container");
  const wordContainer = content.querySelector("#word-container");
  const lettersLeftTxt = content.querySelector("#letters-left");
  const originHdr = content.querySelector("#origin-header");
  const originTxt = content.querySelector("#origin-text");
  const defTxt = content.querySelector("#definition-text");
  const score = content.querySelector("#score");
  const popup = content.querySelector("#popup-container");
  const popBtns = content.querySelectorAll("#popup button");
  const btnPlayAgain = content.querySelector("#popup button#play-again");
  const btnChangeMode = content.querySelector("#popup button#change-mode");
  let savedGameModeEvent;
  let badPoints = 0;

  // 
  // function reset() {
  //   badPoints = 0;
  //
  // }

  /////////////////////////////////////////////
  //// INTRO STYILING
  // CONFIG
  // in seconds
  const transitionDuration = 1;
  const introMoveUpDuration = 0.4;
  const introMoveUpDelay = 2.5;

  function introAndContentSwap(e) {
    console.log("Gamemode picked:", e.target.name);
    intro.className = "fade-out";
    intro.style.animationDuration = `${transitionDuration}s`
    setTimeout( () => {
      content.style.display = "block";
      intro.style.display = "none";
    }, transitionDuration * 1000 );
  }
  function introMoveUp() {
    setTimeout( () => {
      introContainer.style.animationDuration = `${introMoveUpDuration}s`;
      introContainer.style.animationName = "introMoveUp";
      introContent.classList.add("fade-in");
    }, introMoveUpDelay * 1000)
  }

  /////////////////////////////////////////////////////
  //// GAME LOGIC
  function initMenu() {
    introMoveUp();
    introButtons.forEach(button => button.addEventListener("click", initGame));
    btnPlayAgain.addEventListener("click", e => initGame(savedGameModeEvent));
    btnChangeMode.addEventListener("click", initRestart)
  }
  function initRestart() {

  }
  function initGame(e) {
    popup.style.display = "none";
    savedGameModeEvent = e;
    introAndContentSwap(e);
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
        urlRandomWord = "https://random-word-api.herokuapp.com/word?number=1&swear=0";
        break;
      default:
        console.error("MAYDAY!! URL CAN'T BE FOUND! WE'RE GOING DOWN!! *crash*");
        alert("The dictionary cannot be reached. Please ask the developer to look at API URLs.");
    }
    cngBtnsColor(letterBtns, color);
    cngBtnsColor(popBtns, color);
    getRandomWord(urlRandomWord);
  }
  function renderGame(wordObj) {
    console.log("Word object -->", wordObj);
    defTxt.textContent = wordObj.meanings[0].definitions[0].definition;
    if (wordObj.origin) {
      originTxt.textContent = wordObj.origin;
      originTxt.style.display = "";
      originHdr.style.display = "";
    }
    lettersLeftTxt.textContent = `${wordObj.word.length} letters left`;
    wordContainer.replaceChildren();
    for (letter of wordObj.word) {
      const newLetter = document.createElement("div")
      newLetter.className = "word-letter";
      wordContainer.append(newLetter);
    }
    startGame(wordObj);
  }
  function startGame(wordObj) {
    const wordAnswerAsArray = [...wordObj.word.toUpperCase()]
    letterBtns.forEach(btn => {
      const handler = e => processInput(e, wordAnswerAsArray);
      btn.removeEventListener("click", handler);
      btn.addEventListener("click", handler);
    });
  }
  function processInput(e, wordAnswerAsArray) {
    const letterGuessed = e.target.textContent;
    if (isLetterMatch(letterGuessed, wordAnswerAsArray)) {
      const indexNums = findIndexNums(letterGuessed, wordAnswerAsArray);
      updateWordGuess(indexNums, letterGuessed);
    } else {
      score.textContent = `${++badPoints} bad points`;
    }
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
    popup.style.display = "block";
  }
  function findIndexNums(letterGuessed, wordAnswerAsArray) {
    const indexNums = [];
    for (let i = 0; i < wordAnswerAsArray.length; i++) {
      const letter = wordAnswerAsArray[i];
      if (letter === letterGuessed) {
        indexNums.push(i);
      }
    }
    return indexNums;
  }
  function updateWordGuess(indexNums, letterGuessed) {
    const letterElements = [...wordContainer.children];
    indexNums.forEach(index => letterElements[index].textContent = letterGuessed);
  }
  function isLetterMatch(letter, wordAnswerAsArray) {
    const isMatch = wordAnswerAsArray.indexOf(letter) >= 0;
    return isMatch;
  }
  function cngBtnsColor(btnsObj, color) {
    btnsObj.forEach(btn => btn.classList.add(color))
  }
  function fetchGET(url, cb, randomWordIfError) {
    fetch(url)
    .then(r => r.json())
    .then(data => cb(data))
    .catch(error => {
      console.error("HOLD THE PHONE!!! Fetch error -->", error);
      randomWordIfError ? getRandomWord(url) : console.error("randomWordIfError = false");
    });
  }
  function getRandomWord(urlRandomWord) {
    fetchGET(urlRandomWord, data => dictionarySearchFor(data[0], urlRandomWord), true);
  }
  function dictionarySearchFor(word, urlRandomWord) {
    const urlDictionary = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    fetchGET(urlDictionary + word, data => {
      const isSuccess = !!data[0];
      isSuccess ? renderGame(data[0]) : getRandomWord(urlRandomWord);
    });
  }

  /////////////////////////////////////////////////////
  //// GAME BEGINS
  initMenu();
}

init();
