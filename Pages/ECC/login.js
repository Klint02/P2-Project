function login() {
    let eccId = document.getElementById("login").value;
    let login = document.getElementById("loginSection");

    login.innerHTML = "<p>Logged in as " + eccId + "</p>";
    const localEcc = new Ecc(eccId);


}

class Ecc {
    constructor(eccId) {
        this.id = eccId;
    }
}
