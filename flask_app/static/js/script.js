const greetingMessage = document.createElement('p')
const responseDiv = document.getElementById('response')

const text = "I answer general questions about bouldering! How can I help you today?"

const question = document.querySelector('.ai_ask')
const questionask = document.getElementById('question')

const form = document.getElementById('form')

const boxButton = document.getElementById('show-button-box')
const box = document.getElementById('button-box')


const sendButton = document.getElementById('submit-button')

boxButton.addEventListener("click", () => {
    boxButton.classList.add("hidden")
    box.style.display = "block"
    typingEffect(text, greetingMessage)
    responseDiv.appendChild(greetingMessage)
    sendButton.disabled = true
})

questionask.addEventListener('keydown', (e) => {
    console.log('keydown event:', e.key)
    if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        console.log('dispatching event')
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
        console.log('hello')
        console.log(question.value)
    }
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const questionValue = `${question.value}`
    question.value = '';
    sendButton.disabled = true

    const originalHeight = '16'
    const originalWidth = '205'

    question.style.height = `${originalHeight}px`; // Reset height to original
    question.style.width = `${originalWidth}px`; 

    const loadingMessage = document.createElement('p')
    loadingMessage.textContent = "..."
    
    const questionMessage = document.createElement('p') // creates a p tag element in the current document and assigns it to the variable loadingMessage
    questionMessage.textContent = `${questionValue}` // updates the textual content of the p element to display the questions value. 
    // textContent just adds plain text escaping html tags. 
    responseDiv.appendChild(questionMessage)
    responseDiv.appendChild(loadingMessage)

    responseDiv.scrollTop = responseDiv.scrollHeight; // when adding the question text and loading response text scroll down also. 

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
            console.log(responseDiv.scrollHeight)
            const responseMessage = document.createElement('p')
            const responseText = `${data.message}`
            typingEffect(responseText, responseMessage)
            console.log(responseDiv)
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
            responseDiv.scrollTop = responseDiv.scrollHeight; // when populating the response div with the response scroll down as it populates. It does this by setting the vertical scroll position(scroll top) to the total height of the scrollable content inside response div. 
        }
    }
    typeChar(); // this starts the typing progress function for the first time.
}

// Textarea grow for boulderbot section

question.addEventListener('input', () => {
    console.log('user is typing')
    question.style.height = '16px'; // Reset height to calculate new height
    question.style.height = `${question.scrollHeight}px`; // Set to scroll height

    // Enable send button if there's text, otherwise disable
    sendButton.disabled = question.value.trim() === "";
});