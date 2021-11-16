const intro = document.querySelector("#intro");
const introContainer = intro.querySelector("#intro-container");
const introContent = introContainer.querySelector("#intro-content");
const introButtons = introContent.querySelectorAll("button");
const content = document.querySelector("#content");
const letterBtns = content.querySelectorAll("button.letter");
const urlDictionary = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const wordContainer = content.querySelector("#word-container");
const lettersLeftTxt = content.querySelector("#letters-left");
const originHdr = content.querySelector("#origin-header");
const originTxt = content.querySelector("#origin-text");
const defTxt = content.querySelector("#definition-text");
let savedEvent;

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
}
function initGame(e) {
  savedEvent = e;
  introAndContentSwap(e);
  let urlRandomWord = "https://random-word-form.herokuapp.com/random/";
  switch (e.target.name) {
    case "noun":
      urlRandomWord += "noun";
      letterBtns.forEach(letter => letter.classList.add("green"));
      break;
    case "adjective":
      urlRandomWord += "adjective";
      letterBtns.forEach(letter => letter.classList.add("green"));
      break;
    case "animal":
      urlRandomWord += "animal";
      letterBtns.forEach(letter => letter.classList.add("blue"));
      break;
    case "everything":
      urlRandomWord = "https://random-word-api.herokuapp.com/word?number=1&swear=0";
      letterBtns.forEach(letter => letter.classList.add("red"));
      break;
    default:
      console.error("MAYDAY!! URL CAN'T BE FOUND! WE'RE GOING DOWN!! *crash*");
  }
  getRandomWord(urlRandomWord);
}
function renderGame(wordObj) {
  console.log("YAY", wordObj);
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
  startGame();
}
function startGame() {
  // letterBtns.forEach(btn => btn.addEventListener("click", ));
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
  fetchGET(urlDictionary + word, data => {
    const isSuccess = !!data[0];
    isSuccess ? renderGame(data[0]) : getRandomWord(urlRandomWord);
  });
}



/////////////////////////////////////////////////////
//// GAME BEGINS

initMenu();
