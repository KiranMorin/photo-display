let config = {};

/**
 * Updates the form with values from the config object.
 *
 * @param {type} paramName - description of parameter
 * @return {type} description of return value
 */
const updateForm = () => {
    document.getElementById("direction").value = config.layout.direction;
    document.getElementById("cellRatio").value = config.layout.cellRatio;
    document.getElementById("cellNumber").value = config.layout.cellNumber;
    document.getElementById("imageFit").value = config.layout.imageFit;
    
    document.getElementById("scrollInterval").value = config.timings.scrollInterval;
    document.getElementById("scrollSpeed").value = config.timings.scrollSpeed;
}

/**
 * Sends the configuration data to the server.
 *
 * @return {Promise} A promise that resolves to the response data from the server.
 */
const sendConfig = () => {
    if (!config.layout) {
        config.layout = {};
    }
    config.layout.direction = document.getElementById("direction").value;
    config.layout.cellRatio = document.getElementById("cellRatio").value;
    config.layout.cellNumber = document.getElementById("cellNumber").value;
    config.layout.imageFit = document.getElementById("imageFit").value;
    
    if (!config.timings) {
        config.timings = {};
    }
    config.timings.scrollInterval = document.getElementById("scrollInterval").value;
    config.timings.scrollSpeed = document.getElementById("scrollSpeed").value;
    
    makeRequest("/config", "POST", JSON.stringify(config)).then(data => {
        document.getElementById("rawJson").innerHTML = JSON.stringify(data, null, 4);
        updateForm();
    })
}

makeRequest("/config", "GET").then(data => {
    config = data;
    document.getElementById("rawJson").innerHTML = JSON.stringify(data, null, 4);
    updateForm();
})
