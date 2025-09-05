const loadLesson = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLesson(json.data))
}

const removeActive = () =>{
    const lessonBtns = document.querySelectorAll('.lesson-btn');
    lessonBtns.forEach(btn => {
        btn.classList.remove("active");
    })
}

const loadLevelWord = (id) => {
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            removeActive(); // remove all active btn
            displayWord(json.data);
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            clickBtn.classList.add("active"); // only add active btn
        });
}

const displayWord = (words) => {
    // 1. get the Word Container & empty
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    // এখানে কন্ডিশন চেক করা হচ্ছে যেসব Lesson কোনো ভ্যালু নাই
    if(words.length == 0){
        wordContainer.innerHTML = `
            <div class="text-center col-span-3 space-y-3">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="font-bangla font-medium text-[#79716b]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bangla text-3xl font-semibold">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        return;
    }

    // 2. get into every word
    words.forEach(word => {

        // 3. create a div
        const divWord = document.createElement('div')

        // "id": 4,
        //     "level": 5,
        //         "word": "Diligent",
        //             "meaning": "পরিশ্রমী",
        //                 "pronunciation": "ডিলিজেন্ট"

        divWord.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-3">
                <h2 class="text-3xl font-bold">${word.word ? word.word: "এখানে অর্থ পাওয়া যায় নি"}</h2>
                <p class="text-[20px]">Meaning /Pronounciation</p>
                <div class="text-2xl font-semibold">"${word.meaning ? word.meaning : "এখানো মিনিং পাওয়া যায় নি"}/"${word.pronunciation ? word.pronunciation : "এইটার উচ্চারণ যুক্ত করা হয় নাই"}</div>
                <div class="flex justify-between items-center">
                    <button class="btn hover:bg-gray-100 hover:text-[#1a90fff0] bg-[#1a91ff1a] p-3 text-xl rounded-lg"><i class="fa-solid fa-circle-info" onclick="my_modal_1.showModal()"></i></button>
                    <button class="btn hover:bg-gray-100 hover:text-[#1a90fff0] bg-[#1a91ff1a] p-3 text-xl rounded-lg"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        `

        // 4. add into word container
        wordContainer.appendChild(divWord);
    });
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
            <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `
        // 4. append into Lesson Container
        lessonsContainer.appendChild(buttonDiv);
    }
}

loadLesson();
