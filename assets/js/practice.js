document.addEventListener('DOMContentLoaded', () => {
    const levelEl = document.getElementById('level');
    const wpmEl = document.getElementById('wpm');
    const accuracyEl = document.getElementById('accuracy');
    const errorsEl = document.getElementById('errors');
    const lessonTextEl = document.getElementById('lesson-text');
    const typingInput = document.getElementById('typing-input');

    let lessons = [];
    let currentLessonText = '';
    let startTime;
    let errors = 0;
    
    let currentLevel = parseInt(localStorage.getItem('currentLevel')) || 1;
    const MAX_LEVEL = 30;

    fetch('/data/lessons.json')
        .then(response => response.json())
        .then(data => {
            lessons = data.lessons;
            loadLesson();
        });

    function loadLesson() {
        if (currentLevel > MAX_LEVEL) {
            lessonTextEl.textContent = "Congratulations! You have completed all levels.";
            typingInput.disabled = true;
            return;
        }

        const lessonData = lessons.find(l => l.level === currentLevel);
        if (lessonData) {
            currentLessonText = lessonData.text;
            levelEl.textContent = currentLevel;
            lessonTextEl.innerHTML = currentLessonText.split('').map(char => `<span>${char}</span>`).join('');
            reset();
        } else {
            lessonTextEl.textContent = `Error: Level ${currentLevel} not found.`;
        }
    }

    typingInput.addEventListener('input', () => {
        if (!startTime) {
            startTime = new Date();
        }

        const typedText = typingInput.value;
        const lessonChars = lessonTextEl.querySelectorAll('span');
        errors = 0;

        lessonChars.forEach((charSpan, index) => {
            const charTyped = typedText[index];
            if (charTyped == null) {
                charSpan.classList.remove('correct', 'incorrect');
            } else if (charTyped === charSpan.innerText) {
                charSpan.classList.add('correct');
                charSpan.classList.remove('incorrect');
            } else {
                charSpan.classList.add('incorrect');
                charSpan.classList.remove('correct');
                errors++;
            }
        });

        errorsEl.textContent = errors;
        updateStats();

        if (typedText === currentLessonText) {
            endLesson();
        }
    });

    function updateStats() {
        if (!startTime) return;

        const elapsedTime = (new Date() - startTime) / 1000;
        const typedChars = typingInput.value.length;
        const wpm = elapsedTime > 0 ? Math.round((typedChars / 5) / (elapsedTime / 60)) : 0;
        const accuracy = typedChars > 0 ? Math.round(((typedChars - errors) / typedChars) * 100) : 100;

        wpmEl.textContent = wpm;
        accuracyEl.textContent = accuracy;
    }

    function endLesson() {
        currentLevel++;
        localStorage.setItem('currentLevel', currentLevel);
        
        setTimeout(loadLesson, 1000);
    }

    function reset() {
        typingInput.value = '';
        typingInput.focus();
        startTime = null;
        errors = 0;
        wpmEl.textContent = '0';
        accuracyEl.textContent = '100';
        errorsEl.textContent = '0';
    }
});