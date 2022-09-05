function vote(vote) {
    $("#poster-container").addClass("d-none");

    // -1 disagree
    // 0 skip / neutral
    // 1 agree


    let voteData = {
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        user_id: getCookie("user_id"),
        party_id: currentPoster.partyId.toUpperCase(),
        poster_id: currentPoster.posterIndex,
        vote: vote === 1 ? 'yes' : vote === -1 ? 'no' : 'skip'
    };

    $.ajax('vote', {
        data: JSON.stringify(voteData),
        contentType: 'application/json',
        type: 'POST'
    });

    setQuote();
}

let data;
const shownQuotes = [];
let totalPosters = 0;

$(document).ready(function () {
    // check if user has cookie
    if (getCookie("user_id") === "") {
        setCookie("user_id", uuidv4(), 365);
    }

    $.getJSON("data.json", function (d) {
        data = d;

        for (let i = 0; i < data.parties.length; i++) {
            totalPosters += data.parties[i].posters.length;
        }

        console.log("data loaded");
        $(".answer-btn").prop("disabled", false);

        setQuote();
    });
});

function setQuote() {
    $("#remaining").text(`${shownQuotes.length}/${totalPosters}`);

    let found = false;
    let poster;
    while (!found) {
        poster = getRandomPoster();
        if (!shownQuotes.includes(poster.image))
            found = true;
    }

    shownQuotes.push(poster.image);
    currentPoster = poster;

    $("#quote").text("“" + poster.text + "”")
    $("#poster-preview").attr("src", poster.image);
}

function getRandomPoster() {
    // random from array
    let party = data.parties[Math.floor(Math.random() * data.parties.length)];

    let i = Math.floor(Math.random() * party.posters.length);

    return {
        partyId: party.id,
        party: party.name,
        image: `images/${party.id}${i + 1}.${party.format}`,
        text: party.posters[i],
        posterIndex: i
    };
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}