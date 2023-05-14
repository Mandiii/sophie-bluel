fetch ('http://localhost:5678/api/works')
.then (response => response.json())
.then (data => {
    console.log(data)
    for (let work of data) {
        works(work.imageUrl, work.title)
    }
})

function works (imageSrc, titleText) {
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const text = document.createElement("figcaption")

    image.src = imageSrc
    text.innerText = titleText

    console.log(imageSrc + titleText)
    console.log(image + text)

    const figureParent = document.getElementById("portfolioGallery")

    figureParent.appendChild(figure)
    figure.appendChild(image)
    figure.appendChild(text)
}