let formSubmit = document.getElementById('loginForm')

formSubmit.addEventListener('submit', (event) => {
    event.preventDefault()
    let userName = document.getElementById('loginUser').value
    let password = document.getElementById('loginPassword').value

    let data = {
        "email": userName,
        "password": password,
    }
    
    fetch ('http://localhost:5678/api/users/login', {
        method: "POST", 
        headers: {
            "accept": "application/json",
            "content-Type": "application/json"            
        }, 

        body: JSON.stringify(data)
    })
    .then (response => {
        if (response.ok) {
            return response.json()
        }else {
            let errorMessage = document.getElementById("login-error-message")
            errorMessage.style.display = "block"
            return
        }
    })
    .then (data => {
        window.localStorage.setItem("token", data.token)
        window.localStorage.setItem("userId", data.userId)

        window.location.href ="../index.html"
    })
    

})