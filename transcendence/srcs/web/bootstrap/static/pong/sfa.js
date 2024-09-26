
// Ajax request for navigation 
/*
    **str=>url from link
    using XMLHttpReqest() object to interact with servers
    xhr.open(method, url, async, user, password);
    method: The HTTP method to use (GET, POST, etc.)
    url: The URL to send the request to
    async: (optional) Boolean, if the request should be async (default true)
    user, password: (optional) Used for authentication
    
*/
function nav(str)
{
    console.log(str);
    fetch(str, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        document.getElementById('contentB').innerHTML = data;
        history.replaceState(null, null, str);
        history.pushState(null, null, str);
        updateNav(str);
        if (str.includes("profile"))
            match_history();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}
function updateNav(str)
{
    console.log("from :> updateNav "+str)
    let navstr ;
    if ( str.includes("loginEndPoint"))
    {
        navstr = str.replace("loginEndPoint/", "navbar");
    } 
    else if (str.includes("logout_view"))
    {
        navstr = str.replace("logout_view/", "navbar");
    }
    else if (str.includes("UpdateProfile"))
    {
        navstr = str.replace("UpdateProfile/", "navbar");
    }
    else
        return;
    console.log("nav link:  "+navstr);
    fetch(navstr, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        document.getElementById('nav-container').innerHTML = data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

}

function linkStateManager()
{
    console.log("from :> linkstate")
    let navlink = document.querySelectorAll('.ponglink');
    document.querySelectorAll('.ponglink.active').forEach(function(activeLink) {
        activeLink.classList.remove('link-light');
        activeLink.classList.remove('active');
        activeLink.classList.add('link-body-emphasis');
    });
    navlink.forEach(function(link) {
        if (link.href === location.href) {
            link.classList.remove('link-body-emphasis');
            link.classList.add('active');
            link.classList.add('link-light');
        }
    });
}
window.addEventListener('popstate', function(event) {
    console.log("from :> popstate")
    nav(location.href);
    linkStateManager();
});

window.onload = function()
{
    console.log("from :> onload")
    linkStateManager();
};

/* login */
// both versions of function work fetch and xhttp
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
