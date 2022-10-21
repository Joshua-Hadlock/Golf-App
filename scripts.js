// function getAvailableCourses() {
//     return fetch('https://golf-courses-api.herokuapp.com/courses/').then(
//       function (response) {
//         return response.json();
//       }
//     );
//    }
let greencolor = '#a4d9a5';
player = [];
var length = 0;
let data = {};
   async function getAvailableCourses() {
    let response = await fetch('https://golf-courses-api.herokuapp.com/courses/');
    data = await response.json();
    return data.courses;
}


async function askCourses() {
let result = await getAvailableCourses();
let courseOptionsHtml = '';
let n = 0;
await result.forEach((course) => {
 courseOptionsHtml += `<option value='{"id": "${course.id}","number": ${n}}'>${course.name}</option>`;
 n += 1;
});

document.getElementById('course-select').innerHTML = courseOptionsHtml;

}
askCourses()

var select = document.getElementById('course-select');

async function getCourseData() {
    select = document.getElementById('course-select');
    
        select = JSON.parse(select.value);
        
    
    
    let response = await fetch('https://golf-courses-api.herokuapp.com/courses/' + select.id);
    let courseData = await response.json();
    return courseData.data;
}

async function functionTeeBox() {
    renderBackPicture();
    document.getElementsByClassName('invisibleSelect')[0].classList.remove('invisible');
    document.getElementsByClassName('invisibleSelect')[1].classList.remove('invisible');
    let result = await getCourseData();
    let teeBoxes = result.holes[0].teeBoxes;
    let teeBoxSelectHtml = ''
await teeBoxes.forEach(function (teeBox, index) {
   teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.yards} yards</option>`
});

document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}



// rendering the score card ------------------------------------------------------------------------------------------------------------
let teeBoxChoice = 0;
async function renderScoreCard() {
    let result = await getCourseData();
    length = result.holes.length;
    teeBoxChoice = document.getElementById('tee-box-select').value

    //rendering the header ---------------------------------------------------------------------------------------------------------------
    let innerTableContent = '<th scope="col">Holes</th>';

    document.getElementById('scorecard').innerHTML = '<thead id="tableHeader"></thead><tbody id="tableBody"></tbody>';

    // out -------
    for (let i = 0; i < length / 2; i++) {
        innerTableContent += `<th scope="col">${result.holes[i].hole}</th>`
    }
    innerTableContent += '<th scope="col">Out</th>'

    // in --------
    for (let i = length / 2; i < length; i++) {
        innerTableContent += `<th scope="col">${result.holes[i].hole}</th>`
    }
    innerTableContent += '<th scope="col">In</th>'
    innerTableContent += '<th scope="col">Total</th>'


    document.getElementById('tableHeader').innerHTML = `<tr>${innerTableContent}</tr>`;



    //rendering the body ---------------------------------------------------------------------------------------------------------------

    // yardage ----------------------------------------------------------------------------------------------------------------------------------

    innerTableContentBody = '<tr><th scope="col">Yardage</th>';
    let yardOut = 0;
    let parOut = 0;
    let hcpOut = 0;
    let total = 0;
    
    //out ------
    for (let i = 0; i < length / 2; i++) {
        yardage = result.holes[i].teeBoxes[teeBoxChoice].yards;
        yardOut += yardage;
        total += yardage;
    innerTableContentBody += `<th scope="col">${yardage}</th>`}
    innerTableContentBody += `<th scope="col">${yardOut}</th>`
    
    //in -------
    yardOut = 0;
    for (let i = length / 2; i < length; i++) {
        yardage = result.holes[i].teeBoxes[teeBoxChoice].yards;
        yardOut += yardage;
        total += yardage;
    innerTableContentBody += `<th scope="col">${yardage}</th>`}
    innerTableContentBody += `<th scope="col">${yardOut}</th>`;
    innerTableContentBody += `<th scope="col">${total}</th></tr>`;





        // Par -----------------------------------------------------------------------------------------------------------------------------------
        total = 0;
        // out -----
        innerTableContentBody += '<tr><th scope="col">Par</th>';
        for (let i = 0; i < length / 2; i++) {
            pars = result.holes[i].teeBoxes[teeBoxChoice].par;
            parOut += pars;
            total += pars;
        innerTableContentBody += `<th scope="col">${pars}</th>`}
        innerTableContentBody += `<th scope="col">${parOut}</th>`
        
        // in -----
        parOut = 0;
        for (let i = length / 2; i < length; i++) {
            pars = result.holes[i].teeBoxes[teeBoxChoice].par;
            parOut += pars;
            total += pars;
        innerTableContentBody += `<th scope="col">${pars}</th>`}
        innerTableContentBody += `<th scope="col">${parOut}</th>`
        innerTableContentBody += `<th scope="col">${total}</th></tr>`;


        // handicap ------------------------------------------------------------------------------------------------------------------------------
        total = 0;
        // out -----
        innerTableContentBody += '<tr><th scope="col">handicap</th>';
        for (let i = 0; i < length / 2; i++) {
            hcp = result.holes[i].teeBoxes[teeBoxChoice].hcp;
            hcpOut += hcp;
            total += hcp;
        innerTableContentBody += `<th scope="col">${hcp}</th>`}
        innerTableContentBody += `<th scope="col">${hcpOut}</th>`;

        // in -----
        hcpOut = 0;
        for (let i = length / 2; i < length; i++) {
            hcp = result.holes[i].teeBoxes[teeBoxChoice].hcp;
            hcpOut += hcp;
            total += hcp;
        innerTableContentBody += `<th scope="col">${hcp}</th>`}
        innerTableContentBody += `<th scope="col">${hcpOut}</th>`;
        innerTableContentBody += `<th scope="col">${total}</th></tr>`;

// add all players --------------------------------------------------------------------------------------------------------------------
        for (let j = 0; j < player.length; j++) {
            total = 0;
            let done = true;
            let bigPlayerScore = 0;
            innerTableContentBody += `<tr><th scope="col">${player[j].name}</th>`


            // out --------
            for (let i = 0; i < length / 2; i++) {
                if (player[j].scores[i]) {
                    playerScore = player[j].scores[i]
                    bigPlayerScore += playerScore;
                    total += playerScore
                } else {
                    done = false;
                    playerScore = '';
                }
                innerTableContentBody += `<th onclick='addScoreData(${i}, ${player[j].id}, ${j})' data-bs-toggle="modal" data-bs-target="#newScoreModal">${playerScore}</th>`
            }
            innerTableContentBody += `<th scope="col">${bigPlayerScore}</th>`;

            // in ---------
            bigPlayerScore = 0;
            for (let i = length / 2; i < length; i++) {
                if (player[j].scores[i]) {
                    playerScore = player[j].scores[i]
                    bigPlayerScore += playerScore;
                    total += playerScore;
                } else {
                    done = false;
                    playerScore = '';
                }
                innerTableContentBody += `<th onclick='addScoreData(${i}, ${player[j].id}, ${j})' data-bs-toggle="modal" data-bs-target="#newScoreModal">${playerScore}</th>`
            }
            innerTableContentBody += `<th scope="col">${bigPlayerScore}</th>`;
            innerTableContentBody += `<th scope="col">${total}</th></tr>`;

            // toastr for when game is complete --------------------
            if (done === true && player[j].completed === false) {
                toastr.options = {
                    "closeButton": false,
                    "debug": false,
                    "newestOnTop": false,
                    "progressBar": false,
                    "positionClass": "toast-top-right",
                    "preventDuplicates": false,
                    "onclick": null,
                    "showDuration": "300",
                    "hideDuration": "1000",
                    "timeOut": "5000",
                    "extendedTimeOut": "1000",
                    "showEasing": "swing",
                    "hideEasing": "linear",
                    "showMethod": "fadeIn",
                    "hideMethod": "fadeOut"
                  }
                toastr.success(`${player[j].name} has completed course ${result.name}!`, `Congratulations!!!`)
                player[j].completed = true;
            }

        }

    document.getElementById('tableBody').innerHTML =  innerTableContentBody;
    document.getElementById('addPlayer').style.visibility = 'visible';
    document.getElementById('header').innerHTML = `<h2>${result.name}</h2><div class='coolBorder my-1'></div>`;

}

async function renderBackPicture() {
    document.getElementsByTagName('body')[0].style.backgroundImage = null;
    let result = await getAvailableCourses();
    document.getElementsByTagName('body')[0].style.backgroundImage = await `url('${result[select.number].image}')`;
}

class players {
    constructor(name, id = getNextId(), scores = []) {
        this.name = name;
        this.id = id;
        this.scores = scores;
        this.completed = false;
    }

    makeEmptyScores() {
        for (let i = 0; i < length ; i++) {
            this.scores.push(null);
        }
    }
}
let buttonCounter = 0;
function addPerson() {
    
    if (buttonCounter === 0) {
        document.getElementsByClassName('createName')[0].style.visibility = 'visible';
        document.getElementsByClassName('createName')[0].classList.remove('animate__zoomOut');
        document.getElementsByClassName('createName')[0].classList.add('animate__zoomIn');
        buttonCounter = 1;
    } else if (buttonCounter === 1) {
        document.getElementsByClassName('createName')[0].classList.remove('animate__zoomIn');
        document.getElementsByClassName('createName')[0].classList.add('animate__zoomOut');
        setTimeout(() => document.getElementsByClassName('createName')[0].style.visibility = 'hidden', 400);
        buttonCounter = 0
    }
}

function updateTable(name) {
    if (name) {
    let myMan = new players(name);
    myMan.makeEmptyScores();
    player.push(myMan);
    renderScoreCard();
    }
}

function getNextId() {
    let stamp = new Date().getTime()
    return stamp
}

var currentScoreId = 0;
var currentPlayerId = 0;
var currentPlayerNumber = 0;

function addScoreData(scoreId, playerId, playerNumber) {
    currentPlayerNumber = playerNumber;
    currentPlayerId = playerId;
    currentScoreId = scoreId;
}
async function addScore() {
    let result = await getCourseData();

    // - result.holes[currentScoreId].teeBoxes[teeBoxChoice].hcp
    player[currentPlayerNumber].scores[currentScoreId] = parseInt(document.getElementById('score').value);
    renderScoreCard();
}

function invis() {
    document.getElementsByClassName('invisibleSelect')[0].classList.add('invisible');
    document.getElementsByClassName('invisibleSelect')[1].classList.add('invisible');
}