// global variables ----------------------------------------------------------------------------------------------------------------
let greencolor = '#a4d9a5';
player = [];
var length = 0;
let data = {};
var select = document.getElementById('course-select');
let buttonCounter = 0;
var currentScoreId = 0;
var currentPlayerId = 0;
var currentPlayerNumber = 0;
let teeBoxChoice = 0;

// players
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

// creates a unique Id for everyone
function getNextId() {
    let stamp = new Date().getTime()
    return stamp
}

// get Courses ----------------------------------------------------------------------------------------------------------------
   async function getAvailableCourses() {
    let response = await fetch('https://golf-courses-api.herokuapp.com/courses/');
    data = await response.json();
    return data.courses;
}

// get courses and display to page ----------------------------------------------------------------------------------------------------------------
async function askCourses() {
let result = await getAvailableCourses();
let courseOptionsHtml = '';
let n = 0;
await result.forEach((course) => {
 courseOptionsHtml += `<option value='{"id": "${course.id}","number": ${n}}' onclick="functionTeeBox()">${course.name}</option>`;
 n += 1;
});

document.getElementById('course-select').innerHTML = courseOptionsHtml;

}
askCourses()

// get the data for selected course ----------------------------------------------------------------------------------------------------------------
async function getCourseData() {
    select = document.getElementById('course-select');
    
        select = JSON.parse(select.value);
        
    
    
    let response = await fetch('https://golf-courses-api.herokuapp.com/courses/' + select.id);
    let courseData = await response.json();
    return courseData.data;
}

// display teeboxes ----------------------------------------------------------------------------------------------------------------
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

// erase all player information  ------------------------------------------------------------------------------------------------------------

async function erasePlayerInformation() {
    let result = await getCourseData();
    for (let j = 0; j < player.length; j++) {
        for (let i = 0; i < result.holes.length; i++) {
        player[j].scores[i] = null;
        }
        player[j].completed = false;
    }}


// rendering the score card ------------------------------------------------------------------------------------------------------------
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
    innerTableContent += '<th scope="col" class="text-green">Out</th>'

    // in --------
    for (let i = length / 2; i < length; i++) {
        innerTableContent += `<th scope="col">${result.holes[i].hole}</th>`
    }
    innerTableContent += '<th scope="col" class="text-green">In</th>'
    innerTableContent += '<th scope="col" class="text-orange">Total</th>'


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
    innerTableContentBody += `<th scope="col" class="text-green">${yardOut}</th>`
    
    //in -------
    yardOut = 0;
    for (let i = length / 2; i < length; i++) {
        yardage = result.holes[i].teeBoxes[teeBoxChoice].yards;
        yardOut += yardage;
        total += yardage;
    innerTableContentBody += `<th scope="col">${yardage}</th>`}
    innerTableContentBody += `<th scope="col" class="text-green">${yardOut}</th>`;
    innerTableContentBody += `<th scope="col" class="text-orange">${total}</th></tr>`;





        // Par -----------------------------------------------------------------------------------------------------------------------------------
        total = 0;
        // out -----
        innerTableContentBody += '<tr><th scope="col">Par</th>';
        for (let i = 0; i < length / 2; i++) {
            pars = result.holes[i].teeBoxes[teeBoxChoice].par;
            parOut += pars;
            total += pars;
        innerTableContentBody += `<th scope="col">${pars}</th>`}
        innerTableContentBody += `<th scope="col" class="text-green">${parOut}</th>`
        
        // in -----
        parOut = 0;
        for (let i = length / 2; i < length; i++) {
            pars = result.holes[i].teeBoxes[teeBoxChoice].par;
            parOut += pars;
            total += pars;
        innerTableContentBody += `<th scope="col">${pars}</th>`}
        innerTableContentBody += `<th scope="col" class="text-green">${parOut}</th>`
        innerTableContentBody += `<th scope="col" class="text-orange">${total}</th></tr>`;


        // handicap ------------------------------------------------------------------------------------------------------------------------------
        total = 0;
        // out -----
        innerTableContentBody += '<tr><th scope="col">handicap</th>';
        for (let i = 0; i < length / 2; i++) {
            hcp = result.holes[i].teeBoxes[teeBoxChoice].hcp;
            hcpOut += hcp;
            total += hcp;
        innerTableContentBody += `<th scope="col">${hcp}</th>`}
        innerTableContentBody += `<th scope="col" class="text-green">${hcpOut}</th>`;

        // in -----
        hcpOut = 0;
        for (let i = length / 2; i < length; i++) {
            hcp = result.holes[i].teeBoxes[teeBoxChoice].hcp;
            hcpOut += hcp;
            total += hcp;
        innerTableContentBody += `<th scope="col">${hcp}</th>`}
        innerTableContentBody += `<th scope="col" class="text-green">${hcpOut}</th>`;
        innerTableContentBody += `<th scope="col" class="text-orange">${total}</th></tr>`;

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
            innerTableContentBody += `<th scope="col" class="text-green">${bigPlayerScore}</th>`;

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
            innerTableContentBody += `<th scope="col" class="text-green">${bigPlayerScore}</th>`;
            innerTableContentBody += `<th scope="col" class="text-orange">${total}</th></tr>`;

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

        // display all data
    document.getElementById('tableBody').innerHTML =  innerTableContentBody;
    document.getElementById('addPlayer').style.visibility = 'visible';
    document.getElementById('header').innerHTML = `<h2>${result.name}</h2><div class='coolBorder my-1'></div>`;

}

// adds the picture in the background ----------------------------------------------------------------------------------------------------------------
async function renderBackPicture() {
    document.getElementsByTagName('body')[0].style.backgroundImage = null;
    let result = await getAvailableCourses();
    document.getElementsByTagName('body')[0].style.backgroundImage = await `url('${result[select.number].image}')`;
}

// adds a person to the game board ----------------------------------------------------------------------------------------------------------------

function updateTable(name) {
    if (name) {
    let myMan = new players(name);
    myMan.makeEmptyScores();
    player.push(myMan);
    renderScoreCard();
    }
}


// add scores ----------------------------------------------------------------------------------------------------------------

// get score location
function addScoreData(scoreId, playerId, playerNumber) {
    currentPlayerNumber = playerNumber;
    currentPlayerId = playerId;
    currentScoreId = scoreId;
}

// add score
async function addScore() {
    let result = await getCourseData();

    // - result.holes[currentScoreId].teeBoxes[teeBoxChoice].hcp
    player[currentPlayerNumber].scores[currentScoreId] = parseInt(document.getElementById('score').value);
    renderScoreCard();
}


// turns teebox select invisible ----------------------------------------------------------------------------------------------------------------
function invis() {
    document.getElementsByClassName('invisibleSelect')[0].classList.add('invisible');
    document.getElementsByClassName('invisibleSelect')[1].classList.add('invisible');
}

// turns the annoying arrow at the beginning invisible -------------------------------------------------------------------------------------------
function deleteArrow() {
        document.getElementById('arrow').classList.add('invisible2')
        document.getElementById('arrow').classList.remove('animate__infinite')
        removeAnimation(document.getElementById('arrow'));
}

// removes animation ----------------------------------------------------------------------------------------------------------------
function removeAnimation(element) {
    element.classList.remove('animate__infinite');
}