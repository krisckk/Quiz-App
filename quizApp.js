export class QuizApp {
    constructor() {
        this.startButton = document.getElementById("start-btn");
        this.nextButton = document.getElementById("next-btn");
        this.restartButton = document.getElementById("restart-btn");
        this.questionContainerElement = document.getElementById("question-container");
        this.questionElement = document.getElementById("question");
        this.answerButtonsElement = document.getElementById("answer-buttons");
        this.resultsElement = document.getElementById("results");
        this.scoreElement = document.getElementById("score");
        this.totalQuestionsElement = document.getElementById("total-questions");
        this.topicContainer = document.getElementById("topic-container");
        this.topic = document.getElementById("topic");
        this.shuffledQuestions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questions = [];
        this.isStarted = false;
        this.selectedQuizType = '';
        this.init();
    }
    
    init() {
        this.topicContainer.classList.add("hide");
        this.startButton.disabled = true;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Debouncing prevents multiple rapid cdlecks from triggering event handlers multiple times
        // Which can lead to performance issues or unexpected behavior in the application.
        const debounce = (func, delay) => {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        };
        this.startButton.addEventListener("click", this.startGame.bind(this));
        this.nextButton.addEventListener("click", this.handleNextButtonClick.bind(this));
        this.restartButton.addEventListener("click", this.startGame.bind(this));
        document.getElementById("harry-potter-btn").addEventListener("click", () => this.loadQuestions('harry_potter'));
        document.getElementById("code-quiz-btn").addEventListener("click", () => this.loadQuestions('code'));
        document.getElementById("greek-mythology-btn").addEventListener("click", () => this.loadQuestions('greek_mythology'));
    }
    
    async loadQuestions(quizType) {
        const urlMap = {
            'harry_potter': { url: './json/harry_potter_questions.json', text: "Harry Potter General Quiz" },
            'code': { url: './json/code_questions.json', text: "Code General Quiz" },
            'greek_mythology': { url: './json/greek_mythology_questions.json', text: "Greek Mythology General Quiz" }
        };
        const quizInfo = urlMap[quizType];
        if (!quizInfo) {
            console.error("Invalid quiz type:", quizType);
            this.topic.textContent = "Invalid quiz type selected.";
            return;
        }
        this.selectedQuizType = quizType;
        this.topic.textContent = quizInfo.text;
        this.topicContainer.classList.remove("hide");
        this.startButton.disabled = false;
        try {
            const response = await fetch(quizInfo.url);
            if (!response.ok) throw new Error('Network response was not ok');
            this.questions = await response.json();
            console.log("Questions loaded", this.questions);
        } catch (error) {
            console.error("Error loading questions:", error);
            this.topic.textContent = "Error loading quiz. Please try again.";
        }
    }
    
    startGame() {
        if (this.questions.length === 0) {
            alert("Please select a quiz topic first!");
            return;
        }
        this.startButton.classList.add("hide");
        this.resultsElement.classList.add("hide");
        this.topicContainer.classList.add("hide");
        this.isStarted = true;
        this.shuffledQuestions = this.questions.sort(() => Math.random() - 0.5);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.scoreElement.textContent = this.score;
        this.totalQuestionsElement.textContent = this.questions.length;
        this.questionContainerElement.classList.remove("hide");
        this.setNextQuestion();
    }
    
    handleNextButtonClick() {
        this.currentQuestionIndex++;
        this.setNextQuestion();
    }
    
    setNextQuestion() {
        this.resetState();
        if (this.shuffledQuestions[this.currentQuestionIndex]) {
            this.showQuestion(this.shuffledQuestions[this.currentQuestionIndex]);
        } else {
            console.error("No question available at index", this.currentQuestionIndex);
        }
    }
    
    showQuestion(question) {
        this.questionElement.innerText = question.question;
        question.answers.forEach(answer => {
            const button = this.createAnswerButton(answer);
            this.answerButtonsElement.appendChild(button);
        });
    }

    createAnswerButton(answer) {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = "true";
        }
        button.addEventListener("click", this.selectAnswer.bind(this));
        return button
    }
    
    resetState() {
        this.clearStatusClass(document.body);
        this.nextButton.classList.add("hide");
        while (this.answerButtonsElement.firstChild) {
            this.answerButtonsElement.removeChild(this.answerButtonsElement.firstChild);
        }
    }
    
    selectAnswer(e) {
        const selectedButton = e.target;
        const correct = selectedButton.dataset.correct === "true";
        if (correct) this.score++;
        this.scoreElement.textContent = this.score;
        [...this.answerButtonsElement.children].forEach(button => {
            this.setStatusClass(button, button.dataset.correct === "true");
        });
        if (this.shuffledQuestions.length > this.currentQuestionIndex + 1) {
            this.nextButton.classList.remove("hide");
        } else {
            this.questionContainerElement.classList.add("hide");
            this.resultsElement.classList.remove("hide");
        }
    }
    
    setStatusClass(element, correct) {
        this.clearStatusClass(element);
        if (correct) {
            element.classList.add("correct");
        } else {
            element.classList.add("incorrect");
        }
    }
    
    clearStatusClass(element) {
        element.classList.remove("correct");
        element.classList.remove("incorrect");
    }
}