import fs from "fs/promises";

export const configService = {
    /**
     * Retrieves the default configuration for the system.
     *
     * @return {Object} The default configuration object.
     */
    getDefaultConfig: () => {
        return {
            layout: {
                direction: "horizontal",
                cellRatio: "1/1", // or 2/3 or 16/9 
                cellNumber: 3,
                imageFit: "cover" // or contain or fill
            },
            timings: {
                scrollInterval: 2000,
                scrollSpeed: 500
            }
        }
    },

    /**
     * Retrieves the configuration from the "config.json" file.
     *
     * @param {boolean} retried - indicates whether the function has already retried to retrieve the configuration
     * @return {Promise<object>} a Promise that resolves with the parsed configuration object
     */
    getConfig: (retried) => {
        return fs.readFile("config.json").then(data => {
            return JSON.parse(data);
        }).catch(err => {
            if (retried) {
                return Promise.reject(err);
            }
            return configService.updateConfig(configService.getDefaultConfig()).then(() => {
                return configService.getConfig(true);
            })
        });
    },

    /**
     * Updates the configuration by writing it to the "config.json" file.
     *
     * @param {Object} config - The updated configuration object.
     * @return {Promise<void>} A promise that resolves when the configuration is successfully written.
     */
    updateConfig: (config) => {
        return fs.writeFile("config.json", JSON.stringify(config)).then(() => {
            return Promise.resolve(config);
        });
    }
}