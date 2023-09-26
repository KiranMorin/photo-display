const fullWidth = document.documentElement.clientWidth;
const fullHeight = document.documentElement.clientHeight;

let listElement;
let cellGroupNumber;
let config;
let photos = [];
let cellWidth;
let offset = 0;
let recyclingOffset = 0;
const positions = [];

/**
 * Sends a request to the specified URL using the specified method and data.
 *
 * @param {string} url - The URL to send the request to.
 * @param {string} method - The HTTP method to use for the request.
 * @param {any} data - The data to send with the request.
 * @return {Promise<any>} A promise that resolves with the response data if the request is successful,
 * or rejects with an error object if the request fails.
 */
const makeRequest = (url, method, data) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                if (xhr.getResponseHeader('Content-Type').startsWith('application/json')) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    resolve(xhr.response);
                }
            } else {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = () => {
            reject({
                status: xhr.status,
                statusText: xhr.statusText
            });
        };
        xhr.send(data);
    });
};

/**
 * Creates a cell element with an image.
 *
 * @param {Object} photo - The photo object containing the URL and file name.
 * @return {HTMLElement} The created cell element.
 */
const createCell = (photo) => {
    const cell = document.createElement('div');
    const img = document.createElement('img');

    if (photo) {
        img.src = photo.url + "?size=" + cellWidth;
        img.alt = photo.file;    
    }
    cell.classList.add('cell');
    cell.classList.add('cellDirection-' + config.layout.direction);
    cell.classList.add('cellRatio-' + config.layout.cellRatio.replace('/', '-'));
    cell.classList.add('cellSize-' + config.layout.cellNumber);
    img.classList.add('image-fit-' + config.layout.imageFit);
    cell.appendChild(img);
    return cell;
}

/**
 * Creates a cell group element.
 *
 * @return {HTMLElement} The created cell group element.
 */
const createCellGroup = () => {
    const cellGroup = document.createElement('div');
    cellGroup.classList.add('cellGroup');

    return cellGroup;
}

/**
 * Initializes the layout of the cells based on the configuration settings.
 *
 * @return {undefined} This function does not return a value.
 */
const init = () => {
    if (config.layout.direction === 'horizontal') {
        let ratio = 1;
        switch (config.layout.cellRatio) {
            case '2/3':
                ratio = 2 / 3;
                break;
            case '16/9':
                ratio = 16 / 9;
                break;
        }
        cellWidth = fullHeight / config.layout.cellNumber * ratio;
        cellGroupNumber = Math.ceil(fullWidth / cellWidth) + 1;

        offset = cellGroupNumber * config.layout.cellNumber;

        for (let i = 0; i < cellGroupNumber; i++) {
            const cellGroup = createCellGroup();
            cellGroup.style.transform = "translateX(" + i * cellWidth + "px)";
            positions.push(i);
            listElement.appendChild(cellGroup);
            for (let j = 0; j < config.layout.cellNumber; j++) {
                const cell = createCell(photos[i * config.layout.cellNumber + j]);
                cellGroup.appendChild(cell);
            }
        }
    }
}

/**
 * Sets the data for the list element.
 *
 * @return {undefined} This function does not return a value.
 */
const setData = () => {
    if (!listElement) return;
    listElement.childNodes.forEach((element, index) => {
        if (index === recyclingOffset) {
            element.childNodes.forEach((element, index) => {
                if (photos[offset]) {
                    element.childNodes[0].src = photos[offset].url + "?size=" + cellWidth;
                    element.childNodes[0].alt = photos[offset].file;
                }

                if (offset === photos.length - 1) {
                    console.log("reset offset");
                    offset = 0;
                } else {
                    offset += 1;
                }
            });
        }
        if (positions[index] === 0) {
            positions[index] = cellGroupNumber - 1;
        } else {
            positions[index] -= 1;
        }
        element.style.transform = "translateX(" + positions[index] * cellWidth + "px)";
    });
    if (recyclingOffset === cellGroupNumber - 1) {
        console.log("reset recyclingOffset");
        recyclingOffset = 0;
    } else {
        recyclingOffset += 1;
    }
}

/**
 * Loads the datas by making two API requests and updating the photos and config variables.
 *
 * @return {Promise} A promise that resolves when both API requests are complete.
 */
const loadDatas = () => {
    return makeRequest('/photos', 'GET').then(data => {
        if (photos.length > data.length) {
            offset = 0;
        }
        photos = data;
        console.log(photos.length + " photos loaded");
        return makeRequest('/config', 'GET').then(data => {
            listElement = document.getElementById('list');
            config = data;
        });
    });
}

/**
 * Moves to the next element in the list.
 *
 * @return {undefined} This function does not return any value.
 */
const next = () => {
    if (listElement) {
        setData(offset)
        listElement.style.transition = "none";
        listElement.style.transform = "translateX(0)";
        setTimeout(() => {
            listElement.style.transition = "transform 1s ease-in-out";
            listElement.style.transform = "translateX(-" + cellWidth + "px)";
        }, 500);
    }
}

setInterval(next, 2000);
setInterval(loadDatas, 10000)
loadDatas().then(() => {
    init();
})