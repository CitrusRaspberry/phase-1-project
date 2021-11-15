// CONFIG
// In seconds
const transitionDuration = 1;
const introMoveUpDuration = 0.4;
const introMoveUpDelay = 2;

/////////////////////////////////////////////
// STYILING
const content = document.querySelector("#content");
const intro = document.querySelector("#intro");
const introText = document.querySelector("#intro h1");

function introAndContentSwap() {
  intro.className = "fade-out";
  intro.style.animationDuration = `${transitionDuration}s`
  setTimeout( () => {
    content.style.display = "block";
    intro.style.display = "none";
  }, transitionDuration * 1000 );
  console.log(intro.style.animationDuration);
}
function introMoveUp() {
  setTimeout( () => {
    introText.style.animationDuration = `${introMoveUpDuration}s`;
    introText.style.animationName = "introMoveUp";
    // setTimeout( () => introText.style.position = "", introMoveUpDuration * 1000 )
  }, introMoveUpDelay * 1000)
}



/////////////////////////////////////////////////////
// LOGIC
function dictionarySearchFor(word) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
  .then(r => r.json())
  .then(data => console.log(data[0]))
  .catch(error => console.log("RUH ROH!! -->", error));
}

/////////////////////////////////////////////////////
// PROGRAM BEGIN
function init() {
  introMoveUp();
  intro.addEventListener("click", introAndContentSwap);
}


init();
// dictionarySearchFor("jfalskdfj;as")
