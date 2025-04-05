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
    const topicContainer = document.getElementById("topic-container");
    const topic = document.getElementById("topic");

    const hpButton = document.getElementById("harry-potter-btn");
    const codeButton = document.getElementById("code-quiz-btn");
    const greekButton = document.getElementById("greek-mythology-btn");

    let shuffledQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let isStarted = false;
    let selectedQuizType = '';

    // Initialize - hide the topic container until a topic is selected
    topicContainer.classList.add("hide");
    
    async function loadQuestions(quizType) {
        const urlMap = {
            'harry_potter': 'harry_potter_questions.json',
            'code': 'code_questions.json',
            'greek_mythology': 'greek_mythology_questions.json'
        };
        
        selectedQuizType = quizType;
        
        // Update the topic text based on selection
        switch(quizType){
            case 'harry_potter':
                topic.textContent = "Harry Potter General Quiz";
                break;
            case 'code':
                topic.textContent = "Code General Quiz";
                break;
            case "greek_mythology":
                topic.textContent = "Greek Mythology General Quiz";
                break;
            default:
                topic.textContent = "Quiz Topic";
                break;
        }
        
        // Make sure the topic container is visible
        topicContainer.classList.remove("hide");
        
        // Enable the start button
        startButton.disabled = false;
        
        try {
            const response = await fetch(urlMap[quizType]);
            if (!response.ok) throw new Error('Network response was not ok');
            questions = await response.json();
            console.log("Questions loaded", questions);
            // Don't start the game automatically, just load the questions
        } catch (error) {
            console.error("Error loading questions:", error);
            // If there's an error, show a fallback message
            topic.textContent = "Error loading quiz. Please try again.";
        }
    }
    
    hpButton.addEventListener("click", () => loadQuestions('harry_potter'));
    codeButton.addEventListener("click", () => loadQuestions('code'));
    greekButton.addEventListener("click", () => loadQuestions('greek_mythology'));

    // Disable start button until a topic is selected
    startButton.disabled = true;

    startButton.addEventListener("click", startGame);
    nextButton.addEventListener("click", handleNextButtonClick);
    restartButton.addEventListener("click", startGame);

    function startGame() {
        // Only start if questions are loaded
        if (questions.length === 0) {
            alert("Please select a quiz topic first!");
            return;
        }
        
        startButton.classList.add("hide");
        resultsElement.classList.add("hide");
        topicContainer.classList.add("hide");
        isStarted = true;
        shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        currentQuestionIndex = 0;
        score = 0;
        scoreElement.textContent = score;
        totalQuestionsElement.textContent = questions.length;
        questionContainerElement.classList.remove("hide");
        setNextQuestion();
    }

    function handleNextButtonClick() {
        currentQuestionIndex++;
        setNextQuestion();
    }

    function setNextQuestion() {
        resetState();
        if (shuffledQuestions[currentQuestionIndex]) {
            showQuestion(shuffledQuestions[currentQuestionIndex]);
        } else {
            console.error("No question available at index", currentQuestionIndex);
        }
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

        [...answerButtonsElement.children].forEach(button => {
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
