let userToken = window.localStorage.getItem("token")
console.log(userToken)
const adminItems = document.getElementsByClassName("admin")
console.log(adminItems)

const loginBtn = document.getElementById('loginBtn')
const logoutBtn = document.getElementById('logoutBtn')

if (userToken !== null) {
    for (item of adminItems) {
        item.classList.remove('hide')
        loginBtn.style.display = 'none'
        logoutBtn.style.display='inline-block'
    }
}else {
    for (item of adminItems) {
        item.classList.add('hide')
    }
}
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem("token")
    location.reload()
})
let works = []
let categories = []
console.log(works)

fetch ('http://localhost:5678/api/works')
.then (response => response.json())
.then (data => {
    for (let work of data) {
        generateWorks(work.imageUrl, work.title, work.categoryId)
    }
    works = data    
    console.log(works)    
})
console.log(works)

// dynamically create works from api
let figureParent = document.getElementById("portfolioGallery")

function generateWorks (imageSrc, titleText, categoryId) {
    const figure = document.createElement("figure")
    const image = document.createElement("img")
    const text = document.createElement("figcaption")

    image.src = imageSrc
    text.innerText = titleText

    figureParent.appendChild(figure)
    figure.appendChild(image)
    figure.appendChild(text)

    figure.classList.add("imgCategory-" + categoryId)
}

// get different categories from api
fetch ('http://localhost:5678/api/categories')
.then (response => response.json())
.then (data => {
    generateCategoriesContainer()
    for (let category of data) {
         generateCategoryButtons(category.id, category.name)
         console.log(category.name)
    }
    categories = data
})

// generate filter by category container
function generateCategoriesContainer () {
    let container = document.createElement('div')
    let gallery = document.getElementById('portfolio')
    gallery.insertBefore(container, gallery.children[1]);
    container.id = "categoriesContainer"

// generate and add an all button to filters
    let allBtn = document.createElement('button')
    allBtn.innerText = "Tous"
    container.appendChild(allBtn)
    allBtn.classList.add("selected-category", "category-button") 
    allBtn.id = "0"
    allBtn.addEventListener("click", () => {
        selectCategory(0)
    })
}

// generate filter by category buttons for each category in api
function generateCategoryButtons(id, categoryName) {
    let categoryBtn = document.createElement('button')
    let categoriesContainer = document.getElementById('categoriesContainer')

    categoryBtn.classList.add('category-button')
    categoryBtn.id = id
    categoryBtn.innerText = categoryName
    categoryBtn.addEventListener("click", () => {
        selectCategory(id)
    })
    categoriesContainer.appendChild(categoryBtn)
}

// filter works on selected categories
function selectCategory(buttonId) {
    const filterButtons = document.getElementsByClassName("category-button")
    let selectedButton = document.getElementById(buttonId)
    for(let button of filterButtons) {
        button.classList = "category-button"
    }
   selectedButton.classList.add("selected-category")
    figureParent.innerHTML = ""
    let filterResults = []
    if (buttonId > 0) {
        filterResults = works.filter(function(work) {
            return work.categoryId === buttonId
        })
    } else {
        filterResults = works
    }
    
    for (let work of filterResults) {
        generateWorks(work.imageUrl, work.title, work.categoryId)
    }
}

// Show-hide edit gallery modal
const editGalleryBtn = document.getElementById('edit-gallery')
const closeModal = document.getElementById('close-modal')
const modal = document.getElementById('modal')
const deleteAll = document.getElementById('supprimer-galerie')


editGalleryBtn.addEventListener('click', showModal)

closeModal.addEventListener('click', hideModal)
// modal.addEventListener('click', (event) => {
//     event.stopPropagation();   
//     modal.classList.add('hide')    
// })

function showModal() {
    modal.classList.remove('hide')
    generateModalWorks()
}

function hideModal() {
    figureParent.innerHTML=''
    for (let work of works) {
        generateWorks(work.imageUrl, work.title, work.categoryId)
    }
    modal.classList.add('hide')
    resetAddImgWindow()
    resetModal()
}

// reset modal to initial window so it opens on edit gallery view
function resetModal() {
    addPhotoModal.classList.add('hide') 
    uploadNewWorkBtn.classList.add('hide')  
    backBtn.classList.add('hide') 
    modalImgContainer.classList.remove('hide')
    document.getElementById('modal-title').innerText='Galerie photo'
    addPhotoBtn.classList.remove('hide')
    deleteAll.classList.remove('hide')
}

const modalImgContainer = document.getElementById('modal-img-container')

function generateModalWorks() {
    modalImgContainer.innerHTML = ''
    for (let work of works) {
        let modalImg = document.createElement('div')
        let deleteWorkBtn = document.createElement('i')

        modalImg.classList.add('modal-img')
        deleteWorkBtn.classList = ('fa-solid fa-trash-can')
        deleteWorkBtn.addEventListener("click", () => {
            let index = works.indexOf(work)
                 deleteWork(work.id, index)
                 console.log(work.id)
             })
        modalImg.innerHTML = '<img src="' + work.imageUrl + '">' +
        '<i class="fa-solid fa-up-down-left-right"></i>' +
        '<p>Éditer</p>'
        modalImg.appendChild(deleteWorkBtn)
        modalImgContainer.appendChild(modalImg)            
    }
}

// delete works from array and api
function deleteWork(id, index) {
    works.splice(index, 1)
    generateModalWorks()

    fetch ('http://localhost:5678/api/works/' + id, {
        method: "DELETE", 
        headers: {
            'Authorization': `Bearer ${userToken}`
        },
        // body: myData
    })
.then (response => response.json())
.then (data => {   
    console.log(data)
    })
}

// Show Upload new photo modal
let addPhotoBtn = document.getElementById('modal-add-photo')
let addPhotoModal = document.getElementById('modal-add-photo-container')
let backBtn = document.getElementById('back-modal')
const uploadNewWorkBtn = document.getElementById('upload-new-work')
uploadNewWorkBtn.addEventListener('click', function(event) {
    createNewWork(event)
})

addPhotoBtn.addEventListener('click', addPhotoWindow)

function addPhotoWindow() {
    addPhotoModal.classList.remove('hide') 
    uploadNewWorkBtn.disabled = true
    uploadNewWorkBtn.classList.remove('hide')  
    backBtn.classList.remove('hide') 
    modalImgContainer.classList.add('hide')
    document.getElementById('modal-title').innerText='Ajout photo'
    addPhotoBtn.classList.add('hide')
    deleteAll.classList.add('hide')  
    generateCategoriesDropdown() 
}

backBtn.addEventListener('click', () => {
    resetAddImgWindow()
    resetModal()
})

// get categories and create option for each category
function generateCategoriesDropdown() {
    let categoryDropdown = document.getElementById('category-dropdown')
    categoryDropdown.innerHTML = ""
    
    for (let category of categories) {
        let option = document.createElement('option')
        option.value = category.id
        option.innerText = category.name
        categoryDropdown.appendChild(option)
    }
}

// Add input type file on new image button click (button is used insead of input to be able to style it according to the mockup)
let inputFile = document.createElement('input')
let image
let previewImg = document.getElementById('preview-img')

let newImgBtn = document.getElementById('new-img-btn')
const uploadImgIcon = document.getElementById('upload-image-icon')
const acceptedFileType = document.getElementById('accepted-file-type')

newImgBtn.addEventListener('click', (event) => {  
    event.preventDefault()
    inputFile.type = 'file'
    inputFile.addEventListener('change', () => {
        image = inputFile.files[0]
        console.log(image)

        // add preview image if file is selected
        if(inputFile.files.length > 0){
            var previewImgSrc = URL.createObjectURL(image)
            previewImg.src = previewImgSrc
            newImgBtn.classList.add('hide')
            acceptedFileType.classList.add('hide')
            uploadImgIcon.classList.add('hide')
            uploadNewWorkBtn.disabled = false
        }
   })
   inputFile.click()
})

function resetAddImgWindow() {
    newImgBtn.classList.remove('hide')
    acceptedFileType.classList.remove('hide')
    uploadImgIcon.classList.remove('hide')
    previewImg.src = ""
    titleInput.value = ""
}
let titleInput = document.getElementById('new-title')
let categoryImput = document.getElementById('category-dropdown')

// create new work data and send to server
function createNewWork(event) {
    event.preventDefault()
    let workTitle = titleInput.value
    let workCategory = categoryImput.value

    let myData = new FormData()
    myData.append("image", image )
    myData.append("title", workTitle)
    myData.append("category", workCategory)
    console.log(image, workCategory, workTitle)

    console.log(userToken)
    fetch ('http://localhost:5678/api/works', {
        method: "POST", 
        headers: {
            'Authorization': `Bearer ${userToken}`
            // "accept": "application/json",
            // "Content-Type": "multipart/form-data"
        },
        body: myData
    })
.then (response => response.json())
.then (data => {   
    works.push(data)
    console.log(works)
    for (let work of works) {
        generateWorks(work.imageUrl, work.title, work.categoryId)
    }
})
hideModal()


}



