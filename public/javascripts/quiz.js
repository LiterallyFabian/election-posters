function vote(vote) {
    $("#poster-container").addClass("d-none");

    // -1 disagree
    // 0 skip / neutral
    // 1 agree

    voteData.votes.push({
        poster: currentPoster,
        agree: vote
    });

    if (shownQuotes.length === minQuotes * 8) {
        $(".res-btn").removeClass("d-none");
        $(".answer-btn").addClass("d-none");
        $("#quote").text("Du har nu besvarat alla frågor. Klicka på knappen nedan för att se resultatet.");
        $("#poster-preview").attr("src", "images/clap-clapping.gif");
        $.ajax('result', {
            data: JSON.stringify(voteData),
            contentType: 'application/json',
            type: 'POST'
        });
    } else {
        setQuote();
    }
}

function show() {
    $("#poster-container").removeClass("d-none");
}

function openResult(){
    window.location.href = `result/${voteData.id}`;
}

let data;
const occurrences = [];
let minQuotes = Number.MAX_VALUE; // the party with the least quotes available. if this is 3 we can not show more than 3 posters per party, etc
const shownQuotes = [];
const voteData = {
    votes: [],
    id: uuidv4(),
    date: new Date().toISOString().slice(0, 19).replace('T', ' ')
};
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

    $("#quote").text("“" + poster.text + "”")
    $("#poster-preview").attr("src", poster.image);
}

function getRandomPoster() {
    // random from array
    let party = data.parties[Math.floor(Math.random() * data.parties.length)];

    let i = Math.floor(Math.random() * party.posters.length);

    return {
        id: party.id,
        party: party.name,
        image: `images/${party.id}${i + 1}.${party.format}`,
        text: party.posters[i],
    };
}

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}