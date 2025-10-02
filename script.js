let currentUser = '';
let completedQuizzes = JSON.parse(localStorage.getItem('completedQuizzes')) || {};
let badges = JSON.parse(localStorage.getItem('badges')) || {};

const quizData = {
    general: [
        { q: "Capital of France?", options: ["Paris", "Rome", "Berlin", "London"], answer: "Paris" },
        { q: "5 + 7 = ?", options: ["10","12","13","14"], answer: "12" },
        { q: "Largest ocean?", options: ["Atlantic","Indian","Pacific","Arctic"], answer: "Pacific" },
        { q: "H2O is?", options: ["Oxygen","Water","Hydrogen","Helium"], answer: "Water" },
        { q: "Which planet is red?", options: ["Earth","Mars","Venus","Jupiter"], answer: "Mars" },
        { q: "Who wrote Hamlet?", options: ["Shakespeare","Dickens","Rowling","Tolkien"], answer: "Shakespeare" },
        { q: "Fastest land animal?", options: ["Tiger","Lion","Cheetah","Horse"], answer: "Cheetah" },
        { q: "5x5 =", options: ["10","20","25","30"], answer: "25" },
        { q: "Sun rises in?", options: ["West","East","North","South"], answer: "East" },
        { q: "First president of USA?", options: ["Lincoln","Washington","Adams","Jefferson"], answer: "Washington" }
    ],
    science: [
        { q: "Chemical symbol of Gold?", options: ["Au","Ag","Gd","Go"], answer: "Au" },
        { q: "Speed of light?", options: ["3x10^8 m/s","3x10^6","3x10^5","3x10^3"], answer: "3x10^8 m/s" },
        { q: "Earth is?", options: ["Flat","Sphere","Cube","Cylinder"], answer: "Sphere" },
        { q: "Force formula?", options: ["m/v","m*a","m+a","m-a"], answer: "m*a" },
        { q: "Plants make food by?", options: ["Photosynthesis","Respiration","Digestion","Excretion"], answer: "Photosynthesis" },
        { q: "Hottest planet?", options: ["Venus","Mercury","Mars","Earth"], answer: "Venus" },
        { q: "Atoms are made of?", options: ["Protons","Neutrons","Electrons","All"], answer: "All" },
        { q: "Boiling point of water?", options: ["90°C","100°C","120°C","80°C"], answer: "100°C" },
        { q: "Gravity discovered by?", options: ["Newton","Einstein","Galileo","Tesla"], answer: "Newton" },
        { q: "Sound needs?", options: ["Air","Vacuum","Water","None"], answer: "Air" }
    ],
    english: [
        { q: "Synonym of 'Happy'?", options: ["Sad","Joyful","Angry","Tired"], answer: "Joyful" },
        { q: "Antonym of 'Big'?", options: ["Small","Large","Huge","Tall"], answer: "Small" },
        { q: "Plural of 'Mouse'?", options: ["Mouses","Mice","Mices","Mouse"], answer: "Mice" },
        { q: "Choose correct sentence", options: ["She go to school","She goes to school","She going to school","She gone school"], answer: "She goes to school" },
        { q: "Synonym of 'Quick'?", options: ["Fast","Slow","Lazy","Late"], answer: "Fast" },
        { q: "Opposite of 'Arrive'?", options: ["Depart","Reach","Come","Go"], answer: "Depart" },
        { q: "Correct spelling?", options: ["Recieve","Receive","Recive","Recvee"], answer: "Receive" },
        { q: "Choose proper article: ___ apple", options: ["A","An","The","No article"], answer: "An" },
        { q: "Past tense of 'Go'?", options: ["Goed","Went","Gone","Going"], answer: "Went" },
        { q: "Synonym of 'Begin'?", options: ["Start","Stop","Finish","End"], answer: "Start" }
    ],
    computer: [
        { q: "Full form of CPU?", options: ["Central Processing Unit","Computer Processing Unit","Control Processing Unit","Central Program Unit"], answer: "Central Processing Unit" },
        { q: "RAM stands for?", options: ["Random Access Memory","Read Access Memory","Run Active Memory","Read All Memory"], answer: "Random Access Memory" },
        { q: "HTML is used for?", options: ["Design","Structure","Programming","Database"], answer: "Structure" },
        { q: "Which is not programming language?", options: ["Python","Java","HTML","C++"], answer: "HTML" },
        { q: "OS stands for?", options: ["Operating System","Open Software","Output System","Online Service"], answer: "Operating System" },
        { q: "Primary device for input?", options: ["Keyboard","Monitor","Printer","Speaker"], answer: "Keyboard" },
        { q: "Primary device for output?", options: ["Keyboard","Monitor","CPU","Mouse"], answer: "Monitor" },
        { q: "Binary number contains?", options: ["0,1","0-9","A-F","All digits"], answer: "0,1" },
        { q: "Which is storage device?", options: ["RAM","CPU","Hard Disk","Monitor"], answer: "Hard Disk" },
        { q: "Which is software?", options: ["Windows","Keyboard","Monitor","CPU"], answer: "Windows" }
    ],
    current: [
        { q: "President of India 2025?", options: ["Droupadi Murmu","Ram Nath Kovind","Pranab Mukherjee","A.P.J. Abdul Kalam"], answer: "Droupadi Murmu" },
        { q: "World Cup 2023 winner?", options: ["India","Australia","England","New Zealand"], answer: "India" },
        { q: "Largest country by area?", options: ["Russia","USA","China","Canada"], answer: "Russia" },
        { q: "UN founded in?", options: ["1945","1939","1919","1950"], answer: "1945" },
        { q: "Biggest tech company?", options: ["Apple","Microsoft","Google","Amazon"], answer: "Apple" },
        { q: "Latest iPhone series?", options: ["14","15","13","12"], answer: "15" },
        { q: "AI model by OpenAI?", options: ["ChatGPT","Bard","Siri","Alexa"], answer: "ChatGPT" },
        { q: "Most populated country?", options: ["China","India","USA","Indonesia"], answer: "China" },
        { q: "Highest mountain?", options: ["K2","Everest","Kangchenjunga","Lhotse"], answer: "Everest" },
        { q: "Olympics 2024 host?", options: ["Paris","Tokyo","London","Los Angeles"], answer: "Paris" }
    ]
};

let currentQuiz = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;

// Login
function login() {
    const name = document.getElementById('username').value.trim();
    if(name){
        currentUser = name;
        document.getElementById('login-page').classList.remove('active');
        document.getElementById('home-page').classList.add('active');
        document.getElementById('profile-name').innerText = currentUser;
        updateProfile();
    } else alert("Enter your name");
}

// Logout
function logout(){
    location.reload();
}

// Update profile & progress
function updateProfile(){
    let completed = (completedQuizzes[currentUser] || []).length;
    document.getElementById('completed-quizzes').innerText = completed;
    document.getElementById('badges-earned').innerText = (badges[currentUser] || []).length;
    let progress = completed * 10;
    if(progress > 100) progress = 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

// Start quiz
function startQuiz(topic){
    if(!quizData[topic]){
        alert("No questions for this topic");
        return;
    }
    currentQuiz = quizData[topic];
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById('home-page').classList.remove('active');
    document.getElementById('quiz-page').classList.add('active');
    document.getElementById('quiz-topic').innerText = topic.toUpperCase();
    showQuestion();
}

// Show question
function showQuestion(){
    if(currentQuestionIndex >= currentQuiz.length){
        endQuiz();
        return;
    }
    const q = currentQuiz[currentQuestionIndex];
    document.getElementById('question-text').innerText = q.q;
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    q.options.forEach(option=>{
        const btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = ()=>checkAnswer(option);
        optionsDiv.appendChild(btn);
    });
    startTimer();
}

// Timer
function startTimer(){
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById('timer').innerText = timeLeft;
    timer = setInterval(()=>{
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if(timeLeft<=0){
            clearInterval(timer);
            nextQuestion();
        }
    },1000);
}

// Check answer
function checkAnswer(option){
    const correct = currentQuiz[currentQuestionIndex].answer;
    if(option === correct) score++;
    clearInterval(timer);
    nextQuestion();
}

// Next question
function nextQuestion(){
    currentQuestionIndex++;
    showQuestion();
}

// End quiz
function endQuiz(){
    document.getElementById('quiz-page').classList.remove('active');
    document.getElementById('result-page').classList.add('active');

    document.getElementById('score-text').innerText = `Score: ${score} / ${currentQuiz.length}`;
    let feedback = score>=8 ? "Excellent!" : score>=5 ? "Good! But practice more" : "Keep practicing!";
    document.getElementById('feedback-text').innerText = feedback;

    let badge = score>=8 ? "Gold" : score>=5 ? "Silver" : "Bronze";
    document.getElementById('badge-text').innerText = badge;

    completedQuizzes[currentUser] = completedQuizzes[currentUser] || [];
    completedQuizzes[currentUser].push(document.getElementById('quiz-topic').innerText);

    badges[currentUser] = badges[currentUser] || [];
    badges[currentUser].push(badge);

    localStorage.setItem('completedQuizzes', JSON.stringify(completedQuizzes));
    localStorage.setItem('badges', JSON.stringify(badges));
}

// Go home
function goHome(){
    document.getElementById('result-page').classList.remove('active');
    document.getElementById('home-page').classList.add('active');
    updateProfile();
}
