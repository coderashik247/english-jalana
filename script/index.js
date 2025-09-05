const loadLesson = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLesson(json.data))
}

const displayLesson = (lessons) => {
    // 1. get the Lesson Container & empty
    const lessonsContainer = document.getElementById('lessons-container');
    lessonsContainer.innerHTML = "";

    // 2. get into every lessons
    for (const lesson of lessons) {

        // 3. create lesson button
        const buttonDiv = document.createElement('div');
        buttonDiv.innerHTML = `
            <button href="" class="btn btn-outline btn-primary"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `
        // 4. append into Lesson Container
        lessonsContainer.appendChild(buttonDiv);
    }
}

loadLesson();