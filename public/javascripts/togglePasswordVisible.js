function togglePasswordVisible(){
    const passwordBox = document.getElementById("password")
    const eyeIcon = document.getElementById("password-toggle-eye")
    
    if (passwordBox.type == "password"){
        passwordBox.type = "input"
        eyeIcon.classList.remove("fa-eye-slash")
        eyeIcon.classList.add("fa-eye")
    } else {
        passwordBox.type = "password"
        eyeIcon.classList.remove("fa-eye")
        eyeIcon.classList.add("fa-eye-slash")
    }
}