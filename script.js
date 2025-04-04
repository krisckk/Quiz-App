document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-btn");
    const nextButton = document.getElementById("next-btn");
    const restartButton = document.getElementById("restart-btn");
    const questionContainerElement = document.getElementById("question-container");
    const questionElement = document.getElementById("question");
    const answerButtonsElement = document.getElementById("answer-buttons");
    const resultsElement = document.getElementById("results");
    const scoreElement = document.getElementById("score");
    const totalQuestionsElement = document.getElementById("total-questions");

    let shuffledQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    const questions = [
        {
            question: "What house is Harry Potter in?",
            answers: [
                { text: "Gryffindor", correct: true },
                { text: "Slytherin", correct: false },
                { text: "Hufflepuff", correct: false },
                { text: "Ravenclaw", correct: false }
            ]
        },
        {
            question: "Who is Harry's godfather?",
            answers: [
                { text: "Sirius Black", correct: true },
                { text: "Remus Lupin", correct: false },
                { text: "Severus Snape", correct: false },
                { text: "Albus Dumbledore", correct: false }
            ]
        },
        {
            question: "What position does Harry play in Quidditch?",
            answers: [
                { text: "Beater", correct: false },
                { text: "Seeker", correct: true },
                { text: "Chaser", correct: false },
                { text: "Keeper", correct: false }
            ]
        },
        {
            question: "What is the name of Harry's owl?",
            answers: [
                { text: "Hedwig", correct: true },
                { text: "Crookshanks", correct: false },
                { text: "Scabbers", correct: false },
                { text: "Fang", correct: false }
            ]
        }
    ];

    startButton.addEventListener("click", startGame);
    nextButton.addEventListener("click", () => {
        currentQuestionIndex++;
        setNextQuestion();
    });

    restartButton.addEventListener("click", startGame);

    function startGame() {
        startButton.classList.add("hide");
        resultsElement.classList.add("hide");
        shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = score;
        totalQuestionsElement.textContent = questions.length;
        questionContainerElement.classList.remove("hide");
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        showQuestion(shuffledQuestions[currentQuestionIndex]);
    }

    function showQuestion(question) {
        questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerText = answer.text;
            button.classList.add("btn");
            if (answer.correct) {
                button.dataset.correct = "true";
            }
            button.addEventListener("click", selectAnswer);
            answerButtonsElement.appendChild(button);
        });
    }

    function resetState() {
        clearStatusClass(document.body);
        nextButton.classList.add("hide");
        while (answerButtonsElement.firstChild) {
            answerButtonsElement.removeChild(answerButtonsElement.firstChild);
        }
    }

    function selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === "true";
        if (correct) score++;
        scoreElement.textContent = score;

        Array.from(answerButtonsElement.children).forEach(button => {
            setStatusClass(button, button.dataset.correct === "true");
        });

        if (shuffledQuestions.length > currentQuestionIndex + 1) {
            nextButton.classList.remove("hide");
        } else {
            questionContainerElement.classList.add("hide");
            resultsElement.classList.remove("hide");
        }
    }

    function setStatusClass(element, correct) {
        clearStatusClass(element);
        if (correct) {
            element.classList.add("correct");
        } else {
            element.classList.add("incorrect");
        }
    }

    function clearStatusClass(element) {
        element.classList.remove("correct");
        element.classList.remove("incorrect");
    }
});
