let currentFactionFilter="all";let currentTypeFilter="all";let quizMode=null;let quizQuestions=[];let currentQuestionIndex=0;let quizScore=0;let selectedAnswer=false;function scrollToTopNow(){window.scrollTo(0,0);document.documentElement.scrollTop=0;document.body.scrollTop=0}function showScreen(screenName){document.querySelectorAll(".screen").forEach(screen=>{screen.classList.remove("active")});const targetScreen=document.getElementById("screen-"+screenName);if(targetScreen){targetScreen.classList.add("active")}document.querySelectorAll(".bottom-nav button").forEach(button=>{button.classList.remove("active-nav")});const navButton=document.getElementById("nav-"+screenName);if(navButton){navButton.classList.add("active-nav")}setTimeout(scrollToTopNow,0)}function filterFromHome(faction){showScreen("heroes");currentFactionFilter=faction;document.querySelectorAll("[data-faction]").forEach(button=>{button.classList.toggle("active-filter",button.dataset.faction===faction)});renderCharacters()}function setFactionFilter(faction,button){currentFactionFilter=faction;document.querySelectorAll("[data-faction]").forEach(item=>{item.classList.remove("active-filter")});button.classList.add("active-filter");renderCharacters()}function setTypeFilter(type,button){currentTypeFilter=type;document.querySelectorAll("[data-type]").forEach(item=>{item.classList.remove("active-filter")});button.classList.add("active-filter");renderCharacters()}function createCharacterImage(character,imageClass="character-image"){const wrapper=document.createElement("div");wrapper.className=imageClass;const img=document.createElement("img");img.src=character.image;img.alt=character.name;img.onerror=function(){wrapper.innerHTML=character.faction==="Свет"?"☀":"☾"};wrapper.appendChild(img);return wrapper}function renderCharacters(){const list=document.getElementById("characters-list");const emptyMessage=document.getElementById("empty-message");const searchInput=document.getElementById("character-search");if(!list)return;const searchValue=searchInput?searchInput.value.toLowerCase().trim():"";list.innerHTML="";const filteredCharacters=characters.filter(character=>{const matchesFaction=currentFactionFilter==="all"||character.faction===currentFactionFilter;const matchesType=currentTypeFilter==="all"||character.type===currentTypeFilter;const searchText=[character.name,character.faction,character.role,character.type,character.short,character.lore].join(" ").toLowerCase();const matchesSearch=searchText.includes(searchValue);return matchesFaction&&matchesType&&matchesSearch});if(emptyMessage){emptyMessage.style.display=filteredCharacters.length?"none":"block"}filteredCharacters.forEach(character=>{const card=document.createElement("article");card.className="character-card "+(character.faction==="Свет"?"faction-light":"faction-dark");const image=createCharacterImage(character);const info=document.createElement("div");info.className="character-info";const badgeClass=character.faction==="Свет"?"badge-light":"badge-dark";info.innerHTML=`<span class="badge ${badgeClass}">${character.faction}</span><h3>${character.name}</h3><p><strong>${character.type}</strong></p><p>${character.short}</p><button class="small-button" onclick="openCharacter('${character.id}')">Подробнее</button>`;card.appendChild(image);card.appendChild(info);list.appendChild(card)})}function openCharacter(characterId){const character=characters.find(item=>item.id===characterId);if(!character)return;const detailImage=document.getElementById("detail-image");document.getElementById("detail-name").textContent=character.name;document.getElementById("detail-faction").textContent=character.faction;document.getElementById("detail-role").textContent=character.role;document.getElementById("detail-type").textContent=character.type;document.getElementById("detail-short").textContent=character.short;document.getElementById("detail-lore").textContent=character.lore;detailImage.className="detail-image "+(character.faction==="Свет"?"detail-light":"detail-dark");detailImage.innerHTML="";const img=document.createElement("img");img.src=character.image;img.alt=character.name;img.onerror=function(){detailImage.innerHTML=character.faction==="Свет"?"☀":"☾"};detailImage.appendChild(img);showScreen("detail")}function shuffleArray(array){return[...array].sort(()=>Math.random()-.5)}function startQuiz(mode){quizMode=mode;currentQuestionIndex=0;quizScore=0;selectedAnswer=false;const count=mode==="card"?5:1;quizQuestions=shuffleArray(questions).slice(0,count);document.getElementById("quiz-start").classList.add("hidden");document.getElementById("quiz-final").classList.add("hidden");document.getElementById("quiz-game").classList.remove("hidden");const modeLabel=document.getElementById("quiz-mode-label");if(mode==="announce"){modeLabel.textContent="Объявление вопроса Курултая"}else if(mode==="card"){modeLabel.textContent="Карта «Вопрос Курултая»"}else{modeLabel.textContent="Тренировка"}showQuestion();scrollToTopNow()}function showQuestion(){selectedAnswer=false;const question=quizQuestions[currentQuestionIndex];document.getElementById("quiz-counter").textContent=`Вопрос ${currentQuestionIndex+1} из ${quizQuestions.length}`;document.getElementById("quiz-score").textContent=`Верно: ${quizScore}`;document.getElementById("question-text").textContent=question.question;const answersContainer=document.getElementById("answers");const result=document.getElementById("quiz-result");const nextButton=document.getElementById("next-question-button");answersContainer.innerHTML="";result.textContent="";result.className="quiz-result";nextButton.classList.add("hidden");shuffleArray(question.answers).forEach(answer=>{const button=document.createElement("button");button.textContent=answer;button.onclick=()=>checkAnswer(button,answer,question.correct);answersContainer.appendChild(button)})}function checkAnswer(button,answer,correctAnswer){if(selectedAnswer)return;selectedAnswer=true;const buttons=document.querySelectorAll("#answers button");buttons.forEach(item=>{item.disabled=true;if(item.textContent===correctAnswer){item.classList.add("answer-correct")}});const result=document.getElementById("quiz-result");if(answer===correctAnswer){quizScore++;button.classList.add("answer-correct");result.className="quiz-result correct";result.textContent="Верно. Курултай принимает мудрое решение."}else{button.classList.add("answer-wrong");result.className="quiz-result wrong";result.textContent=`Неверно. Правильный ответ: ${correctAnswer}`}document.getElementById("quiz-score").textContent=`Верно: ${quizScore}`;document.getElementById("next-question-button").classList.remove("hidden")}function nextQuestion(){currentQuestionIndex++;if(currentQuestionIndex>=quizQuestions.length){finishQuiz()}else{showQuestion();scrollToTopNow()}}function getRandomEffect(effects){return effects[Math.floor(Math.random()*effects.length)]}function finishQuiz(){document.getElementById("quiz-game").classList.add("hidden");document.getElementById("quiz-final").classList.remove("hidden");document.getElementById("final-score-text").textContent=`${quizScore}/${quizQuestions.length}`;let rank="";let effect="";if(quizMode==="training"){rank="Тренировка завершена.";effect="Игровой эффект не применяется."}else if(quizMode==="announce"){if(quizScore===1){rank="Верное слово Курултая.";effect="Случайный малый бонус: "+getRandomEffect(minorEffects)}else{rank="Курултай не принял решение.";effect="Бонус не применяется."}}else{if(quizScore===0){rank="Совет не состоялся.";effect="Бонус не применяется."}else if(quizScore<=2){rank="Малый совет.";effect="Случайный малый бонус: "+getRandomEffect(minorEffects)}else if(quizScore<=4){rank="Решение Курултая.";effect="Случайный средний бонус: "+getRandomEffect(mediumEffects)}else{rank="Великая воля Курултая.";effect="Случайный сильный бонус: "+getRandomEffect(strongEffects)}}document.getElementById("final-rank").textContent=rank;document.getElementById("final-effect").textContent=effect;scrollToTopNow()}function resetQuiz(){document.getElementById("quiz-start").classList.remove("hidden");document.getElementById("quiz-game").classList.add("hidden");document.getElementById("quiz-final").classList.add("hidden");scrollToTopNow()}

/* ----------------------------- */
/* Принудительное исправление прокрутки */
/* ----------------------------- */

function setupForcedScroll() {
  const scrollContainer = getScrollContainer();

  if (!scrollContainer) return;

  let lastTouchY = 0;
  let isTouching = false;

  function canScroll() {
    return scrollContainer.scrollHeight > scrollContainer.clientHeight;
  }

  window.addEventListener("wheel", function (event) {
    if (!canScroll()) return;

    scrollContainer.scrollTop += event.deltaY;
    event.preventDefault();
  }, { passive: false, capture: true });

  window.addEventListener("touchstart", function (event) {
    if (event.touches.length !== 1) return;

    isTouching = true;
    lastTouchY = event.touches[0].clientY;
  }, { passive: true, capture: true });

  window.addEventListener("touchmove", function (event) {
    if (!isTouching || event.touches.length !== 1 || !canScroll()) return;

    const currentY = event.touches[0].clientY;
    const deltaY = lastTouchY - currentY;

    scrollContainer.scrollTop += deltaY;
    lastTouchY = currentY;

    event.preventDefault();
  }, { passive: false, capture: true });

  window.addEventListener("touchend", function () {
    isTouching = false;
  }, { passive: true });

  window.addEventListener("keydown", function (event) {
    const tagName = document.activeElement ? document.activeElement.tagName : "";

    if (tagName === "INPUT" || tagName === "TEXTAREA") return;

    const step = 90;
    const pageStep = scrollContainer.clientHeight * 0.85;

    if (event.key === "ArrowDown") {
      scrollContainer.scrollTop += step;
      event.preventDefault();
    }

    if (event.key === "ArrowUp") {
      scrollContainer.scrollTop -= step;
      event.preventDefault();
    }

    if (event.key === "PageDown" || event.key === " ") {
      scrollContainer.scrollTop += pageStep;
      event.preventDefault();
    }

    if (event.key === "PageUp") {
      scrollContainer.scrollTop -= pageStep;
      event.preventDefault();
    }

    if (event.key === "Home") {
      scrollContainer.scrollTop = 0;
      event.preventDefault();
    }

    if (event.key === "End") {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
      event.preventDefault();
    }
  });
}


document.addEventListener("DOMContentLoaded",()=>{renderCharacters();setupForcedScroll();scrollToTopNow()});
