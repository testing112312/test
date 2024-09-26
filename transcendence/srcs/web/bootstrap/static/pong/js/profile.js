
function addfriend(username){
    const navstr = `/addfriend?username=${encodeURIComponent(username)}`;

    fetch(navstr, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    .then(response => {
        if (response.ok) {
            // console.log(response.text());
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        pendingfriendlist();
        searchlistenner();
        friendslist();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function friend_profile(username){
    const navstr = `/friend_profile?username=${encodeURIComponent(username)}`;

    fetch(navstr, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    .then(response => {
        if (response.ok) {
            // console.log(response.text());
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        document.getElementById('contentB').innerHTML = data;
        match_history(username);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function removefriend(username){
    const navstr = `/removefriend?username=${encodeURIComponent(username)}`;

    fetch(navstr, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    .then(response => {
        if (response.ok) {
            // console.log(response.text());
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        friendslist();
        pendingfriendlist();
        console.log("removefriend");
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function friendslist(){
    const navstr = `/friendslist/`;

    fetch(navstr, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        document.getElementById('friendslists').innerHTML = data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function pendingfriendlist(){
    const navstr = `/pendingfriendlist/`;

    fetch(navstr, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        document.getElementById('pendinglist').innerHTML = data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}


function match_history(username){
    let navstr;
    console.log(username);
    if (username == undefined)
        navstr = `/match_history`;
    else
        navstr = `/match_history?username=${encodeURIComponent(username)}`;

    fetch(navstr, {
        method: 'GET',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
    })
    .then(response => {
        if (response.ok) {
            return response.text();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        document.getElementById('match_history').innerHTML = data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function searchlistenner(){
    searchInput = document.querySelector('.search-user');
    loadusers("friendslist");
    searchInput.addEventListener('keyup', function(event) {
        const query = searchInput.value;
        const navstr = `/userlist?search=${encodeURIComponent(query)}`;
        // const navstr = `/bootstrap/userlist`
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
            document.getElementById('friendslist').innerHTML = data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    
        console.log(searchInput.value);
    });
}

function loadusers(id) {
    console.log("loadusers");
    const navstr = `/userlist`;
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
        document.getElementById(id).innerHTML = data;
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    console.log(searchInput.value);
}

function updatemessage(flag, type){
    const messages = document.getElementsByClassName('message');
    Array.from(messages).forEach(message => {
        flag ? message.classList.remove('d-none') : message.classList.add('d-none');
    });
    if (type == 1)
        ;
    else 
        ;
}

function valid_image(file) {
    const allowedExtensions = ['image/png', 'image/jpeg', 'image/jpg']; // MIME types for .png, .jpg, .jpeg
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes

    // Check file size
    if (file.size > maxSize) {
        document.getElementById('error').innerText = "Image size must be less than 2MB";
        updatemessage(1);
        return false;
    }

    // Check file type
    console.log(file.type);
    if (!allowedExtensions.includes(file.type)) {
        document.getElementById('error').innerText = "Image must be of type PNG, JPG, or JPEG";
        updatemessage(1);
        return false;
    }

    updatemessage(0);
    const imgURL = URL.createObjectURL(file);
    document.getElementById("imgArea").setAttribute("src", imgURL);
    // Validation passed
    return true;
}