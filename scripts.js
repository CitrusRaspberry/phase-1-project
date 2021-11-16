const intro = document.querySelector("#intro");
const introContainer = intro.querySelector("#intro-container");
const introContent = introContainer.querySelector("#intro-content");
const introButtons = introContent.querySelectorAll("button");
const content = document.querySelector("#content");
const letterBtns = content.querySelectorAll("button.letter");
const urlDictionary = "https://api.dictionaryapi.dev/api/v2/entries/en/";

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
    introContent.className += " fade-in";
  }, introMoveUpDelay * 1000)
}

/////////////////////////////////////////////////////
//// GAME LOGIC

function dictionarySearchFor(word) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
  .then(r => r.json())
  .then(data => console.log(data[0]))
  .catch(error => console.log("RUH ROH!! -->", error));
}
function initMenu() {
  introMoveUp();
  introButtons.forEach(button => button.addEventListener("click", initGame));
}
function initGame(e) {
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
  renderGame(urlRandomWord);
}
function renderGame(urlRandomWord) {

}
function startGame() {

}
function fetchGET(url, cb, errorMsg = "Fetch error -->") {
  // const config = { method: "GET", headers: { "Content-Type": "application/json", Accept: "application/json" } }
  fetch(url, config)
  .then(r => r.json())
  .then(data => cb(data))
  .catch(error => console.error(errorMsg, error))
}



/////////////////////////////////////////////////////
//// GAME BEGINS

initMenu();
// dictionarySearchFor("jfalskdfj;as")
