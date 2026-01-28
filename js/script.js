// Capitalize first letter
function capitalizeFirstLetter(el){
    if(el.value.length > 0){
        el.value = el.value.charAt(0).toUpperCase() + el.value.slice(1);
    }
}

// Format date to words
function formatDateToWords(dateString){
    if(!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "2-digit",
        year: "numeric"
    });
}

// Update preview
function updatePreview(){
    p_ref.textContent = ref.value;
    p_date.textContent = formatDateToWords(date.value);
    p_person_name.textContent = person_name.value;
    p_incident_title.textContent = incident_name.value;
    p_description.innerHTML = description.value.replace(/\n/g,"<br>");
    p_received.innerHTML = received.value.replace(/\n/g,"<br>");
}

// Preview uploaded images
function previewImages(event){
    const container = document.getElementById("p_images_container");
    container.innerHTML = "";
    Array.from(event.target.files).forEach(file=>{
        const wrapper = document.createElement("div");
        wrapper.className = "image-wrapper";

        const img = document.createElement("img");
        img.src = URL.createObjectURL(file);

        wrapper.appendChild(img);
        container.appendChild(wrapper);

        enableResize(img); // Make image resizable
    });
}

// Enable Word-style corner resizing
function enableResize(img){
    const wrapper = img.parentElement;
    const corners = ["nw","ne","sw","se"];
    
    // Create 4 corner handles
    corners.forEach(corner=>{
        const handle = document.createElement("div");
        handle.className = "handle " + corner;
        wrapper.appendChild(handle);
    });

    // Select image on click
    img.addEventListener("click", e=>{
        document.querySelectorAll(".image-wrapper").forEach(w => w.classList.remove("selected"));
        wrapper.classList.add("selected");
    });

    const handles = wrapper.querySelectorAll(".handle");
    
    handles.forEach(handle=>{
        handle.addEventListener("mousedown", function(e){
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startW = img.offsetWidth;
            const startH = img.offsetHeight;

            function doDrag(e){
                let dx = e.clientX - startX;
                let dy = e.clientY - startY;
                let newW = startW;
                let newH = startH;

                // Adjust width based on corner
                if(handle.classList.contains("ne") || handle.classList.contains("se")){
                    newW = startW + dx;
                }
                if(handle.classList.contains("nw") || handle.classList.contains("sw")){
                    newW = startW - dx;
                }

                // Adjust height based on corner
                if(handle.classList.contains("sw") || handle.classList.contains("se")){
                    newH = startH + dy;
                }
                if(handle.classList.contains("nw") || handle.classList.contains("ne")){
                    newH = startH - dy;
                }

                // Minimum size
                if(newW > 20) img.style.width = newW + "px";
                if(newH > 20) img.style.height = newH + "px";
            }

            function stopDrag(){
                window.removeEventListener("mousemove", doDrag);
                window.removeEventListener("mouseup", stopDrag);
            }

            window.addEventListener("mousemove", doDrag);
            window.addEventListener("mouseup", stopDrag);
        });
    });
}