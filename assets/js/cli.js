document.addEventListener('DOMContentLoaded', () => {
    const commandDisplayEl = document.getElementById('command-display');
    const commandInput = document.getElementById('command-input');
    const commandExplanationEl = document.getElementById('command-explanation');

    let allCommands = [];
    let currentCommand = {};

    fetch('/data/commands.json')
        .then(response => response.json())
        .then(data => {
            allCommands = [...data.windows, ...data.linux, ...data.git];
            loadCommand();
        });

    function loadCommand() {
        const commandIndex = Math.floor(Math.random() * allCommands.length);
        currentCommand = allCommands[commandIndex];
        
        commandDisplayEl.textContent = currentCommand.command;
        commandExplanationEl.innerHTML = '';
        commandInput.value = '';
        commandInput.focus();
    }

    commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const typedCommand = commandInput.value.trim();
            if (typedCommand === currentCommand.command) {
                commandExplanationEl.innerHTML = `
                    <p style="color: #00ff00;"><strong>Correct!</strong></p>
                    <p><strong>[System: ${currentCommand.os}]</strong></p>
                    <p>${currentCommand.explanation}</p>
                `;
                setTimeout(loadCommand, 8000);
            } else {
                commandExplanationEl.innerHTML = `<p style="color: #ff0000;">Incorrect. Please try again.</p>`;
            }
        }
    });
});