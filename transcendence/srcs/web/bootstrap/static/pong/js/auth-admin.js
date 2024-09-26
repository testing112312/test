function login()
{
    document.getElementById('loginform').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        let action = document.getElementById('loginform').action;
        
        let username = document.getElementById('id_username').value;
        let password = document.getElementById('id_password').value;
    
        let user = {
            username: username,
            password: password,
        };
        
        let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
        // Set up fetch request
        fetch(action, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            if (response.status === 422) {
                console.log("failed1");
            } else if (response.status === 404) {
                console.log("failed2");
            } else if (response.status === 400) {
                console.log("failed3");
            } else if (response.status === 200 || response.status === 401) {
                return response.text();
            } else {
                console.log("failed4");

                throw new Error('Unexpected response status: ' + response.status);
            }
        })
        .then(data => {
            if (data) {
                console.log(data);
                document.getElementById('contentB').innerHTML = data;
                updateNav(action);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
}


// just used this for temp, can easily convert to fetch
function signup()
{   
    document.getElementById('signform').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    let action = document.getElementById('signform').action;
    // console.log(action);
    
    var email = document.getElementById('id_email').value;
    var username = document.getElementById('id_username').value;
    var password = document.getElementById('id_password').value;
    var password1 = document.getElementById('id_password1').value;
    let fileInput = document.getElementById('id_file').files;

    let formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('password1', password1);
    if (fileInput[0] != undefined)
        formData.append('file', fileInput[0]);
    var csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(action, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrfToken
        },
        body: formData
    })
    .then(response => {
        if (response.status === 200 ) {
            return response.text();
        } else {
            console.log("failed4");

            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .then(data => {
        if (data) {
            document.getElementById('contentB').innerHTML = data;
            updatemessage(1);
            updateNav(action);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}); 
}
function verify2fa(url)
{
    console.log("verify2fa :>"+url);
    let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // Set up fetch request
    fetch(url, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => {
       if (response.status === 200 || response.status === 401) {
            return response.text();
        } else {
            console.log("failed4");
            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .then(data => {
        if (data) {
            document.getElementById('contentB').innerHTML = data;
            updatemessage(1);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function setup2fa(url)
{
    document.getElementById('updateform').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
    
        console.log("setup :>"+url);
    let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    // Set up fetch request
    fetch(url, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRFToken': csrfToken
        }
    })
    .then(response => {
       if (response.status === 200 || response.status === 401) {
            return response.text();
        } else {
            console.log("failed4");
            throw new Error('Unexpected response status: ' + response.status);
        }
    })
    .then(data => {
        if (data) {
            document.getElementById('contentB').innerHTML = data;
            updatemessage(1);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
    });
}
function verify_2fa()
{
    document.getElementById('verify_2fa').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        let action = document.getElementById('verify_2fa').action;
        let form_control = document.getElementById('2fa_code').value;
        let formData = new FormData();
        formData.append('2fa_code', form_control);
        let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        // Set up fetch request
        fetch(action, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            },
            body: formData
        })
        .then(response => {
            if (response.status === 200 || response.status === 401) {
                return response.text();
            } else {
                console.log("failed4");

                throw new Error('Unexpected response status: ' + response.status);
            }
        })
        .then(data => {
            if (data) {
                document.getElementById('contentB').innerHTML = data;
                updateNav(action);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
}

function updateuser()
{
    document.getElementById('updateform').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission
        let action = document.getElementById('updateform').action;
        let username = document.getElementById('id_username').value;
        let password = document.getElementById('id_password').value;
        let new_password = document.getElementById('id_new_password').value;
        let fa_bool = document.getElementById('formCheck-1').checked;
        
        console.log(username);
        console.log(password);
        console.log(fa_bool);
        let fileInput = document.getElementById('id_file').files;
    
        let formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('new_password', new_password);
        formData.append('fa_bool', fa_bool);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        if (fileInput[0] != undefined)
            formData.append('file', fileInput[0]);
        let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    
        // Set up fetch request
        fetch(action, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrfToken
            },
            body: formData
        })
        .then(response => {
            if (response.status === 422) {
                console.log("failed1");
            } else if (response.status === 404) {
                console.log("failed2");
            } else if (response.status === 400) {
                console.log("failed3");
            } else if (response.status === 200 || response.status === 401) {
                return response.text();
            } else {
                console.log("failed4");

                throw new Error('Unexpected response status: ' + response.status);
            }
        })
        .then(data => {
            if (data) {
                document.getElementById('contentB').innerHTML = data;
                updatemessage(1);
                updateNav(action);
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    });
}