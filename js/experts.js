// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyD_NltDzkNGMH8cIrB3vChPXKR5Np8UUKI",
  authDomain: "agricare-babrathon.firebaseapp.com",
  projectId: "agricare-babrathon",
  storageBucket: "agricare-babrathon.firebasestorage.app",
  messagingSenderId: "795598532498",
  appId: "1:795598532498:web:c42a9d93089eb53a129b4b",
  measurementId: "G-BCB4YBRLT0"
};
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

// DOM Elements
const professionalsGrid = document.getElementById('professionalsGrid');
const searchInput = document.getElementById('searchInput');
const chatModal = document.getElementById('chatModal');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatProfessionalName = document.getElementById('chatProfessionalName');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

let professionals = [];
let currentProfessional = null;
let geminiConversation = [];

// Load Professionals
async function loadProfessionals() {
    professionalsGrid.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-spin"></i><p>Loading professionals...</p></div>`;
    const snapshot = await db.collection('users').where('role', '==', 'professional').get();
    professionals = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderProfessionals(professionals);
}

// Render Professionals
function renderProfessionals(pros) {
    professionalsGrid.innerHTML = '';
    pros.forEach(pro => {
        const card = document.createElement('div');
        card.className = 'professional-card';
        card.innerHTML = `
            <div class="professional-header">
                <h3>${pro.fullName}</h3>
                <p>${pro.specialization || 'Agricultural Expert'}</p>
            </div>
            <div class="professional-body">
                <button class="chat-btn" data-id="${pro.id}" data-name="${pro.fullName}">Chat</button>
            </div>
        `;
        professionalsGrid.appendChild(card);
    });

    // Chat button click
    document.querySelectorAll('.chat-btn').forEach(btn => {
        btn.addEventListener('click', () => openChat(btn.dataset));
    });
}

// Open Chat
function openChat(proData) {
    currentProfessional = proData;
    chatProfessionalName.textContent = proData.name;
    chatMessages.innerHTML = '';
    geminiConversation = [];
    chatModal.style.display = 'flex';
}

// Close Chat
chatClose.addEventListener('click', () => chatModal.style.display = 'none');

// Append message
function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'user' : 'bot');
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send message with Gemini API
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    appendMessage('user', text);
    geminiConversation.push({ role: 'user', parts: [{ text }] });

    try {
        const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
        const apiKey = 'AIzaSyDSxcENW9AF9Eo6W8dKCgI3x4QhmrgM0ik';
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const result = await model.generateContent({ contents: geminiConversation });
        const reply = result.response.text();
        appendMessage('bot', reply);
        geminiConversation.push({ role: 'model', parts: [{ text: reply }] });
    } catch (err) {
        appendMessage('bot', 'Sorry, something went wrong.');
        console.error(err);
    }
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

// Search Filter
searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filtered = professionals.filter(p =>
        p.fullName.toLowerCase().includes(searchTerm) ||
        (p.specialization && p.specialization.toLowerCase().includes(searchTerm))
    );
    renderProfessionals(filtered);
});

// Initialize App
auth.onAuthStateChanged(user => {
    if (user) loadProfessionals();
    else window.location.href = 'login.html';
});
