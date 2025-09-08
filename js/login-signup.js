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
const auth = firebase.auth();
const db = firebase.firestore();

const loginText = document.querySelector(".TextTtl .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");

signupBtn.onclick = (() => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
});

loginBtn.onclick = (() => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
});

document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPass").value;
    const location = document.getElementById("signupLoc").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            return db.collection("users").doc(user.uid).set({
                fullName: name,
                email: email,
                location: location,
                role: "farmer"
            });
        })
        .then(() => {
            document.getElementById("signupForm").reset();
            setTimeout(() => {
                loginBtn.click();
            }, 2000);
                })
        });
        
document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        return db.collection("users").doc(user.uid).get();
    })
    .then((doc) => {
        if (doc.exists) {
            const userData = doc.data();
            setTimeout(() => {
                if (userData.role === "farmer") {
                    window.location.href = "./farmer/farmer-dashboard.html";
                } else if (userData.role === "professional") {
                    window.location.href = "./professional/professional-dashboard.html";
                }
            }, 500);
        }
    });
});

auth.onAuthStateChanged((user) => {
    if (user) {
        db.collection("users").doc(user.uid).get()
        .then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                if (userData.role === "farmer") {
                    window.location.href = "farmer-dashboard.html";
                } else if (userData.role === "professional") {
                    window.location.href = "professional-dashboard.html";
                }
            }
        });
    }

});