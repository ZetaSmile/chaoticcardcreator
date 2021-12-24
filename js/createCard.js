let common_config = {};
let type_config = {};

export function getName() {
    return common_config.name || "myImage.jpg";
}

export function resetTypeConfig() {
    type_config = {};  
}

export function updateCommonConfig(key, value) {
    common_config[key] = value;
}

// This function gathers the form data, loads the assets, and then draws the card
export async function createCard(ctx) {
    // Resets the canvas to prepare for redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gathers the form data and puts them into config
    const common_data = new FormData(document.getElementById('common-form'));
    for (const [key, value] of common_data.entries()) {
        common_config[key] = value;
    }

    const type_data = new FormData(document.getElementById('type-form'));
    for (const [key, value] of type_data.entries()) {
        type_config[key] = value;
    }

    // Loads all the required images
    const assets = await loadAssets();

    // After images are loaded, you can draw the card 
    drawCard(ctx, assets);

    return Promise.resolve();
}

/* This function ensures that all images have been loaded before proceeding */
async function loadAssets() {
    const loaded = {};
    const promises = gatherAssets().map((img) => {
        return new Promise((resolve) => {
            const [key, value] = Object.entries(img)[0];
            const loadable = new Image();
            loadable.onload = (() => {
                loaded[key] = loadable;
                resolve();
            });
            loadable.src = value;
        });
    });

    await Promise.all(promises);
    return loaded;
}

/**
* The following two functions should be modified in accordance to the forms data
*/

/* This function maps what images need to be loaded based on the configuration */
function gatherAssets() {
    const assets = [];

    if (common_config.art) {
        assets.push({art: common_config.art});
    }

    if (common_config.type === "creature") {
        if (type_config.tribe) {
            assets.push({card: `img/${type_config.tribe}.png`});
        }  
    }

    if (common_config.type === "battlegear") {
        assets.push({card: "img/battlegear.png"});
    }

    if (common_config.type === "attack") {
        assets.push({card: "img/attack.png"});
        
        // if (type_config.bp) {
        //     assets.push({card: `img/bp${type_config.bp}.png`})
        // }
    }
    return assets;
}

/* This function draws the card layer by layer, specify where images/text is drawn */
function drawCard(ctx, assets) {

    // Eventually we'll need to differentiate between location orientation, but save that for later

    if (assets.art) {
        ctx.drawImage(assets.art, 0, 0, assets.art.width, assets.art.height,
            10, 20, canvas.width - 10, canvas.height - 100);
    }
    if (assets.card) {
        ctx.drawImage(assets.card, 0, 0, assets.card.width, assets.card.height,
            0, 0, canvas.width, canvas.height);
    }
    if (common_config.name) {
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(common_config.name, canvas.width/2 , 24)
    }
    if (type_config.bp) {
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(type_config.bp, 20, 25)
    }
}

/*moved this from index.html attack temporarily. changed it from bp to base id. Gonna try something else for BP
 -Austin  <input type="number" name="base" id="base"></input> */