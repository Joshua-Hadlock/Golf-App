async function funcName(url){
    const response = await fetch(url);
    var courses = await response.json();
    console.log(courses);
    }



async function startData() {
    data = await funcName('https://golf-courses-api.herokuapp.com/courses/');
    console.log('wish this would work')
    let courseOptionsHtml = '';
     data.courses.courses.forEach((course) => {
     courseOptionsHtml += `<option value="${course.id}">${course.name}</option>`;
    });
    
    document.getElementById('course-select').innerHTML = courseOptionsHtml;

}

startData();