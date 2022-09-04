var data = []

window.editUser = async function () {
    const name = document.getElementById('name').value;
    const lname = document.getElementById('lname').value;
    const cellphone = document.getElementById('cellphone').value;
    const email = document.getElementById('email').value;

    data[0] = {
        firstName: name,
        lastName: lname,
        phone: cellphone,
        email: email
    }
    displayUserData()
    document.getElementById('modal-form').style.display = 'none';
    emergentMessage('Se han actualizado tus datos');
}

window.addContact = async function () {
    const name = document.getElementById('name').value;
    const lname = document.getElementById('lname').value;
    const cellphone = document.getElementById('cellphone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    let lastId = data.slice(-1);
    var date = new Date();
	var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate();
	var current_time = date.getHours()+":"+date.getMinutes()+":"+ date.getSeconds();
	var date_time = current_date+" "+current_time;	
    data.push({
        id: lastId[0].id + 1,
        firstName: name,
        lastName: lname,
        phone: cellphone,
        email: email,
        address: address,
        created_at: date_time
    })
    displayContacts();
    document.getElementById('modal-form').style.display = 'none';
    emergentMessage('Contacto guardado con éxito');
}

window.editContact = async function (id) {
    const name = document.getElementById('name').value;
    const lname = document.getElementById('lname').value;
    const cellphone = document.getElementById('cellphone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    index = getIndex(id);
    data[index] = {
        firstName: name,
        lastName: lname,
        phone: cellphone,
        email: email,
        address: address
    }

    displayContacts();
    document.getElementById('modal-form').style.display = 'none';
    emergentMessage('Contacto modificado');
}

window.removeContact = async function (id) {
    index = getIndex(id);
    data.splice(index, 1)
    displayContacts();
    emergentMessage('Contacto eliminado');
}

async function searchContacts() {
    const search = document.getElementById('search-input').value;
    const contacts = await service.searchContacts(search);
    displayContacts(contacts);
}

window.displayModal = async function (action = null, id = null) {
    var modalForm = document.getElementById('modal-form');
    var modalTitle = document.getElementById('modal-title');
    var contact;
    var saveBtn = document.getElementById('save');

    if (action != null) {
        if (action == 1) { // editar info del usuario
            contact = data[0];
            document.getElementById('address').setAttribute('disabled', 'true');
            modalTitle.innerText = 'Edite su información';
            saveBtn.setAttribute('onclick', "editUser()");
        }
        else if (action == 2) { // editar info del contacto
            let index = getIndex(id)
            contact = data[index];
            modalTitle.innerText = 'Edite su contacto';
            document.getElementById('address').removeAttribute('disabled');
            document.getElementById('address').value = contact.address;
            saveBtn.setAttribute('onclick', "editContact(" + id + ")");
        }
        document.getElementById('name').value = contact.firstName;
        document.getElementById('lname').value = contact.lastName;
        document.getElementById('cellphone').value = contact.phone;
        document.getElementById('email').value = contact.email;
        saveBtn.innerText = 'Guardar cambios';
        modalForm.style.display = 'block';
    }
    else { // añadir contacto
        document.getElementById('address').removeAttribute('disabled');
        document.getElementById('contact-form').reset();
        modalTitle.innerText = 'Nuevo contacto';
        saveBtn.innerText = 'Guardar';
        saveBtn.setAttribute('onclick', "addContact()");
        modalForm.style.display = 'block';
    }
}

async function displayUserData() {
    var user = data[0];
    document.getElementById('user-name').innerText = user.firstName + ' ' + user.lastName;
    document.getElementById('user-cp').innerText = user.phone;
    document.getElementById('user-mail').innerText = user.email;
}

async function displayContacts() {
    var contactsList = document.getElementById('contacts-list');
    contactsList.innerHTML = '';
    contacts = data.slice(1);
    contacts.forEach(contact => {
        var row = document.createElement('tr');
        row.setAttribute('id', "contact-" + contact.id);
        row.innerHTML = `
                <td><input type='checkbox' id='select-contact-${contact.id}' name='select-contact'/></td>
                <td>${contact.firstName + ' ' + contact.lastName}</td>
                <td>${contact.phone}</td>
                <td>${contact.email}</td>
                <td>${contact.address}</td>
                <td>
                    <button type="button" id="edit-user" class="btn btn-light" onclick="displayModal(2, ${contact.id})"><img id="edit-image" src="assets/edit.png" alt="edit image"></button>
                </td>
                <td>
                    <button type="button" id="remove-user" class="btn btn-light" onclick="removeContact(${contact.id})"><img id="remove-image" src="assets/remove.png" alt="remove image"></button>
                </td>
            `;
        contactsList.appendChild(row);
    });
}

async function displayAll() {
    data = await fetch("../data.json").then(res => { return res.json() });
    displayUserData();
    displayContacts();
}

function selectAllToggle(source) {
    const checkboxes = document.getElementsByName('select-contact');
    checkboxes.forEach(checkbox => {
        checkbox.checked = source.checked;
    });
}

function emergentMessage(message) {
    const popup = document.getElementById('emergent-message');
    document.getElementById('message').innerText = message;
    popup.style.display = 'flex'
    setTimeout(function () {
        popup.style.display = 'none';
    }, 4000);
}

function getIndex(id) {
    let k = 0;
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) return k;
        k++;
    }
    return -1;
}

window.onload = async function (e) {
    document.getElementById('edit-user').addEventListener('click', function () {
        displayModal(1);
    })
    document.getElementById('form-link').addEventListener('click', function () {
        displayModal();
    });
    document.getElementById('search').addEventListener('click', function (e) {
        e.preventDefault();
        searchContacts();
    })
    document.getElementById('contacts').addEventListener('click', function () {
        displayAll();
    })
    document.getElementById('select-all').addEventListener('click', function () {
        selectAllToggle(this);
    })
    displayAll();
}