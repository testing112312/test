let navlink = document.querySelectorAll('.ponglink');
let game;
// Attach the event listener to a parent element that is already present in the DOM
document.body.addEventListener('click', function(event) {
    if (event.target.id == 'startButtonMultiplayer' || event.target.id == 'startButtonTournament') {
        if (!game)
        {
            let canvasid = "pong";
            if (document.getElementById('pong1'))
                canvasid = "pong1";
            game = new PongGame(canvasid);
            }
        if (event.target.id == 'startButtonMultiplayer')
            game.launchgame();
        else
        {
            
        }
    }
    if (event.target.id == 'userprofile') {
        event.preventDefault(); 
        friend_profile(event.target.textContent);
    }
    // Check if the clicked element has the class 'ponglink'
    if (event.target.classList.contains('ponglink')) {
        event.preventDefault(); 
        if (window.location.href.includes('game') && !event.target.href.includes('game')) {
            if (game)
            {
                console.log("endgame");
                game.clearCanvas();
                game.endGame();
                game = null;
            }
        }
        if (!(window.location.href.includes('game') && event.target.href.includes('game')))
            nav(event.target.href);
        // Remove the 'active' class from all links
        document.querySelectorAll('.ponglink.active').forEach(function(activeLink) {
            activeLink.classList.remove('link-light');
            activeLink.classList.remove('active');
            activeLink.classList.add('link-body-emphasis');
        });
        // Add the 'active' class to the clicked link
        event.target.classList.remove('link-body-emphasis');
        event.target.classList.add('active');
        event.target.classList.add('link-light');
    }
});
navlink.forEach((link) => {
    const originalText = link.textContent;
    link.addEventListener('mouseover', () => {
        link.style.color = 'gray';
    let i = "A";
    let j = 0;
    
        function animateText() {
            if (i <= originalText[j]) {
                let newText = originalText.slice(0,j) + i + originalText.slice(1+j);
                link.textContent = newText;
                i = String.fromCharCode(i.charCodeAt(0) + 1);
                animationId = setTimeout(animateText, 0.1);
            }
            else if(j < originalText.length - 1)
            {
                j++;
                i = "A";
                animationId = setTimeout(animateText, 0.3);
            }
        }
        animateText();  // Start the animation
    });
    link.addEventListener('mouseout', () => {
        clearTimeout(animationId);
        link.style.color = 'black';
        link.textContent = " ";
        link.textContent = originalText;
    });
});

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

function updatemessage(flag){
    const messages = document.getElementsByClassName('message');
    Array.from(messages).forEach(message => {
        flag ? message.classList.remove('d-none') : message.classList.add('d-none');
    });
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