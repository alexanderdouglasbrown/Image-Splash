document.getElementById("submitButton").addEventListener("click", disableButton)

function disableButton() {
    if (document.getElementById("imageUpload").value) {
        document.getElementById("submitButton").classList.add("hide")
        document.getElementById("processingButton").classList.remove("hide")
    }
}