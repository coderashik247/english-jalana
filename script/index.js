const createElements = (arr) => {
    const htmlElement = arr.map((el) => `<span class="btn bg-blue-100">${el}</span>`);
    return htmlElement.join(" ");
}

const manageSpinner = (status) => {
    if (status === true) {
        document.getElementById('spinner').classList.remove("hidden");
        document.getElementById('word-container').classList.add('hidden');
    }
    else {
        document.getElementById('word-container').classList.remove('hidden');
        document.getElementById('spinner').classList.add("hidden");
    }
}

const loadLesson = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then(res => res.json())
        .then(json => displayLesson(json.data))
}

const removeActive = () => {
    const lessonBtns = document.querySelectorAll('.lesson-btn');
    lessonBtns.forEach(btn => {
        btn.classList.remove("active");
    })
}

const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(json => {
            removeActive(); // remove all active btn
            // ৩ সেকেন্ড পরে ডাটা দেখাবে
            setTimeout(() => {
                displayWord(json.data);
                const clickBtn = document.getElementById(`lesson-btn-${id}`)
                clickBtn.classList.add("active"); // only add active btn
            }, 3000);
        });
}

const displayWord = (words) => {
    // 1. get the Word Container & empty
    const wordContainer = document.getElementById('word-container');
    wordContainer.innerHTML = "";

    // এখানে কন্ডিশন চেক করা হচ্ছে যেসব Lesson কোনো ভ্যালু নাই
    if (words.length == 0) {
        wordContainer.innerHTML = `
            <div class="text-center col-span-3 space-y-3">
                <img class="mx-auto" src="./assets/alert-error.png" alt="">
                <p class="font-bangla font-medium text-[#79716b]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bangla text-3xl font-semibold">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        manageSpinner(false)
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
                <h2 class="text-3xl font-bold">${word.word ? word.word : "এখানে অর্থ পাওয়া যায় নি"}</h2>
                <p class="text-[20px]">Meaning /Pronounciation</p>
                <div class="text-2xl font-semibold">"${word.meaning ? word.meaning : "এখানো মিনিং পাওয়া যায় নি"}/"${word.pronunciation ? word.pronunciation : "এইটার উচ্চারণ যুক্ত করা হয় নাই"}</div>
                <div class="flex justify-between items-center">
                    <button class="btn hover:bg-gray-100 hover:text-[#1a90fff0] bg-[#1a91ff1a] p-3 text-xl rounded-lg"><i class="fa-solid fa-circle-info" onclick="loadWordDetails(${word.id})"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn hover:bg-gray-100 hover:text-[#1a90fff0] bg-[#1a91ff1a] p-3 text-xl rounded-lg"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        `

        // 4. add into word container
        wordContainer.appendChild(divWord);
    });
    manageSpinner(false);
}

// load Word Details
const loadWordDetails = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await (res.json());
    displayWordDetails(details.data);
}

const displayWordDetails = (word) => {
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `
    <div>
        <h2 class="text-3xl font-bold">${word.word} (<i class="fa-solid fa-microphone-lines"></i>:<span class="font-bangla">${word.pronunciation}</span>)</h2>
    </div>
    <div class="text-xl">
        <p class="font-semibold">Meaning</p>
        <p class="font-bangla">${word.meaning}</p>
    </div>
    <div class="text-xl">
        <p class="font-semibold">Example</p>
        <p class="text-gray-400">The kids were eager to open their gifts.</p>
    </div>
    <div class="text-xl">
        <p class="font-bangla font-semibold">সমার্থক শব্দ গুলো</p>
        <div>${word.synonyms ? createElements(word.synonyms) : "No synonyms found"}</div>
    </div>
    `
    document.getElementById('word_modal').showModal();
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

document.getElementById('btn-search').addEventListener('click', ()=>{
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue);

    fetch('https://openapi.programming-hero.com/api/words/all')
    .then(res => res.json())
    .then(data => {
        const allWords = data.data;
        const filterWords = allWords.filter((word) => word.word.toLowerCase().includes(searchValue));

        displayWord(filterWords)
    });
})


const pronounceWord = (word) =>{
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN";
    window.speechSynthesis.speak(utterance);
}

loadLesson();
