const greetingMessage = document.createElement('p')
const responseDiv = document.getElementById('response')

const text = "I answer general questions about bouldering! How can I help you today?"

const form = document.getElementById('form')
form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const question = document.getElementById('question')

    const questionValue = `${question.value}`
    question.value = '';

    const loadingMessage = document.createElement('p')
    loadingMessage.textContent = "..."
    
    const questionMessage = document.createElement('p') // creates a p tag element in the current document and assigns it to the variable loadingMessage
    questionMessage.textContent = `${questionValue}` // updates the textual content of the p element to display the questions value. 
    // textContent just adds plain text escaping html tags. 
    responseDiv.appendChild(questionMessage)
    responseDiv.appendChild(loadingMessage)
    
    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indicates JSON format
            },
            body: JSON.stringify({ text: questionValue }) // Send text as JSON
        });

        const data = await response.json()
        responseDiv.removeChild(loadingMessage)

        if (response.ok) {
            const responseMessage = document.createElement('p')
            const responseText = `${data.message}`
            typingEffect(responseText, responseMessage)
            responseDiv.appendChild(responseMessage)
        } else {
            const responseError = document.createElement('p')
            const responseErrorText = `${data.error}`
            typingEffect(responseErrorText, responseError)
            responseDiv.appendChild(responseError)
        }
    } catch (error) {
        responseDiv.textContent = `Error: ${error.message}`
    }
})

function typingEffect(text, message) {
    console.log(text)
    let index = 0; // Local index, independent for each message

    function typeChar() { //character typing function
        if (index < text.length) { // if index is less than the length of text execute
            message.textContent += text.charAt(index); // text.charAt fetches the character at the current index from text and appends that character to the existing content of message 
            index++; // increment index 
            setTimeout(typeChar, 0.5); // setTimeout schedules the typeChar function to run again after a delay of 0.5 milliseconds.
        }
    }
    typeChar(); // this starts the typing progress function for the first time.
}

const boxButton = document.getElementById('show-button-box')
const box = document.getElementById('button-box')
boxButton.addEventListener("click", () => {
    boxButton.classList.add("hidden")
    box.style.display = "block"
    typingEffect(text, greetingMessage)
    responseDiv.appendChild(greetingMessage)
})


// Textarea box grow shenanigans

const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
messageInput.value = '';
// Automatically adjust textarea height
messageInput.addEventListener('input', () => {
    console.log('user is typing')
    messageInput.style.height = '16px'; // Reset height to calculate new height
    messageInput.style.height = `${messageInput.scrollHeight}px`; // Set to scroll height

    // Enable send button if there's text, otherwise disable
    sendButton.disabled = messageInput.value.trim() === "";
});