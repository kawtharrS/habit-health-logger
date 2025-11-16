
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

const messageInput = document.querySelector('.message-input');
const sendButton = document.querySelector('.send-button');
const safeZone = document.querySelector('.safe');

function createMessage(text, type='user')
{
  const container = document.createElement('div');
  container.classList.add('container');
  container.classList.add(type === 'user' ? 'darker' : 'lighter');

  const img = document.createElement('img');
  img.src= '../brainstorming images/avatar.png';
  img.style.width ='100%';
  if(type === 'user')
    img.classList.add('left');
  else
    img.classList.add('right');

  const p = document.createElement('p');
  p.textContent = text;

  container.appendChild(img);
  container.appendChild(p);
  safeZone.appendChild(container);

  safeZone.scrollTop = safeZone.scrollHeight;
}


function aiReply(){
  const reply = "Hi Kawthar!";
  createMessage(reply, 'ai')
}


sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

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




