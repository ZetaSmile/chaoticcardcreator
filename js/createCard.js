let config = {};

export function getName() {
    console.log(config);
    return config.name || "myImage.jpg";
}

export function resetConfig() {
  config = {};  
}

export function updateConfig(key, value) {
    config[key] = value;
}

/* This function ensures that all images have been loaded */
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

/* This function maps what images need to be loaded based on the configuration */
function gatherAssets() {
    const assets = [];

    if (config.art) {
        assets.push({art: config.art});
    }

    if (config.type === "creature") {
        if (config.tribe) {
            assets.push({card: `img/${config.tribe}.png`})
        }  
    }

    if (config.type === "battlegear") {
        assets.push({card: "img/battlegear.png"});
    }

    if (config.type === "attack") {
        assets.push({card: "img/attack.png"});
        if (config.bp) {
        assets.push({bp: `img/bp_${config.bp}.png`})
        } 
    }
    return assets;
}

/* After images are loaded, you can draw the card */
export async function drawCard(ctx) {
    const assets = await loadAssets();

    // Eventually we'll need to differentiate between location orientation, but save that for later

    if (assets.art) {
        ctx.drawImage(assets.art, 0, 0, assets.art.width, assets.art.height,
            10, 20, canvas.width - 10, canvas.height - 100);
    }
    if (assets.card) {
        ctx.drawImage(assets.card, 0, 0, assets.card.width, assets.card.height,
            0, 0, canvas.width, canvas.height);
    }


    if (config.title) {
        ctx.fillText(config.title);
    }
}

/*moved this from index.html attack temporarily. changed it from bp to base id. Gonna try something else for BP
 -Austin  <input type="number" name="base" id="base"></input> */