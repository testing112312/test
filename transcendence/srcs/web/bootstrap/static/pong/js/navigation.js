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
    else if (str.includes("verify_2fa"))
    {
        navstr = str.replace("verify_2fa", "navbar");
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