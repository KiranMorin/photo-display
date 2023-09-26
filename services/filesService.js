import fs from "fs/promises";
import exifr from 'exifr';
import sharp from "sharp";

export const filesService = {

    /**
     * Returns a promise that resolves to an array of JPEG files in the specified path.
     *
     * @param {string} path - The path to the directory to search for JPEG files.
     * @return {Promise<Array<string>>} - A promise that resolves to an array of JPEG file names.
     */
    getFiles: (path) => {
        try {
            return fs.readdir(path).then((files) => {
                return files.filter(file => file.endsWith(".jpeg") || file.endsWith(".jpg"));
            });
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /**
     * Retrieves the EXIF data from the specified file.
     *
     * @param {string} fileName - The name of the file to read.
     * @return {Promise} A promise that resolves with the parsed EXIF data.
     */
    getExifs: (fileName) => {
        try {
            return fs.readFile(fileName).then(content => {
                return exifr.parse(content);
            });
        } catch (err) {
            return Promise.reject(err);
        }
    },

    /**
     * Retrieves a file with the given file name and size.
     *
     * @param {string} fileName - The name of the file to retrieve.
     * @param {number} size - The size of the file to retrieve.
     * @return {Promise<Buffer|string>} A promise that resolves with the file content or an error message.
     */    
    getFile: async (fileName, size) => {
        try {
            if (size) {
                const path = fileName.split('/');
                path.splice(path.length - 1, 0, size);
                size = parseInt(size);
    

                try {
                    await fs.access(path.join('/'));
                    return fs.readFile(path.join('/'));
                } catch (err) {
                    return filesService.resizeImage(fileName, size, path);
                }
            }
            return fs.readFile(fileName);
        } catch (error) {
            return Promise.reject(error);
        }
    },

    /**
     * Resizes an image file to a specified size.
     *
     * @param {string} fileName - The name of the image file to resize.
     * @param {number} size - The desired size of the image.
     * @return {Promise<Buffer>} - A promise that resolves to the resized image buffer.
     */
    resizeImage: async (fileName, size, path) => {
        try {
            return fs.readFile(fileName).then(Image => {
                return sharp(Image).resize(size, size, { fit: "outside" }).toBuffer().then(async buffer => {
                    const directory = path.slice(0, path.length - 1).join('/')
                    try {
                        await fs.access(directory);
                    } catch (err) {
                        fs.mkdir(directory);
                    }
                    fs.writeFile(path.join('/'), buffer);
                    console.log(`file ${fileName} resized`);
                    return buffer;
                }).catch((err) => {
                    throw err
                })
            })
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
