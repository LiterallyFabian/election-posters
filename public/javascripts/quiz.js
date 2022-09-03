function vote(vote) {
    // -1 disagree
    // 0 skip / neutral
    // 1 agree

    votes.push({
        poster: currentPoster,
        agree: vote
    });

    setQuote();
}

function show(){
    $("#poster-container").removeClass("d-none");
}

let data;
const occurrences = [];
let minQuotes = Number.MAX_VALUE; // the party with the least quotes available. if this is 3 we can not show more than 3 posters per party, etc
const shownQuotes = [];
const votes = [];
let currentPoster = null;

// jquery document on ready
$(document).ready(function () {
    $.getJSON("data.json", function (d) {
        data = d;

        for (let i = 0; i < data.parties.length; i++) {
            occurrences[i] = 0;
            minQuotes = Math.min(minQuotes, data.parties[i].posters.length);
        }

        console.log("data loaded");
        $(".answer-btn").prop("disabled", false);

        setQuote();
    });
});

function setQuote() {
    $("#remaining").text(`${shownQuotes.length}/${minQuotes * 8}`);

    let found = false;
    let poster;
    while (!found) {
        poster = getRandomPoster();
        if (!shownQuotes.includes(poster.image))
            found = true;
    }

    shownQuotes.push(poster.image);
    currentPoster = poster;

    $("#poster-container").addClass("d-none");
    $("#quote").text("“" + poster.text + "”")
    $("#poster-preview").attr("src", poster.image);
}

function getRandomPoster() {
    // random from array
    let party = data.parties[Math.floor(Math.random() * data.parties.length)];

    let i = Math.floor(Math.random() * party.posters.length);

    let poster = {
        party: party.name,
        image: `images/${party.id}${i + 1}.${party.format}`,
        text: party.posters[i],
    }

    return poster;
}