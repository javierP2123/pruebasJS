const textInput = document.getElementById('textInput');
const chat = document.getElementById('chat');

let context = {};

const templateChatMessage = (message, from) => `
  <div class="from-${from}">
    <div class="message-inner">
      <p>${message}</p>
    </div>
  </div>
  `;
  const templateOptions = (message,value, from) => `
    <div class="from-${from}">
        <button onclick="getWatsonMessageAndInsertTemplate('${value}');textInput.focus()">${message}</button>
    </div>
    `;

// Crate a Element and append to chat
const InsertTemplateInTheChat = (template) => {
  const div = document.createElement('div');
  div.innerHTML = template;
  chat.appendChild(div);
};

// Calling server and get the watson output
const getWatsonMessageAndInsertTemplate = async (text = '') => {
  const uri = 'https://app-chat-watson-assistant.mybluemix.net/conversation/';
  // const uri = 'http://localhost:8080/conversation/';

  const response = await (await fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      context,
    }),
  })).json();

  context = response.context;
//si el nodo tiene mas de una respuesta
  for (var i = 0; i < response.output.text.length; i++) {
    if(response.output.text[i] != ""){
      const template = templateChatMessage(response.output.text[i], 'watson');
      InsertTemplateInTheChat(template);
    }
  }
  var altura = chat.scrollHeight;
  chat.scroll(0,altura);
  //para las opciones que brinda watson
  //falta ponerlo para la visualizacion de botones y regresar el input a watson con la opcion seleccionada
  if (response.output.generic[1] != undefined) {
    if (response.output.generic[1].options) {
      for (var i = 0; i < response.output.generic[1].options.length; i++) {
        var valor = response.output.generic[1].options[i].value.input.text;
        var mensaje= response.output.generic[1].options[i].label;
        const template = templateOptions(mensaje,valor, 'watson');
        InsertTemplateInTheChat(template);
      }
      var altura = chat.scrollHeight;
      chat.scroll(0,altura);
    }
  }

  console.log(response);
};

textInput.addEventListener('keydown', (event) => {
  if (event.keyCode === 13 && textInput.value) {
    // enviar el mensaje del usuario al teclear enter
    getWatsonMessageAndInsertTemplate(textInput.value);
    //insertar el mensaje escrito en una burbuja del chat
    const template = templateChatMessage(textInput.value, 'user');
    InsertTemplateInTheChat(template);

    // limpiar mensaje para mensaje siguiente
    textInput.value = '';
    var altura = chat.scrollHeight;
    chat.scroll(0,altura);
  }
});
getWatsonMessageAndInsertTemplate();
