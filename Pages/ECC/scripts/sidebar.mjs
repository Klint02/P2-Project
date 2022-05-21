let lastAppendedSidebar;
//Populates the sidebar with elements
function populateSideBar(objs, extra) {
    sideBar = document.getElementById("sideBar");
    //Removes any existing elements
    if (objs == undefined) {
        sideBar.appendChild(createSideElement(extra, -1))
        let buttonList = document.getElementsByClassName("collapsible");
        addButtonListener(undefined, buttonList[buttonList.length - 1]);
    } else {
        sideBar.innerHTML = "";
        let i = 0;
        for (i = 0; i < objs.length; i++) {
            //If an object is considred current it will be appended to the sidebar
            if (objs[i].answered === true && objs[i].active === true && objs[i].answering === true) {
                sideBar.appendChild(createSideElement(objs[i], i));
            }
        }
        //The extra object is the latest object added, which will not be updated in time to have parameters
        //changed in time. Because of this it will be added despite parameters
        if (extra != undefined && lastAppendedSidebar != extra) {
            lastAppendedSidebar = extra;
            sideBar.appendChild(createSideElement(extra, i + 1));
        }

        let buttons = document.getElementsByClassName("collapsible");
        addButtonListener(buttons);
    }
}

//Adds events for the collapsible elements that views or hides the extra data
function addButtonListener(buttonList, button) {
    if (buttonList == undefined) {
        button.addEventListener("click", (event) => {
            let content = button.nextElementSibling.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    } else {
        for (let i = 0; i < buttonList.length; i++) {
            buttonList[i].addEventListener("click", (event) => {
                let content = buttonList[i].nextElementSibling.nextElementSibling;
                if (content.style.display === "block") {
                    content.style.display = "none";
                } else {
                    content.style.display = "block";
                }
            });
        }
    }

}

//Returns an html div element with the data from the passed object written in
function createSideElement(obj, i) {
    //Makes the time more readable for feeble human minds
    const time = obj.timeset.split(' ')[1].replace('.', ':').substring(0, 5);

    //Creates the div and sets the attributes for it note "hidden" is important
    let div = document.createElement("div");
    div.setAttribute("style", "display: flex; flex-wrap: wrap; border: none");

    let addressInput;
    if (obj.location.address == "Unknown address") {
        addressInput = String("(Unknown) AML - Lat: " + obj.AMLLocation.lat + " Lng: " + obj.AMLLocation.lng);
    } else {
        addressInput = obj.location.address;
    }
    //Adds the html for the sidebar
    if (i != 0) div.innerHTML = '<hr style="width: 100%; margin-top: 0px; margin-bottom: 0px;">';
    div.innerHTML += `<button class="collapsible" float:left;>${obj.situation}</button><button class="gotoMarker" type="button" onclick="gotoMarker('${obj.id}');">Go to</button>`;
    div.innerHTML += `<div class="content"><button class="button" type="button" onclick="link(\'${obj.id}\', true)">Link to current call</button><br>
    <b class="sidebarElementPadding">Name: ${obj.name}</b>
    <p class="sidebarElementPadding">Address: ${addressInput}</p>
    <p class="sidebarElementPadding">Call location: ${obj.AMLLocation.lat}  :  ${obj.AMLLocation.lng}</p>
    <p class="sidebarElementPadding">Phone nr: ${obj.number}</b>
    <p class="sidebarElementPadding">Time: ${time}</b>
    <p class="sidebarElementPadding">Injuries: ${obj.injuries}</b>
    <p class="sidebarElementPadding">Add Info: ${obj.description}</b>
    </div>`;
    return div;
}

//Centers a marker in the map
function gotoMarker(objID) {
    if (objID == undefined) return;
    markersArray.forEach((localMarker) => {
        if (localMarker.id == objID) {
            map.setCenter(localMarker.getPosition());
            map.setZoom(15);
        }
    });
}
