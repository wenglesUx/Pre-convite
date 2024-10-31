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

// Adicionar nome à lista temporária e exibir na tela
actBtn.addEventListener('click', (event) => {
  event.preventDefault();
  const newGuest = guestId.value;

  if (newGuest) {
    listGuest.push(newGuest);
    guestId.value = ''; // Limpa o campo de entrada
    showNewGuest(newGuest);
  }
  console.log("Nomes adicionados à lista:", listGuest);
});

// Função para exibir o nome na lista da tela
function showNewGuest(guestName) {
  const container = document.querySelector(".guestItemsConfirm");
  let guestElement = document.createElement("p");
  guestElement.textContent = guestName;
  container.appendChild(guestElement);
  console.log("e isso que estou procurando:",guestElement)

  guestElement.addEventListener('click',()=>{
     const index = listGuest.indexOf(guestName)
     if(index > -1){
      listGuest.splice(index,1)
     }
     guestElement.remove()
     console.log("lista apos a remoção", listGuest)
  })

  const remove = listGuest.indexOf(guestElement)
   remove.addEventListener('click',()=>{
    if(remove > -1){
      listGuest.splice(remove,1)
    }
  
   })


}



// Enviar todos os nomes da array para o Firestore
document.getElementById("submitAll").addEventListener("click", async function() {
  if (listGuest.length > 0) {
    try {
      // Adiciona a array de nomes à coleção 'attendees' do Firestore
      await db.collection("attendees").add({ names: listGuest });
      listGuest = []; // Limpa a array após o envio
      document.querySelector(".guestItemsConfirm").innerHTML = ""; // Limpa a lista da interface
      alert("Nomes enviados com sucesso!");
    } catch (error) {
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
      const namesArray = doc.data().names || [];
      namesArray.forEach(name => addNameToList(name));
    });
  } catch (error) {
    console.error("Erro ao buscar nomes:", error);
  }
}

// Função para adicionar nomes na lista do HTML
function addNameToList(name) {
  const attendanceList = document.getElementById("attendanceList");
  const listItem = document.createElement("li");
  listItem.textContent = name;
  attendanceList.appendChild(listItem);
}

// Carrega os nomes confirmados ao carregar a página
window.addEventListener("DOMContentLoaded", fetchConfirmedGuests);
