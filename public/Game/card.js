"use strict"
//All "public" variables need to be prefixed with uc(short for uno-card.js) in this file to avoid naming clashes

//Relative to game.html because thats where the img tag will be inserted into
const uc_strImagesDir = "Game/Images/";
const uc_strImageExtension = ".svg";
let uc_players = [];
let uc_playerSelf;



UC_CalculatePlayers();
function UC_CalculatePlayers() {
    const nPlayerCount = 8;
    for (let i = 0; i < nPlayerCount; i++)
    {
        let strClassName = ".player" + i;
        uc_players[i] = document.querySelector(strClassName);
        if (!uc_players[i]) { console.log ("Error: Could not find class: " + strClassName); }
    }
    uc_playerSelf = uc_players[0];
};

//Takes in a player object (html obj) and a string for the the card id (<color>-<type> eg: "red-5" or "blue-skip")
// public
function UC_AddCard(playerCtn, strCard) {
    if (!playerCtn || !strCard) { return; }    

    const horCtn = playerCtn.querySelector (".cardCtnHor");
    const verCtn = playerCtn.querySelector (".cardCtnVer");

    if (horCtn)
    {
        // console.log ("Added to horizontal");
        const newCard = document.createElement("img");
        newCard.src = uc_strImagesDir + "bottom-" + strCard + uc_strImageExtension;

        horCtn.appendChild(newCard);
        UCi_CardAddMetaData(newCard, strCard, true);
        return;
    }

    if (verCtn)
    {
        // console.log ("Added to vertical");
        const newCard = document.createElement("img");
        newCard.src = uc_strImagesDir + "right-" + strCard + uc_strImageExtension;

        verCtn.appendChild(newCard);
        UCi_CardAddMetaData(newCard, strCard, true);
        return;
    }

    //Doesn't have either of those two... The function was called with an invalid playerCtn
    console.log ("Error: Invalid Player container... Card: " + strCard);
    console.log (playerCtn);
}

//Internal function called within this js file... Takes in a card object that was just added by UC_AddCard
function UCi_CardAddMetaData (eCard, strCard, bAddClickListenerToSelf) {
    const nIndexDash = strCard.indexOf("-");
    if (nIndexDash == -1)   { console.log("Invalid str: " + strCard); return; }
    
    const strColor = strCard.slice(0, nIndexDash);
    const strType = strCard.slice(nIndexDash+1, strCard.length);

    if (!strColor || !strType) { console.log("Invalid str: " + strCard); return; }

    eCard.setAttribute("cardColor", strColor);
    eCard.setAttribute("cardType", strType);

    if (bAddClickListenerToSelf === true)
    {
        //Check if player clicked on their own card
        let ePlayerCtn = eCard;
        let bIsSelfCard = false;
        for (let i = 0; i < 3; i++)
        {
            if (ePlayerCtn.parentNode)
            {
                ePlayerCtn = ePlayerCtn.parentNode; 
                if (ePlayerCtn === uc_playerSelf)
                {
                    bIsSelfCard = true;
                }
            }
        }
        // const ePlayerCtn = eCard.parentNode.parentNode.parentNode;    
        if (bIsSelfCard)
        {
            eCard.addEventListener ("click", () => {
                UG_CardOnClick(eCard);
            });
        }
    }
    
}


// public
//Takes in a card element and removes it
function UC_RemoveCard (eCard) {
    if (!eCard) { console.log ("Invalid parameter..."); return; }
    eCard.parentNode.removeChild(eCard);
}

//public
function UC_HighlightPlayerCtn (ePlayer, bHighlight)
{
    if (!ePlayer) { console.log("Error..."); return; }    

    const horCtn = ePlayer.querySelector (".cardCtnHor");
    const verCtn = ePlayer.querySelector (".cardCtnVer");
    if (!horCtn && !verCtn) { console.log("Error..."); return; }
    const mainCtn = (horCtn) ? horCtn : verCtn;
    
    if (bHighlight)
    {
        mainCtn.style.boxShadow = "0px 0px 45px 10px #3333ff";
    }
    else
    {
        mainCtn.style.boxShadow = "none";
    }
}

//public
//Takes in a card element and adds/removes a higlight effect
function UC_HighlightCard (eCard, bHighlight) {
    if (!eCard) { console.log ("Invalid parameter..."); return; }

    const strHighlightColor = "FFE793";
    if (bHighlight === true)
    {
        eCard.style.boxShadow = "0px 0px 25px 6px #" + strHighlightColor;
    }
    else if (bHighlight === false)
    {
        eCard.style.boxShadow = "none";
    }
    else
    {
        console.log ("Invalid parameter...");  
    }
}  

//public
// Takes in a boolean for the direction
function UC_SetDirection (bIsClockwise)
{
    const ele = document.querySelector (".direction");
    if (!ele) { console.log ("Something went wrong"); return; }

    if (bIsClockwise === true)
    {
        ele.classList.remove ("anticlockwise");
        ele.classList.add ("clockwise")
    }
    else if (bIsClockwise === false)
    {
        ele.classList.remove ("clockwise")
        ele.classList.add ("anticlockwise");
    }
    else
    {
        console.log ("Something went wrong"); 
        return;
    }
}

//public
//PlayerDetails :
//      string name
//      int? winCount
//      array cards
// 
function UC_SetPlayerDetails (player, playerDetails, nRoundsToWin)
{
    if (!player || !playerDetails) { console.log ("Something went wrong"); return;}

    player.querySelector("p").textContent = playerDetails.name;
    // player.querySelector("p").textContent = `${playerDetails.name} (${playerDetails.winCount}/${nRoundsToWin})`;

    UCi_RemoveAllCards (player);

    for (let i = 0; i < playerDetails.cards.length; i++)
    {
        UC_AddCard (player, playerDetails.cards[i]);
    }
}
function UC_SetPlayerCards (player, cards)
{
    if (!player || !cards) { console.log ("Something went wrong"); return; }
    UCi_RemoveAllCards (player);

    for (let i = 0; i < cards.length; i++)
    {
        UC_AddCard (player, cards[i]);
    }
}

function UCi_RemoveAllCards (playerCtn)
{
    const horCtn = playerCtn.querySelector (".cardCtnHor");
    const verCtn = playerCtn.querySelector (".cardCtnVer");

    let cardCtn;
    if (horCtn)
        cardCtn = horCtn;
    else if (verCtn)
        cardCtn = verCtn;
    else
        return;
    
    while (cardCtn.lastElementChild) {
        cardCtn.removeChild(cardCtn.lastElementChild);
    }
}

////////////////////////////////////////////////////////////////////////

//Sets the value of the "thrown" / starting card
function UC_SetCurrentCard (strCard) {
    const eCard = document.querySelector (".currentCard");
    if (!eCard) { console.log ("Error"); return; }

    let strCardSrc = uc_strImagesDir + "bottom-" + strCard + uc_strImageExtension;
    // console.log (strCardSrc);
    eCard.setAttribute ("src", strCardSrc);
    UCi_CardAddMetaData (eCard, strCard, false);
}



function UC_ParseCard (strCard)
{
    const nIndexDash = strCard.indexOf('-');
    if (nIndexDash == -1)   { console.log("Invalid str: " + strCard); return null; }
    
    const strColor = strCard.slice(0, nIndexDash);
    const strType = strCard.slice(nIndexDash+1, strCard.length);

    if (!strType || !strColor) { console.log("Invalid str: " + strCard); return null; }

    const card = {color: strColor, type: strType};
    return card;
}
