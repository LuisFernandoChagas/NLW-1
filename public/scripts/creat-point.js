populateUfs()

function populateUfs(){
    const selectUfs = document.querySelector('select[name=uf]')

    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .then(function(res){
        return res.json()
    })
    .then(function(states){
        for(const state of states){
            selectUfs.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
    })
}

document.querySelector('select[name=uf]')
.addEventListener('change', getCities)

function getCities(event){
    const selectedCity = document.querySelector('select[name=city]')
    const ufValue = event.target.value

    const stateInput = document.querySelector('input[name=state]')
    const indexOfSelectedstate = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedstate].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    selectedCity.innerHTML = "<option value>Selecione a cidade</option>"
    selectedCity.disabled = true

    fetch(url)
    .then(function(res){
        return res.json()
    })
    .then(function(cities){
        for(city of cities){
            selectedCity.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        selectedCity.disabled = false
    })
}

const itensToCollect = document.querySelectorAll('.items-grid li')

for(const item of itensToCollect){
    item.addEventListener('click', selectItem)
}

const collectedItems= document.querySelector('input[name=items]')

let selectedItem = []

function selectItem(event){
    const itemLi = event.target
    itemLi.classList.toggle('selected')

    const itemId = itemLi.dataset.id

    const alreadySelected = selectedItem.findIndex(function(item){
        return item == itemId
    })

    if(alreadySelected != -1){
        const itemToRemove = selectedItem.filter(function(item){
            const itemIsDifferent = item != itemId // true
            return itemIsDifferent
        })
        
        selectedItem = itemToRemove
    } else {
        selectedItem.push(itemId)
    }

    collectedItems.value = selectedItem
}