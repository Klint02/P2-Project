let lastAppendedSidebar;
function populateSideBar(objs, extra) {
    sideBar = document.getElementById("sideBar");
    sideBar.innerHTML = "";
    let i = 0;
    for (i = 0; i < objs.length; i++) {
        if (objs[i].answered === true && objs[i].active === true && objs[i].answering === true) {
            sideBar.appendChild(createSideElement(objs[i], i));
        }
    }
    if (extra != undefined && lastAppendedSidebar != extra) {
        lastAppendedSidebar = extra;
        sideBar.appendChild(createSideElement(extra, i + 1));
    }

    let buttons = document.getElementsByClassName("collapsible");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", (event) => {
            //this.classList.toggle("active");
            let content = buttons[i].nextElementSibling.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }
}

function createSideElement(obj, i) {
    const time = obj.timeset.split(' ')[1].replace('.', ':').substring(0, 5);
    let div = document.createElement("div");
    div.setAttribute("onclick", "gotoMarker();")
    div.setAttribute("style", "display: flex; flex-wrap: wrap; border: none");
    div.setAttribute("overflow-x", "hidden");

    if (i != 0) div.innerHTML = '<hr style="width: 100%; margin-top: 0px; margin-bottom: 0px;">';
    div.innerHTML += `<button class="collapsible" float:left;>${obj.situation}</button><button class="gotoMarker" type="button" onclick="gotoMarker('${obj.id}');">Go to</button>`;
    div.innerHTML += `<div class="content"><button class="button" type="button" onclick="link(\'${obj.id}\', true)">Link to current call</button><br>
    <b class="sidebarElementPadding">Name: ${obj.name}</b>
    <p class="sidebarElementPadding">Address: ${obj.location.address}</p>
    <p class="sidebarElementPadding">Call location: ${obj.AMLLocation.lat}  :  ${obj.AMLLocation.lng}</p>
    <p class="sidebarElementPadding">Phone nr: ${obj.number}</b>
    <p class="sidebarElementPadding">Time: ${time}</b>
    <p class="sidebarElementPadding">Injuries: ${obj.injuries}</b>
    <p class="sidebarElementPadding">Add Info: ${obj.description}</b>
    </div>`;
    return div;
}

function gotoMarker(objID) {
    if (objID == undefined) return;
    markersArray.forEach((localMarker) => {
        if (localMarker.id == objID) {
            map.setCenter(localMarker.getPosition());
            map.setZoom(15);
        }
    });
}