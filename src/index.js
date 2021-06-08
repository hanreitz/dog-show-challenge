document.addEventListener('DOMContentLoaded', () => {
  // get document element that is the table
  // fetch all the registered dogs
  getDogs();

  const editForm = document.getElementById('dog-form');
  editForm.addEventListener('submit', event => editDog(event))
})

function getDogs() {
  fetch('http://localhost:3000/dogs')
  .then(response => response.json())
  .then(makeDogRow);
}

function makeDogRow(jsonInput) {
  const registeredDogs = document.querySelector("body > div > div:nth-child(3) > table");
  for(dog of jsonInput) {
    // add a new table row tr for each dog
    const tr = `
      <tr class='padding' id='${dog.id}'>
        <td class ='padding center'>${dog.name}</td>
        <td class ='padding center'>${dog.breed}</td>
        <td class ='padding center'>${dog.sex}</td>
        <td class ='padding center'><button class='edit-dog'>Edit Dog</button></td>
      </tr>
    `
    registeredDogs.innerHTML += tr;
  }
  listenToEditButtons();
}

function listenToEditButtons() {
  const editButtons = Array.from(document.getElementsByClassName('edit-dog'));
  for(eb of editButtons) {
    eb.parentElement.addEventListener('click', event => preFillEditForm(event.target));
  }
}

function preFillEditForm(clickTarget) {
  const editDogForm = document.getElementById('dog-form');
  if (!editDogForm.children.hidden) {
    editDogForm.innerHTML += `
      <input type='hidden' 
      name='hidden' 
      value='${clickTarget.parentElement.parentElement.id}'>
    `
  } else {
    editDogForm.children.hidden.id = clickTarget.parentElement.parentElement.id;
  }
  const dogName = document.querySelector("#dog-form > input[type=text]:nth-child(1)");
  const dogBreed = document.querySelector("#dog-form > input[type=text]:nth-child(2)");
  const dogSex = document.querySelector("#dog-form > input[type=text]:nth-child(3)")
  dogName.value = `${clickTarget.parentElement.parentElement.children[0].innerText}`;
  dogBreed.value = `${clickTarget.parentElement.parentElement.children[1].innerText}`;
  dogSex.value = `${clickTarget.parentElement.parentElement.children[2].innerText}`;
}

function editDog(event) {
  event.preventDefault();
  const formFields = event.target.children;
  const dogUpdateOptions = {
    method: "PATCH",
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      id: formFields[4].value, 
      name: formFields[0].value,
      breed: formFields[1].value,
      sex: formFields[2].value
    })
  };
  fetch(`http://localhost:3000/dogs/${formFields[4].value}`, dogUpdateOptions)
  .then(response => response.json())
  .then(data => updateRow(data))
}

function updateRow(data) {
  const rowToUpdate = document.getElementById(data.id);
  rowToUpdate.innerHTML = `
    <tr class='padding' id='${data.id}'>
      <td class ='padding center'>${data.name}</td>
      <td class ='padding center'>${data.breed}</td>
      <td class ='padding center'>${data.sex}</td>
      <td class ='padding center'><button class='edit-dog'>Edit Dog</button></td>
    </tr>
  `;
}