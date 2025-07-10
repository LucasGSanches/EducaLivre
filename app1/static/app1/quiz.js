// app1/static/app1/quiz.js

document.addEventListener('DOMContentLoaded', () => {
    const ui = {
        loadingState: document.getElementById('loading-state'),
        quizContent: document.getElementById('quiz-content'),
        topicTitle: document.getElementById('quiz-topic-title'),
        questionCounter: document.getElementById('question-counter'),
        progressBarFill: document.getElementById('progress-bar-fill'),
        questionText: document.getElementById('question-text'),
        optionsArea: document.getElementById('options-area'),
        submitBtn: document.getElementById('submit-btn'),
        resultsScreen: document.getElementById('results-screen'),
        scoreCorrect: document.getElementById('score-correct'),
        scoreTotal: document.getElementById('score-total'),
        scoreMessage: document.getElementById('score-message'),
        restartBtn: document.getElementById('restart-btn'),
        backToSubjectBtn: document.getElementById('back-to-subject-btn'),
    };

    const state = {
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        selectedOptionId: null,
        topicName: JSON.parse(document.getElementById('topic-name').textContent),
    };

    async function fetchQuizData() {
        try {
            const response = await fetch(`/api/quiz/${state.topicName}/`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Erro na API: ${response.statusText}`);
            }
            state.questions = await response.json();
            if (state.questions.length === 0) {
                showError("Nenhuma pergunta encontrada para este tópico. Cadastre-as no painel de Admin.");
            } else {
                startGame();
            }
        } catch (error) {
            console.error("Falha ao buscar perguntas:", error);
            showError(`Não foi possível carregar o quiz. Detalhe: ${error.message}`);
        }
    }

    function showError(message) {
        ui.loadingState.innerHTML = `<h2>Erro!</h2><p>${message}</p><button onclick="window.history.back()">Voltar</button>`;
    }


    function startGame() {
        state.currentQuestionIndex = 0;
        state.score = 0;
        
        // Esconde a tela de resultados e mostra a de perguntas
        ui.resultsScreen.classList.add('hidden');
        ui.loadingState.classList.add('hidden');
        ui.quizContent.classList.remove('hidden');

        // Embaralha as perguntas para o quiz ser diferente a cada vez que é iniciado
        state.questions.sort(() => Math.random() - 0.5);

        ui.topicTitle.textContent = state.topicName;
        displayQuestion();
    }


    function displayQuestion() {
        resetStateForNewQuestion();
        const question = state.questions[state.currentQuestionIndex];
        ui.questionText.textContent = question.texto;
        
        ui.optionsArea.innerHTML = '';
        // Embaralha as opções também!
        question.opcoes.sort(() => Math.random() - 0.5);
        
        question.opcoes.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.dataset.id = option.id;
            // Usar textContent previne a interpretação de HTML nas opções
            button.textContent = option.texto;
            button.addEventListener('click', () => selectOption(button));
            ui.optionsArea.appendChild(button);
        });

        updateProgress();
    }

    function resetStateForNewQuestion() {
        state.selectedOptionId = null;
        ui.submitBtn.classList.add('hidden');
        ui.submitBtn.textContent = 'Verificar';
        // Re-associa o evento principal ao botão, garantindo que ele sempre faça a verificação
        ui.submitBtn.onclick = checkAnswer;
        
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('selected', 'correct', 'incorrect');
        });
    }

    function updateProgress() {
        ui.questionCounter.textContent = `Pergunta ${state.currentQuestionIndex + 1} de ${state.questions.length}`;
        const progressPercent = ((state.currentQuestionIndex + 1) / state.questions.length) * 100;
        ui.progressBarFill.style.width = `${progressPercent}%`;
    }

    function selectOption(button) {
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        state.selectedOptionId = parseInt(button.dataset.id);
        ui.submitBtn.classList.remove('hidden');
    }

    function checkAnswer() {
        if (state.selectedOptionId === null) return; // Não faz nada se nada foi selecionado

        const question = state.questions[state.currentQuestionIndex];
        const correctOptionId = question.resposta;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.disabled = true;
            const optionId = parseInt(btn.dataset.id);
            if (optionId === correctOptionId) {
                btn.classList.add('correct');
            } else if (optionId === state.selectedOptionId) {
                btn.classList.add('incorrect');
            }
        });

        if (state.selectedOptionId === correctOptionId) {
            state.score++;
        }

        // Prepara o botão para a próxima ação
        const isLastQuestion = state.currentQuestionIndex === state.questions.length - 1;
        ui.submitBtn.textContent = isLastQuestion ? 'Ver Resultados' : 'Próxima Pergunta';
        ui.submitBtn.onclick = moveToNextQuestion;
    }

    function moveToNextQuestion() {
        state.currentQuestionIndex++;
        if (state.currentQuestionIndex < state.questions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }

    function showResults() {
        ui.quizContent.classList.add('hidden');
        ui.resultsScreen.classList.remove('hidden');

        ui.scoreCorrect.textContent = state.score;
        ui.scoreTotal.textContent = state.questions.length;

        const percentage = (state.score / state.questions.length) * 100;
        let message = '';
        if (percentage === 100) message = "Excelente! Você acertou tudo!";
        else if (percentage >= 70) message = "Muito bem! Continue praticando.";
        else if (percentage >= 50) message = "Bom esforço! Que tal revisar o material?";
        else message = "Não desanime! O aprendizado é um processo contínuo.";
        ui.scoreMessage.textContent = message;
    }

    // --- OTIMIZAÇÃO APLICADA AQUI ---
    // Agora o botão "Tentar Novamente" chama diretamente a função startGame,
    // que é mais eficiente pois não busca os dados da internet novamente.
    ui.restartBtn.addEventListener('click', startGame);

    ui.backToSubjectBtn.addEventListener('click', () => {
        // Lógica para voltar para a página da matéria (já estava correta)
        window.history.back(); // Uma forma mais simples de voltar para a página anterior
    });

    // Inicia o processo ao carregar a página
    fetchQuizData();
});