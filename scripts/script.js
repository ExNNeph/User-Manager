class User {
  constructor(id, firstName, lastName, email) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

class UserManager {
  constructor() {
    this.users = this.loadUsersFromLocalStorage();
  }

  loadUsersFromLocalStorage() {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      return JSON.parse(usersData);
    }
    return [];
  }

  saveUsersToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this.users));
  }

  addUser(user) {
    this.users.push(user);
    this.saveUsersToLocalStorage();
  }

  updateUser(id, updatedUser) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      this.saveUsersToLocalStorage();
    } else {
      console.log('User not found');
    }
  }

  deleteUser(id) {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      this.saveUsersToLocalStorage();
    } else {
      console.log('User not found');
    }
  }

  getUser(id) {
    const user = this.users.find(user => user.id === id);
    if (user) {
      return user;
    } else {
      console.log('User not found');
      return null;
    }
  }

  getAllUsers() {
    return this.users;
  }
}

const userManager = new UserManager();

const userForm = document.getElementById('user-form');
const userTable = document.getElementById('user-table');

function addUserToTable(user) {
  const row = document.createElement('tr');
  row.setAttribute('data-user-id', user.id);
  row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.firstName}</td>
    <td>${user.lastName}</td>
    <td>${user.email}</td>
    <td>
      <button class="edit-user">Edit</button>
      <button class="delete-user">Delete</button>
    </td>
  `;
  userTable.querySelector('tbody').appendChild(row);

  row.querySelector('.delete-user').addEventListener('click', () => {
    userManager.deleteUser(user.id);
    row.remove();
  });

  row.querySelector('.edit-user').addEventListener('click', () => {
    userForm.querySelector('#firstName').value = user.firstName;
    userForm.querySelector('#lastName').value = user.lastName;
    userForm.querySelector('#email').value = user.email;
    userForm.querySelector('button[type="submit"]').textContent = 'Update User';
    userForm.setAttribute('data-editing-user-id', user.id);
  });
}

userForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const firstName = userForm.querySelector('#firstName').value;
  const lastName = userForm.querySelector('#lastName').value;
  const email = userForm.querySelector('#email').value;

  const editingUserId = userForm.getAttribute('data-editing-user-id');
  if (editingUserId) {
    const updatedUser = new User(parseInt(editingUserId), firstName, lastName, email);
    userManager.updateUser(parseInt(editingUserId), updatedUser);

    const row = userTable.querySelector(`tr[data-user-id="${editingUserId}"]`);
    row.querySelector('td:nth-child(2)').textContent = firstName;
    row.querySelector('td:nth-child(3)').textContent = lastName;
    row.querySelector('td:nth-child(4)').textContent = email;

    userForm.querySelector('button[type="submit"]').textContent = 'Add User';
    userForm.removeAttribute('data-editing-user-id');
  } else {
    const id = userManager.users.length + 1;
    const newUser = new User(id, firstName, lastName, email);
    userManager.addUser(newUser);
    addUserToTable(newUser);
  }

  userForm.reset();
});

const showUsersButton = document.getElementById('show-users-button');
showUsersButton.addEventListener('click', () => {
  const users = userManager.getAllUsers();
  userTable.querySelector('tbody').innerHTML = ''; // Clear the table body

  users.forEach(user => {
    addUserToTable(user);
  });
});

const showAllUsersButton = document.getElementById('show-users-button');

function toggleHideAllUsers() {
  const tableBody = userTable.querySelector('tbody');
  const isHidden = tableBody.style.display === 'none';

  if (isHidden) {
    tableBody.style.display = ''; // Show the table body
    showAllUsersButton.textContent = 'Hide All Users';
  } else {
    tableBody.style.display = 'none'; // Hide the table body
    showAllUsersButton.textContent = 'Show All Users';
  }
}

showAllUsersButton.addEventListener('click', toggleHideAllUsers);


const deleteAllUsersButton = document.getElementById('delete-all-users-button');
deleteAllUsersButton.addEventListener('click', () => {
  userManager.users = []; // Clear the users array
  userTable.querySelector('tbody').innerHTML = ''; // Clear the table body
  localStorage.removeItem('users'); // Remove the 'users' data from localStorage
});
