let formSubmit = document.getElementById('loginForm')

formSubmit.addEventListener('submit', (event) => {
    let userName = document.getElementById('loginUser').value
    let password = document.getElementById('loginPassword').value

    event.preventDefault()

    fetch ('http://localhost:5678/api/users/login', {
        method: "POST", 
        headers: {
            "accept": "application/json"
        }, 
        body: {
            "email": userName,
            "password": password,
        }
    })
    .then (response => response.json())
    .then (data => {
        alert(data)
        console.log(data)
    })
})