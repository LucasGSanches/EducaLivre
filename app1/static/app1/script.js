// ===================================================================================
// --- 1. FUNÇÕES GERAIS E DE UTILIDADE ---
// ===================================================================================

function saveProgress(topic, type, subject) {
    console.group("💾 SAVE PROGRESS");
    console.log(`Matéria: ${subject}`);
    console.log(`Tópico: ${topic}`);
    console.log(`Tipo de Atividade: ${type}`);
    console.log("Demonstração: Esta função salvaria essa informação no localStorage.");
    console.groupEnd();
}

function loadProgress(subject) {
    console.group("🔄 LOAD PROGRESS");
    console.log(`Matéria a ser carregada: ${subject}`);
    console.log("Demonstração: Esta função leria o localStorage e atualizaria a página.");
    console.groupEnd();
}

async function generic_handleDownloadPDF(topic, subject) {
    console.log(`Iniciando download para: Tópico=${topic}, Matéria=${subject}`);
    const subjectPath = subject === 'math' ? 'matematica' : 'portugues';
    const fileName = `${topic.toLowerCase().replace(/\s+/g, '-')}.pdf`;
    const filePath = `/media/pdfs/${subjectPath}/${fileName}`;
    
    try {
        const response = await fetch(filePath, { method: 'HEAD' });
        if (response.ok) {
            console.log(`PDF encontrado em ${filePath}. Baixando...`);
            const link = document.createElement('a');
            link.href = filePath;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            saveProgress(topic, 'pdf', subject);
        } else {
            console.warn(`PDF não encontrado: ${filePath}`);
            alert(`Desculpe, o PDF sobre "${topic}" ainda não está disponível.`);
        }
    } catch (error) {
        console.error('Erro de rede ao tentar baixar o PDF:', error);
        alert('Ocorreu um erro de rede. Por favor, tente novamente.');
    }
}

function generic_handleStartQuiz(topic, subject) {
    console.log(`Iniciando quiz para: Tópico=${topic}, Matéria=${subject}`);
    window.location.href = `/quiz/${encodeURIComponent(topic)}/`;
    saveProgress(topic, 'quiz', subject);
}

function handleGoBack() {
    window.location.href = "/";
}

function animateCards() {
    const cards = document.querySelectorAll('.topic-card, .activity-card');
    cards.forEach((card) => {
        const delay = parseInt(card.dataset.delay) || 0;
        setTimeout(() => {
            card.classList.add('visible');
        }, delay);
    });
}

// ===================================================================================
// --- 2. LÓGICA DA CALCULADORA ---
// ===================================================================================

const Calculator = {
    // ... Todo o código da calculadora que já fizemos ...
    expression: '', result: '0', display: { expression: null, result: null },
    init() {
        this.display.expression = document.getElementById('expressionDisplay');
        this.display.result = document.getElementById('resultDisplay');
        const calculatorElement = document.querySelector('.calculator');
        const backButton = document.getElementById('backToMathBtn');
        if (!calculatorElement || !this.display.expression) return;
        calculatorElement.querySelector('.buttons-grid').addEventListener('click', (event) => {
            const button = event.target.closest('.btn');
            if (button) {
                const { action, value } = button.dataset;
                if (value) this.addToExpression(value); else if (action) this[action]();
            }
        });
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        if (backButton) { backButton.addEventListener('click', () => { window.location.href = "/matematica/"; }); }
        this.updateDisplay();
        console.log("Calculadora inicializada com sucesso!");
    },
    addToExpression(value) {
        if (this.expression === '0' && !isNaN(value) && value !== '.') this.expression = value;
        else this.expression += value;
        this.updateDisplay();
    },
    updateDisplay() { if (this.display.expression) this.display.expression.textContent = this.expression || '0'; },
    calculateResult() {
        if (!this.expression) return;
        try {
            let evalExpression = this.expression.replace(/×/g, '*').replace(/÷/g, '/');
            if (!/^[0-9+\-*/.() ]+$/.test(evalExpression)) throw new Error('Expressão inválida');
            const evalResult = new Function('"use strict"; return (' + evalExpression + ')')();
            if (isNaN(evalResult) || !isFinite(evalResult)) throw new Error('Resultado inválido');
            this.result = this.formatNumber(evalResult);
            this.display.result.textContent = this.result;
            this.expression = this.result;
        } catch (error) { this.showError(); }
    },
    clearAll() { this.expression = ''; this.result = '0'; if (this.display.result) this.display.result.textContent = '0'; this.updateDisplay(); },
    clearEntry() { this.expression = ''; this.updateDisplay(); },
    deleteLast() { this.expression = this.expression.slice(0, -1); this.updateDisplay(); },
    showError() {
        this.display.result.textContent = 'Erro'; this.display.result.classList.add('error');
        setTimeout(() => { if (this.display.result) { this.display.result.classList.remove('error'); this.display.result.textContent = this.result; } }, 1500);
    },
    formatNumber(num) { return Number.isInteger(num) ? num.toString() : parseFloat(num.toFixed(8)).toString(); },
    handleKeyboard(event) {
        const key = event.key;
        if (key >= '0' && key <= '9' || ['+', '-', '.',].includes(key)) this.addToExpression(key);
        else if (key === '*') this.addToExpression('×');
        else if (key === '/') { event.preventDefault(); this.addToExpression('÷'); }
        else if (key === 'Enter' || key === '=') { event.preventDefault(); this.calculateResult(); }
        else if (key === 'Backspace') this.deleteLast();
        else if (key.toLowerCase() === 'c' || key === 'Escape') this.clearAll();
    }
};

// ===================================================================================
// --- 3. LÓGICA DO DICIONÁRIO ---
// ===================================================================================
const Dicionario = {
    db: {
        'cão':{type:'substantivo masculino',definition:'Animal doméstico da família dos canídeos, conhecido por sua lealdade ao ser humano.',examples:['O cão late quando vê estranhos.','Meu cão gosta de brincar no parque.']},'gato':{type:'substantivo masculino',definition:'Animal doméstico da família dos felídeos, conhecido por sua independência e agilidade.',examples:['O gato subiu na árvore.','Minha gata dorme o dia todo.']},'pássaro':{type:'substantivo masculino',definition:'Animal vertebrado que possui penas, bico e geralmente consegue voar.',examples:['O pássaro canta pela manhã.','Vi um pássaro colorido no jardim.']},'peixe':{type:'substantivo masculino',definition:'Animal aquático que respira por brânquias e geralmente tem escamas.',examples:['O peixe nada no aquário.','Pescamos um peixe grande no rio.']},'azul':{type:'adjetivo',definition:'Cor que lembra o céu limpo ou o mar profundo.',examples:['O céu está azul hoje.','Ela usa uma blusa azul.']},'vermelho':{type:'adjetivo',definition:'Cor que lembra o sangue ou uma rosa vermelha.',examples:['A maçã é vermelha.','O carro vermelho é muito bonito.']},'verde':{type:'adjetivo',definition:'Cor que lembra as folhas das árvores ou a grama.',examples:['As plantas são verdes.','Gosto da cor verde.']},'amarelo':{type:'adjetivo',definition:'Cor que lembra o sol ou uma banana madura.',examples:['O sol é amarelo.','A banana amarela está doce.']},'branco':{type:'adjetivo',definition:'Cor clara como a neve ou o leite.',examples:['A neve é branca.','Uso uma camisa branca.']},'preto':{type:'adjetivo',definition:'Cor escura como a noite sem lua.',examples:['O gato preto dormiu.','Gosto de roupas pretas.']},'mãe':{type:'substantivo feminino',definition:'Mulher que deu à luz ou criou uma criança; genitora.',examples:['Minha mãe cozinha muito bem.','A mãe cuida dos filhos com amor.']},'pai':{type:'substantivo masculino',definition:'Homem que gerou ou criou uma criança; genitor.',examples:['Meu pai trabalha todos os dias.','O pai brinca com os filhos.']},'irmão':{type:'substantivo masculino',definition:'Pessoa do sexo masculino que tem os mesmos pais que outra.',examples:['Meu irmão é mais novo que eu.','O irmão ajuda a irmã.']},'irmã':{type:'substantivo feminino',definition:'Pessoa do sexo feminino que tem os mesmos pais que outra.',examples:['Minha irmã estuda medicina.','A irmã mais velha cuida dos pequenos.']},'avô':{type:'substantivo masculino',definition:'Pai do pai ou da mãe; ancestral masculino.',examples:['Meu avô conta histórias antigas.','O avô ensina a pescar.']},'avó':{type:'substantivo feminino',definition:'Mãe do pai ou da mãe; ancestral feminina.',examples:['Minha avó faz o melhor bolo.','A avó tricota um casaco.']},'escola':{type:'substantivo feminino',definition:'Instituição destinada ao ensino e à educação de crianças e jovens.',examples:['Vou para a escola todos os dias.','A escola tem uma biblioteca grande.']},'professor':{type:'substantivo masculino',definition:'Pessoa que ensina em escola, universidade ou curso.',examples:['O professor explica a matéria.','Minha professora é muito gentil.']},'livro':{type:'substantivo masculino',definition:'Conjunto de folhas impressas e encadernadas para leitura.',examples:['Estou lendo um livro interessante.','O livro está na mesa.']},'lápis':{type:'substantivo masculino',definition:'Instrumento para escrever ou desenhar, feito de madeira com grafite.',examples:['Escrevo com lápis no caderno.','O lápis quebrou na ponta.']},'caderno':{type:'substantivo masculino',definition:'Conjunto de folhas de papel encadernadas para escrever.',examples:['Anoto as lições no caderno.','Meu caderno tem capa azul.']},'amor':{type:'substantivo masculino',definition:'Sentimento de carinho, afeto e dedicação profunda por alguém ou algo.',examples:['O amor entre pais e filhos é especial.','Sinto muito amor pela minha família.']},'felicidade':{type:'substantivo feminino',definition:'Estado de quem se sente alegre, contente e satisfeito.',examples:['A felicidade está nas pequenas coisas.','Sua felicidade me deixa feliz também.']},'tristeza':{type:'substantivo feminino',definition:'Sentimento de pesar, melancolia ou desgosto.',examples:['A tristeza passou depois de conversar com amigos.','Não gosto de ver tristeza nos seus olhos.']},'alegria':{type:'substantivo feminino',definition:'Sentimento de contentamento e prazer; júbilo.',examples:['A alegria das crianças é contagiante.','Sinto alegria ao ver meus amigos.']},'árvore':{type:'substantivo feminino',definition:'Planta de grande porte, com tronco lenhoso e copa frondosa.',examples:['A árvore dá sombra no verão.','Subimos na árvore para pegar frutas.']},'flor':{type:'substantivo feminino',definition:'Parte colorida e perfumada de algumas plantas.',examples:['A flor tem um perfume doce.','Colhi flores para minha mãe.']},'sol':{type:'substantivo masculino',definition:'Estrela que ilumina e aquece a Terra durante o dia.',examples:['O sol brilha no céu.','Gosto de tomar sol na praia.']},'lua':{type:'substantivo feminino',definition:'Satélite natural da Terra que brilha à noite.',examples:['A lua está cheia hoje.','As crianças olham a lua no céu.']},'estrela':{type:'substantivo feminino',definition:'Corpo celeste que brilha no céu noturno.',examples:['A estrela mais brilhante é Vênus.','Contamos as estrelas no céu.']},'casa':{type:'substantivo feminino',definition:'Construção destinada à habitação; lar, moradia.',examples:['Minha casa é azul.','Vamos para casa depois da escola.']},'água':{type:'substantivo feminino',definition:'Líquido transparente, incolor e essencial para a vida.',examples:['Preciso beber água.','A água do rio é cristalina.']},'comida':{type:'substantivo feminino',definition:'Alimento; aquilo que se come para nutrir o corpo.',examples:['A comida está deliciosa.','Minha mãe prepara a comida com carinho.']},'amigo':{type:'substantivo masculino',definition:'Pessoa com quem se tem amizade; companheiro querido.',examples:['Meu amigo me ajuda sempre.','Um bom amigo é um tesouro.']},'família':{type:'substantivo feminino',definition:'Grupo de pessoas ligadas por parentesco ou afeto.',examples:['Amo minha família.','A família se reúne aos domingos.']},'brinquedo':{type:'substantivo masculino',definition:'Objeto destinado a divertir, especialmente crianças.',examples:['A criança brinca com seu brinquedo favorito.','Guardei os brinquedos na caixa.']},'música':{type:'substantivo feminino',definition:'Arte de combinar sons de forma harmoniosa e expressiva.',examples:['Gosto de ouvir música clássica.','A música alegra o coração.']},'dança':{type:'substantivo feminino',definition:'Arte de mover o corpo seguindo um ritmo.',examples:['Aprendi uma dança nova.','A dança é uma forma de expressão.']},'trabalho':{type:'substantivo masculino',definition:'Atividade física ou mental realizada para alcançar um objetivo.',examples:['Meu pai vai ao trabalho cedo.','O trabalho em equipe é importante.']},'tempo':{type:'substantivo masculino',definition:'Duração dos acontecimentos; período, época.',examples:['O tempo passa rápido.','Não tenho tempo para brincar agora.']}
    },
    elements: {},
    isLoading: false,
    
    init() {
        this.cacheElements();
        this.addEventListeners();
        this.populateSuggestions();
        this.updateWelcomeMessage();
        this.elements.searchInput.focus();
        console.log('Dicionário inicializado!');
    },
    
    cacheElements() {
        this.elements.searchInput = document.getElementById('searchInput');
        this.elements.clearBtn = document.getElementById('clearBtn');
        this.elements.searchBtn = document.getElementById('searchBtn');
        this.elements.searchBtnText = document.getElementById('searchBtnText');
        this.elements.loadingSpinner = document.getElementById('loadingSpinner');
        this.elements.suggestionTags = document.getElementById('suggestionTags');
        this.elements.welcomeMessage = document.getElementById('welcomeMessage');
        this.elements.loadingState = document.getElementById('loadingState');
        this.elements.wordResult = document.getElementById('wordResult');
        this.elements.notFound = document.getElementById('notFound');
        this.elements.searchedWord = document.getElementById('searchedWord');
        this.elements.wordsGrid = document.getElementById('wordsGrid');
        this.elements.wordCount = document.getElementById('wordCount');
        this.elements.welcomeWordCount = document.getElementById('welcomeWordCount');
        this.elements.backButton = document.getElementById('backToPortugueseBtn');
    },
    
    addEventListeners() {
        this.elements.searchBtn.addEventListener('click', () => this.searchWord());
        this.elements.clearBtn.addEventListener('click', () => this.clearSearch());
        this.elements.searchInput.addEventListener('input', () => {
            if (this.elements.searchInput.value.length > 0) this.elements.clearBtn.style.display = 'block';
            else this.elements.clearBtn.style.display = 'none';
        });
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWord();
        });
        if (this.elements.backButton) {
            this.elements.backButton.addEventListener('click', () => window.location.href = "/portugues/");
        }
    },

    populateSuggestions() {
        const words = Object.keys(this.db);
        const shuffled = words.sort(() => 0.5 - Math.random());
        const suggestions = shuffled.slice(0, 10);
        this.elements.suggestionTags.innerHTML = suggestions.map(word => `<button class="suggestion-tag">${word}</button>`).join('');
        this.elements.suggestionTags.addEventListener('click', (e) => {
            if (e.target.classList.contains('suggestion-tag')) {
                this.quickSearch(e.target.textContent);
            }
        });
    },
    
    updateWelcomeMessage() {
        const totalWords = Object.keys(this.db).length;
        if (this.elements.welcomeWordCount) {
            this.elements.welcomeWordCount.textContent = `Nosso dicionário contém ${totalWords} palavras básicas com definições e exemplos.`;
        }
    },

    searchWord() {
        const word = this.elements.searchInput.value.trim();
        if (!word) { alert('Por favor, digite uma palavra para buscar.'); return; }
        this.performSearch(word);
    },

    quickSearch(word) {
        this.elements.searchInput.value = word;
        this.performSearch(word);
    },

    async performSearch(word) {
        if (this.isLoading) return;
        this.showLoading();
        await new Promise(resolve => setTimeout(resolve, 500));
        const normalizedWord = word.toLowerCase().trim();
        const result = this.db[normalizedWord];
        this.hideLoading();
        if (result) this.displayWordResult(normalizedWord, result);
        else this.displayNotFound(word);
    },

    showLoading() {
        this.isLoading = true;
        this.elements.searchBtn.disabled = true;
        this.elements.searchBtnText.style.display = 'none';
        this.elements.loadingSpinner.style.display = 'block';
        this.elements.welcomeMessage.style.display = 'none';
        this.elements.wordResult.style.display = 'none';
        this.elements.notFound.style.display = 'none';
        this.elements.loadingState.style.display = 'flex';
    },

    hideLoading() {
        this.isLoading = false;
        this.elements.searchBtn.disabled = false;
        this.elements.searchBtnText.style.display = 'block';
        this.elements.loadingSpinner.style.display = 'none';
        this.elements.loadingState.style.display = 'none';
    },

    displayWordResult(word, result) {
        const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        this.elements.wordResult.innerHTML = `
            <div class="word-header"><h2 class="word-title">${capitalizedWord}</h2><span class="word-type">${result.type}</span></div>
            <div class="word-definition">${result.definition}</div>
            <div class="word-examples"><h4>Exemplos de uso:</h4><ul class="example-list">${result.examples.map(example => `<li>${example}</li>`).join('')}</ul></div>`;
        this.elements.wordResult.style.display = 'block';
    },
    
    displayNotFound(word) {
        this.elements.searchedWord.textContent = word;
        const words = Object.keys(this.db).sort();
        this.elements.wordsGrid.innerHTML = words.map(w => `<button class="word-btn">${w}</button>`).join('');
        this.elements.wordCount.innerHTML = `<strong>${words.length} palavras</strong> disponíveis`;
        this.elements.notFound.style.display = 'block';
        this.elements.wordsGrid.addEventListener('click', (e) => {
            if(e.target.classList.contains('word-btn')) {
                this.quickSearch(e.target.textContent);
            }
        });
    },

    clearSearch() {
        this.elements.searchInput.value = '';
        this.elements.clearBtn.style.display = 'none';
        this.elements.wordResult.style.display = 'none';
        this.elements.notFound.style.display = 'none';
        this.elements.welcomeMessage.style.display = 'block';
        this.elements.searchInput.focus();
    }
};

// ===================================================================================
// --- 4. LÓGICA PRINCIPAL (Executada quando a página carrega) ---
// ===================================================================================

document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/matematica')) {
        document.body.classList.add('math-page');
        animateCards();
        window.handleDownloadPDF = (topic) => generic_handleDownloadPDF(topic, 'math');
        window.handleStartQuiz = (topic) => generic_handleStartQuiz(topic, 'math');
    }
    else if (currentPath.includes('/portugues')) {
        document.body.classList.add('portuguese-page');
        animateCards();
        window.handleDownloadPDF = (topic) => generic_handleDownloadPDF(topic, 'portuguese');
        window.handleStartQuiz = (topic) => generic_handleStartQuiz(topic, 'portuguese');
    }
    else if (currentPath.includes('/calculadora')) {
        document.body.classList.add('calculator-page');
        Calculator.init();
    }
    else if (currentPath.includes('/dicionario')) {
        document.body.classList.add('dicionario-page');
        Dicionario.init();
    }
    else { // Página inicial
        document.body.classList.add('home-page');
        window.handleMathClick = () => window.location.href = "/matematica/";
        window.handlePortugueseClick = () => window.location.href = "/portugues/";
    }

    console.log("Script principal totalmente carregado. Página atual:", currentPath);
});