// function getAvailableCourses() {
//     return fetch('https://golf-courses-api.herokuapp.com/courses/').then(
//       function (response) {
//         return response.json();
//       }
//     );
//    }
let data = {};
   async function getAvailableCourses() {
    let response = await fetch('https://golf-courses-api.herokuapp.com/courses/');
    data = await response.json();
    console.log(data.courses);
    return data.courses;
}


async function askCourses() {
let result = await getAvailableCourses();
let courseOptionsHtml = '';
await result.forEach((course) => {
 courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
});

document.getElementById('course-select').innerHTML = courseOptionsHtml;

}
askCourses()

var select = document.getElementById('course-select');

async function getCourseData() {
    let response = await fetch('https://golf-courses-api.herokuapp.com/courses/' + select.value);
    let courseData = await response.json();
    console.log(courseData.data)
    return courseData.data;
}

async function functionTeeBox() {
    let result = await getCourseData();
    let teeBoxes = result.holes[0].teeBoxes;
    let teeBoxSelectHtml = ''
await teeBoxes.forEach(function (teeBox, index) {
   teeBoxSelectHtml += `<option value="${index}">${teeBox.teeType.toUpperCase()}, ${teeBox.yards} yards</option>`
});

document.getElementById('tee-box-select').innerHTML = teeBoxSelectHtml;
}



// rendering the score card ------------------------------------------------------------------------------------------------------------

async function renderScoreCard() {
    let result = await getCourseData();
    //rendering the header ---------------------------------------------------------------------------------------------------------------
    let innerTableContent = '<th scope="col">Holes</th>';
    document.getElementById('scorecard').innerHTML = '<thead id="tableHeader"></thead><tbody id="tableBody"></tbody>';
    for (let i = 0; i < result.holes.length; i++) {
        innerTableContent += `<th scope="col">${result.holes[i].hole}</th>`
    }
    innerTableContent += '<th scope="col">Out</th>'
    
    document.getElementById('tableHeader').innerHTML = `<tr>${innerTableContent}</tr>`;



    //rendering the body ---------------------------------------------------------------------------------------------------------------

    // yardage ----------------------------------------------------------------------------------------------------------------------------------

    innerTableContentBody = '<tr><th scope="col">Yardage</th>';
    let yardOut = 0;
    let parOut = 0;
    let hcpOut = 0;
    let teeBoxChoice = 0;
    for (let i = 0; i < result.holes.length; i++) {
        yardage = result.holes[i].teeBoxes[teeBoxChoice].yards;
        yardOut += yardage;
    innerTableContentBody += `<th scope="col">${yardage}</th>`}
    innerTableContentBody += `<th scope="col">${yardOut}</th><tr>`
    

        // Par -----------------------------------------------------------------------------------------------------------------------------------
        innerTableContentBody += '<tr><th scope="col">Par</th>';
        for (let i = 0; i < result.holes.length; i++) {
            pars = result.holes[i].teeBoxes[teeBoxChoice].par;
            parOut += pars;
        innerTableContentBody += `<th scope="col">${pars}</th>`}
        innerTableContentBody += `<th scope="col">${parOut}</th><tr>`
        // handicap ------------------------------------------------------------------------------------------------------------------------------
        innerTableContentBody += '<tr><th scope="col">handicap</th>';
        for (let i = 0; i < result.holes.length; i++) {
            hcp = result.holes[i].teeBoxes[teeBoxChoice].hcp;
            hcpOut += hcp;
        innerTableContentBody += `<th scope="col">${hcp}</th>`}
        innerTableContentBody += `<th scope="col">${hcpOut}</th><tr>`


    document.getElementById('tableBody').innerHTML =  innerTableContentBody;
}