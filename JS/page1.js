let c = console.log.bind(document);

//Se não houver dados no local storage cria. 
if (localStorage.length === 0) {
    localStorage.setItem("idQuizz", "[]")
}

//Chama os dados do localstorage dos quizzes do usuário.
let idList = [];
idList = localStorage.getItem("idQuizz");


const userQuizzes = document.querySelector(".userQuizz .quizzes")
const otherQuizzes = document.querySelector(".otherQuizz .quizzes")

//Separa os quizzes do usuário dos demais quizzes.
function gerarQuizzes(response) {
    for (let i = 0; i < response.data.length; i++) {
        for (let j = 0; j < idList.length; j++) {
            if (response.data[i].id === JSON.parse(idList)[j]) {
                userQuizzes.innerHTML += `<div id = "${response.data[i].id}" class="quizz" onclick="goToAnswerQuizz(this)"><img src="${response.data[i].image}" alt="Não foi possível carregar esta imagem."><p>${response.data[i].title}</p><div class="degrade"></div></div>`
            }
        }
        otherQuizzes.innerHTML += `<div id = "${response.data[i].id}" class="quizz" onclick="goToAnswerQuizz(this)"><img src="${response.data[i].image}" alt="Não foi possível carregar esta imagem."><p>${response.data[i].title}</p><div class="degrade"></div></div>`
    }
}

//Quando concluir a chamada ao servidor chama a função que separa os quizzes.
let promiseQuizzes = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes")
promiseQuizzes.then(gerarQuizzes)

//Ao clicar num quizz a função é chamada fazendo a requisição do quizz em específico.
function goToAnswerQuizz(element) {
    let id = Number(element.id)
    let promiseQuizz = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${id}`)
    promiseQuizz.then(gerarQuizz)
}

//Após o servidor responder, o quizz é montado na página 2. (Obs.: ainda tem q consertar a parte do answers, mas n sei como.)
function gerarQuizz(response) {
    const questions = response.data.questions;


    document.querySelector(".quizzPlay").innerHTML = `<div class="headerQuizzPlay"><div class="degrade"></div><img src="${response.data.image}"alt="Não foi possível carregar a imagem, use uma url de imagem."><p>${response.data.title}</p></div>`
    //Coloca as perguntas na página.
    for (let i = 0; i < questions.length; i++) {
        document.querySelector(".quizzPlay").innerHTML += `
        <div class="quizzPlayQuestion">
                <div class="titleQuestion" >
                    <p>${questions[i].title}</p>
                </div>
                <span class="rowOfAnswers">
             </span>
        </div>`
        //coloca as respostas nas perguntas
        for (let a = 0; a < questions[i].answers.length; a++) {

            let arrRowOfAnswers = document.querySelectorAll(".rowOfAnswers"); //cria uma array de rowOfAnswers
            //entra na primeira pergunta e coloca a quantidade de answers

            arrRowOfAnswers[i].innerHTML += `<div class="answer ${questions[i].answers[a].isCorrectAnswer}">
        <img src="${questions[i].answers[a].image}" alt="Não foi possível carregar a imagem." onclick="answerChoose(this)">
        <div class="nonChoiced hide"></div>
        <p>${questions[i].answers[a].text}</p>
    </div>`
        }

    }

    //Esconde a home e abre a página 2.
    document.querySelector(".home").classList.add("hide")
    document.querySelector(".quizzPlay").classList.remove("hide")
}
function shuffle() {
    return Math.random() - 0.5;
}