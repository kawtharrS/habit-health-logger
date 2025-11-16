import  {} from './tracking.js'; 

const URL_API = "http://localhost:8080/habit_and_health_logger/server/public/review.php";


async function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;

    createMessage(message, 'user');
    messageInput.value = '';

    const response = await axios.post(
        URL_API,
        { message: message },
        { headers: { 'Content-Type': 'application/json' } }
    );

    createMessage(response.data.reply, 'ai');
}
