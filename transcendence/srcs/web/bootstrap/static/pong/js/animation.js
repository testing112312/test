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
            // tournament
        }
    }
    if (event.target.id == 'loginWith42') {
        // Redirect user to the 42 OAuth provider login page
        const clientId = "u-s4t2ud-4bdc7e01b6b0dc47a958e888510beedea7cad9c5dc0d9b198766eac3b43170a9";
        const redirectUri = "https://localhost/auth/callback/"; // Your callback URL
        const scope = "public"; // Adjust the scope as needed
        let csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Generate the 42 OAuth URL
        const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
        window.location.href = authUrl;
    }
    if (event.target.id == '2fa') {
        event.preventDefault();
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