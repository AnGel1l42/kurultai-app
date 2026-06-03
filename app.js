let currentFactionFilter = "all";
let currentTypeFilter = "all";

let quizMode = null;
let quizQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let selectedAnswer = false;

/* ----------------------------- */
/* Прокрутка наверх */
/* ----------------------------- */

function scrollToTopNow() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

/* ----------------------------- */
/* Переключение экранов */
/* ----------------------------- */

function showScreen(screenName) {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const targetScreen = document.getElementById("screen-" + screenName);

  if (targetScreen) {
    targetScreen.classList.add("active");
  }

  document.querySelectorAll(".bottom-nav button").forEach(button => {
    button.classList.remove("active-nav");
  });

  const navButton = document.getElementById("nav-" + screenName);

  if (navButton) {
    navButton.classList.add("active-nav");
  }

  setTimeout(scrollToTopNow, 0);
}

/* ----------------------------- */
/* Переход с главного экрана к фракции */
/* ----------------------------- */

function filterFromHome(faction) {
  showScreen("heroes");

  currentFactionFilter = faction;

  document.querySelectorAll("[data-faction]").forEach(button => {
    button.classList.toggle("active-filter", button.dataset.faction === faction);
  });

  renderCharacters();
}

/* ----------------------------- */
/* Фильтры энциклопедии */
/* ----------------------------- */

function setFactionFilter(faction, button) {
  currentFactionFilter = faction;

  document.querySelectorAll("[data-faction]").forEach(item => {
    item.classList.remove("active-filter");
  });

  if (button) {
    button.classList.add("active-filter");
  }

  renderCharacters();
}

function setTypeFilter(type, button) {
  currentTypeFilter = type;

  document.querySelectorAll("[data-type]").forEach(item => {
    item.classList.remove("active-filter");
  });

  if (button) {
    button.classList.add("active-filter");
  }

  renderCharacters();
}

/* ----------------------------- */
/* Картинка персонажа */
/* ----------------------------- */

function createCharacterImage(character, imageClass = "character-image") {
  const wrapper = document.createElement("div");
  wrapper.className = imageClass;

  const img = document.createElement("img");
  img.src = character.image;
  img.alt = character.name;

  img.onerror = function () {
    wrapper.innerHTML = character.faction === "Свет" ? "☀" : "☾";
  };

  wrapper.appendChild(img);

  return wrapper;
}

/* ----------------------------- */
/* Отрисовка персонажей */
/* ----------------------------- */

function renderCharacters() {
  const list = document.getElementById("characters-list");
  const emptyMessage = document.getElementById("empty-message");
  const searchInput = document.getElementById("character-search");

  if (!list) return;

  const searchValue = searchInput ? searchInput.value.toLowerCase().trim() : "";

  list.innerHTML = "";

  const filteredCharacters = characters.filter(character => {
    const matchesFaction =
      currentFactionFilter === "all" || character.faction === currentFactionFilter;

    const matchesType =
      currentTypeFilter === "all" || character.type === currentTypeFilter;

    const searchText = [
      character.name,
      character.faction,
      character.role,
      character.type,
      character.short,
      character.lore
    ].join(" ").toLowerCase();

    const matchesSearch = searchText.includes(searchValue);

    return matchesFaction && matchesType && matchesSearch;
  });

  if (emptyMessage) {
    emptyMessage.style.display = filteredCharacters.length ? "none" : "block";
  }

  filteredCharacters.forEach(character => {
    const card = document.createElement("article");

    card.className =
      "character-card " + (character.faction === "Свет" ? "faction-light" : "faction-dark");

    const image = createCharacterImage(character);

    const info = document.createElement("div");
    info.className = "character-info";

    const badgeClass = character.faction === "Свет" ? "badge-light" : "badge-dark";

    info.innerHTML = `
      <span class="badge ${badgeClass}">${character.faction}</span>
      <h3>${character.name}</h3>
      <p><strong>${character.type}</strong></p>
      <p>${character.short}</p>
      <button class="small-button" onclick="openCharacter('${character.id}')">
        Подробнее
      </button>
    `;

    card.appendChild(image);
    card.appendChild(info);
    list.appendChild(card);
  });
}

/* ----------------------------- */
/* Подробная страница персонажа */
/* ----------------------------- */

function openCharacter(characterId) {
  const character = characters.find(item => item.id === characterId);

  if (!character) return;

  const detailImage = document.getElementById("detail-image");
  const detailName = document.getElementById("detail-name");
  const detailFaction = document.getElementById("detail-faction");
  const detailRole = document.getElementById("detail-role");
  const detailType = document.getElementById("detail-type");
  const detailShort = document.getElementById("detail-short");
  const detailLore = document.getElementById("detail-lore");

  if (detailImage) {
    detailImage.className =
      "detail-image " + (character.faction === "Свет" ? "detail-light" : "detail-dark");

    detailImage.innerHTML = "";

    const img = document.createElement("img");
    img.src = character.image;
    img.alt = character.name;

    img.onerror = function () {
      detailImage.innerHTML = character.faction === "Свет" ? "☀" : "☾";
    };

    detailImage.appendChild(img);
  }

  if (detailName) detailName.textContent = character.name;
  if (detailFaction) detailFaction.textContent = character.faction;
  if (detailRole) detailRole.textContent = character.role;
  if (detailType) detailType.textContent = character.type;
  if (detailShort) detailShort.textContent = character.short;
  if (detailLore) detailLore.textContent = character.lore;

  showScreen("detail");
}

/* ----------------------------- */
/* Перемешивание массива */
/* ----------------------------- */

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

/* ----------------------------- */
/* Уникальные случайные вопросы */
/* ----------------------------- */

function getUniqueRandomQuestions(allQuestions, count) {
  const uniqueQuestionsMap = new Map();

  allQuestions.forEach(question => {
    const key = question.question.trim().toLowerCase();

    if (!uniqueQuestionsMap.has(key)) {
      uniqueQuestionsMap.set(key, question);
    }
  });

  const uniqueQuestions = Array.from(uniqueQuestionsMap.values());
  const shuffledQuestions = shuffleArray(uniqueQuestions);

  return shuffledQuestions.slice(0, count);
}

/* ----------------------------- */
/* Запуск викторины */
/* ----------------------------- */

function startQuiz(mode) {
  quizMode = mode;
  currentQuestionIndex = 0;
  quizScore = 0;
  selectedAnswer = false;

  const count = mode === "card" ? 5 : 1;

  quizQuestions = getUniqueRandomQuestions(questions, count);

  if (quizQuestions.length < count) {
    alert("В базе недостаточно уникальных вопросов для этого режима.");
    return;
  }

  const quizStart = document.getElementById("quiz-start");
  const quizFinal = document.getElementById("quiz-final");
  const quizGame = document.getElementById("quiz-game");

  if (quizStart) quizStart.classList.add("hidden");
  if (quizFinal) quizFinal.classList.add("hidden");
  if (quizGame) quizGame.classList.remove("hidden");

  const modeLabel = document.getElementById("quiz-mode-label");

  if (modeLabel) {
    if (mode === "announce") {
      modeLabel.textContent = "Объявление вопроса Курултая";
    } else if (mode === "card") {
      modeLabel.textContent = "Карта «Вопрос Курултая»";
    } else {
      modeLabel.textContent = "Тренировка";
    }
  }

  showQuestion();
  scrollToTopNow();
}

/* ----------------------------- */
/* Показ вопроса */
/* ----------------------------- */

function showQuestion() {
  selectedAnswer = false;

  const question = quizQuestions[currentQuestionIndex];

  const quizCounter = document.getElementById("quiz-counter");
  const quizScoreElement = document.getElementById("quiz-score");
  const questionText = document.getElementById("question-text");
  const answersContainer = document.getElementById("answers");
  const result = document.getElementById("quiz-result");
  const nextButton = document.getElementById("next-question-button");

  if (!question || !answersContainer) return;

  if (quizCounter) {
    quizCounter.textContent =
      `Вопрос ${currentQuestionIndex + 1} из ${quizQuestions.length}`;
  }

  if (quizScoreElement) {
    quizScoreElement.textContent = `Верно: ${quizScore}`;
  }

  if (questionText) {
    questionText.textContent = question.question;
  }

  answersContainer.innerHTML = "";

  if (result) {
    result.textContent = "";
    result.className = "quiz-result";
  }

  if (nextButton) {
    nextButton.classList.add("hidden");
  }

  const shuffledAnswers = shuffleArray(question.answers);

  shuffledAnswers.forEach(answer => {
    const button = document.createElement("button");
    button.textContent = answer;
    button.onclick = () => checkAnswer(button, answer, question.correct);
    answersContainer.appendChild(button);
  });
}

/* ----------------------------- */
/* Проверка ответа */
/* ----------------------------- */

function checkAnswer(button, answer, correctAnswer) {
  if (selectedAnswer) return;

  selectedAnswer = true;

  const buttons = document.querySelectorAll("#answers button");

  buttons.forEach(item => {
    item.disabled = true;

    if (item.textContent === correctAnswer) {
      item.classList.add("answer-correct");
    }
  });

  const result = document.getElementById("quiz-result");

  if (answer === correctAnswer) {
    quizScore++;
    button.classList.add("answer-correct");

    if (result) {
      result.className = "quiz-result correct";
      result.textContent = "Верно. Курултай принимает мудрое решение.";
    }
  } else {
    button.classList.add("answer-wrong");

    if (result) {
      result.className = "quiz-result wrong";
      result.textContent = `Неверно. Правильный ответ: ${correctAnswer}`;
    }
  }

  const quizScoreElement = document.getElementById("quiz-score");

  if (quizScoreElement) {
    quizScoreElement.textContent = `Верно: ${quizScore}`;
  }

  const nextButton = document.getElementById("next-question-button");

  if (nextButton) {
    nextButton.classList.remove("hidden");
  }
}

/* ----------------------------- */
/* Следующий вопрос */
/* ----------------------------- */

function nextQuestion() {
  currentQuestionIndex++;

  if (currentQuestionIndex >= quizQuestions.length) {
    finishQuiz();
  } else {
    showQuestion();
    scrollToTopNow();
  }
}

/* ----------------------------- */
/* Случайный эффект */
/* ----------------------------- */

function getRandomEffect(effects) {
  return effects[Math.floor(Math.random() * effects.length)];
}

/* ----------------------------- */
/* Завершение викторины */
/* ----------------------------- */

function finishQuiz() {
  const quizGame = document.getElementById("quiz-game");
  const quizFinal = document.getElementById("quiz-final");

  if (quizGame) quizGame.classList.add("hidden");
  if (quizFinal) quizFinal.classList.remove("hidden");

  const finalScoreText = document.getElementById("final-score-text");
  const finalRank = document.getElementById("final-rank");
  const finalEffect = document.getElementById("final-effect");

  if (finalScoreText) {
    finalScoreText.textContent = `${quizScore}/${quizQuestions.length}`;
  }

  let rank = "";
  let effect = "";

  if (quizMode === "training") {
    rank = "Тренировка завершена.";
    effect = "Игровой эффект не применяется.";
  } else if (quizMode === "announce") {
    if (quizScore === 1) {
      rank = "Верное слово Курултая.";
      effect = "Случайный малый бонус: " + getRandomEffect(minorEffects);
    } else {
      rank = "Курултай не принял решение.";
      effect = "Бонус не применяется.";
    }
  } else {
    if (quizScore === 0) {
      rank = "Совет не состоялся.";
      effect = "Бонус не применяется.";
    } else if (quizScore <= 2) {
      rank = "Малый совет.";
      effect = "Случайный малый бонус: " + getRandomEffect(minorEffects);
    } else if (quizScore <= 4) {
      rank = "Решение Курултая.";
      effect = "Случайный средний бонус: " + getRandomEffect(mediumEffects);
    } else {
      rank = "Великая воля Курултая.";
      effect = "Случайный сильный бонус: " + getRandomEffect(strongEffects);
    }
  }

  if (finalRank) {
    finalRank.textContent = rank;
  }

  if (finalEffect) {
    finalEffect.textContent = effect;
  }

  scrollToTopNow();
}

/* ----------------------------- */
/* Сброс викторины */
/* ----------------------------- */

function resetQuiz() {
  const quizStart = document.getElementById("quiz-start");
  const quizGame = document.getElementById("quiz-game");
  const quizFinal = document.getElementById("quiz-final");

  if (quizStart) quizStart.classList.remove("hidden");
  if (quizGame) quizGame.classList.add("hidden");
  if (quizFinal) quizFinal.classList.add("hidden");

  scrollToTopNow();
}

/* ----------------------------- */
/* Первый запуск */
/* ----------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  renderCharacters();
  scrollToTopNow();
});