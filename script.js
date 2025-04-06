import { QuizApp } from './quizApp.js';
// Wait for the DOM to be fully loaded before initializing the QuizApp
document.addEventListener("DOMContentLoaded", () => {
    try{
        new QuizApp();
    }
    catch (error) {
        console.error("Error initializing QuizApp:", error);
    }
});