// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyARdrkB3iczfXzo0L0EFQWyoS1esBimxe4",
  authDomain: "lista-de-convidados-f30d4.firebaseapp.com",
  projectId: "lista-de-convidados-f30d4",
  storageBucket: "lista-de-convidados-f30d4.appspot.com",
  messagingSenderId: "383144049777",
  appId: "1:383144049777:web:41f8eb2a8921b17e216fd0"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore(); // Inicializa o Firestore

let guestId = document.querySelector('#name-guest');
let actBtn = document.querySelector('#add-form-value');
let listGuest = [];
let currentGroupColor = null; // Cor do grupo atual de nomes

// Função para gerar uma cor hexadecimal aleatória
function generateRandomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}
function showElement() {
  document.querySelector('.guest-section').style.opacity = "1";
  
}

// Adicionar nome à lista temporária e exibir na tela
actBtn.addEventListener('click', (event) => {
  showElement()
  event.preventDefault();
  const newGuest = guestId.value;

  if (newGuest) {
    // Gera uma nova cor para o grupo se for o primeiro nome
    if (listGuest.length === 0) {
      currentGroupColor = generateRandomColor();
    }

    listGuest.push(newGuest);
    guestId.value = ''; // Limpa o campo de entrada
    showNewGuest(newGuest, currentGroupColor); // Passa a cor do grupo
  }
  console.log("Nomes adicionados à lista:", listGuest);
});

// Função para exibir o nome na lista da tela
function showNewGuest(guestName, color) {
  const container = document.querySelector(".guestItemsConfirm");
  let guestElement = document.createElement("p");
  guestElement.textContent = guestName;
  guestElement.style.color = color; // Aplica a cor do grupo
  container.appendChild(guestElement);


  

  // Adiciona um evento de clique ao elemento para removê-lo
  guestElement.addEventListener('click', () => {
   
    const index = listGuest.indexOf(guestName);
    if (index > -1) {
      listGuest.splice(index, 1); // Remove o nome da array
    }
    guestElement.remove(); // Remove o elemento DOM da tela
    console.log("Lista após remoção:", listGuest);
  });
}

function disableButtonSubmit(){
  document.getElementById("submitAll").disabled = true;
  document.getElementById("submitAll").style.background = "whitesmoke";
  document.getElementById("submitAll").style.color = "#737373"
  console.log("o botão foi desativado")

}
document.getElementById("submitAll").addEventListener('dblclick',()=>{
  submitGuestError.show()
})

// Enviar todos os nomes da array para o Firestore
document.getElementById("submitAll").addEventListener("click", async function() {
  disableButtonSubmit()
  if (listGuest.length > 0) {
    try {
      // Adiciona a array de nomes e a cor do grupo à coleção 'attendees' do Firestore
      await db.collection("attendees").add({ 
        names: listGuest, 
        color: currentGroupColor // Salva a cor do grupo
      });

      listGuest = []; // Limpa a array após o envio
      currentGroupColor = null; // Reset da cor do grupo
      document.querySelector(".guestItemsConfirm").innerHTML = ""; // Limpa a lista da interface
      // alert("Nomes enviados com sucesso!");
      modalGuestConfirm.show()

    } catch (error) {
      modalGuestError.show()
      console.error("Erro ao enviar os nomes:", error);
    }
  } else {
    alert("Nenhum nome para enviar.");
  }
});


// Recuperar e exibir nomes salvos no Firestore
async function fetchConfirmedGuests() {
  try {
    const snapshot = await db.collection("attendees").get();
    snapshot.forEach(doc => {
      const { names, color } = doc.data();
      names.forEach(name => addNameToList(name, color));
    });
  } catch (error) {
    console.error("Erro ao buscar nomes:", error);
  }
}

// Função para adicionar nomes na lista do HTML com cor específica
function addNameToList(name, color) {
  const attendanceList = document.getElementById("attendanceList");
  const listItem = document.createElement("li");
  listItem.textContent = name;
  listItem.style.color = color; // Aplica a cor do grupo ao item da lista
  attendanceList.appendChild(listItem);
}


// Carrega os nomes confirmados ao carregar a página
window.addEventListener("DOMContentLoaded", fetchConfirmedGuests);

// ação dos modais

// Seleciona o botão de confirmação
const confirmButton = document.querySelector('.confirm-list');

// Instancia os modais
const modalMsgUser = new bootstrap.Modal(document.getElementById('alertmodal'));
const modalConfirmUser = new bootstrap.Modal(document.getElementById('confirmModal'));
const modalFormUser = new bootstrap.Modal(document.getElementById('formmodal'));
const modalGuestConfirm = new bootstrap.Modal(document.getElementById('guestresponseModal'));
const modalGuestError = new bootstrap.Modal(document.getElementById('guestErrorModal'));
const submitGuestError = new bootstrap.Modal(document.getElementById('submitErrorModal'));

// Exibe o primeiro modal ao clicar no botão
confirmButton.addEventListener('click', () => {
  modalMsgUser.show();
});

// Adiciona o evento de fechamento no elemento DOM do primeiro modal
document.getElementById('alertmodal').addEventListener('hidden.bs.modal', () => {
  modalConfirmUser.show();
});

// Adiciona o evento de fechamento no elemento DOM do segundo modal
document.getElementById('confirmModal').addEventListener('hidden.bs.modal', () => {
  modalFormUser.show();
});

document.getElementById('guestresponseModal').addEventListener('hidden.bs.modal', () => {
  modalFormUser.hide();
});

