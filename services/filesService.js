import fs from "fs/promises";
import exifr from 'exifr';

export const filesService = {
    getFiles: (path) => {
        return fs.readdir(path).then((files) => {
            return files.reduce((acc, file) => {
                // only read jpeg files
                if (file.endsWith(".jpeg") || file.endsWith(".jpg")) {
                    acc.push( file);
                }
                return acc;
            }, []);
        });
    },
    getExifs: (fileName) => {
        return fs.readFile(fileName).then(content => {
            return exifr.parse(content);
        });
    },
    getFile: (fileName) => {
        return fs.readFile(fileName);
    }
}
