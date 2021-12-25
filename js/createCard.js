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
    type_config=[] // empty array first to not persist between updates
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
    //console.log(common_config.type)

    if (common_config.art) {
        assets.push({art: common_config.art});
    }

    if (common_config.type === "creature") {
        if (type_config.tribe) {
            assets.push({card: `img/${type_config.tribe}.png`});
        }  
        if (type_config.fire) {
            assets.push({firecreature: "img/firecreature.png"});
        }

        if (type_config.air) {
            assets.push({aircreature: "img/aircreature.png"});
        }
    
        if (type_config.earth) {
            assets.push({earthcreature: "img/earthcreature.png"});
        }
    
        if (type_config.water) {
            assets.push({watercreature: "img/watercreature.png"});
        }
    }

    if (common_config.type === "battlegear") {
        assets.push({card: "img/battlegear.png"});
    }

    if (common_config.type === "attack") {
        assets.push({card: "img/attack.png"});

        if (type_config.fire) {
            assets.push({fireattack: "img/fireattack.png"});
        }
    
        if (type_config.air) {
            assets.push({airattack: "img/airattack.png"});
        }
    
        if (type_config.earth) {
            assets.push({earthattack: "img/earthattack.png"});
        }
    
        if (type_config.water) {
            assets.push({waterattack: "img/waterattack.png"});
        } 
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
    if (type_config.subtype) {
        ctx.font = 'italic 8px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(type_config.subtype, 87, 220)
    }
    if (assets.fireattack) {
        ctx.drawImage(assets.fireattack, 0, 0, assets.fireattack.width, assets.fireattack.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.airattack) {
        ctx.drawImage(assets.airattack, 0, 0, assets.airattack.width, assets.airattack.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.earthattack) {
        ctx.drawImage(assets.earthattack, 0, 0, assets.earthattack.width, assets.earthattack.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.waterattack) {
        ctx.drawImage(assets.waterattack, 0, 0, assets.waterattack.width, assets.waterattack.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.firecreature) {
        ctx.drawImage(assets.firecreature, 0, 0, assets.firecreature.width, assets.firecreature.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.aircreature) {
        ctx.drawImage(assets.aircreature, 0, 0, assets.aircreature.width, assets.aircreature.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.earthcreature) {
        ctx.drawImage(assets.earthcreature, 0, 0, assets.earthcreature.width, assets.earthcreature.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.watercreature) {
        ctx.drawImage(assets.watercreature, 0, 0, assets.watercreature.width, assets.watercreature.height,
            0, 0, canvas.width, canvas.height);
    }
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';
    if (type_config.courage) {
        ctx.fillText(type_config.courage, 33, 232)
        console.log(type_config.courage)
    }   
    if (type_config.power) {
        ctx.fillText(type_config.power, 33, 257)
        console.log(type_config.power)
    }
    if (type_config.wisdom) {
        ctx.fillText(type_config.wisdom, 33, 281)
        console.log(type_config.wisdom)
    }    
    if (type_config.speed) {
        ctx.fillText(type_config.speed, 33, 305)
        console.log(type_config.speed)
    }
}

    /*console.log(type_config.fire)
    console.log(type_config.air)
    console.log(type_config.earth)
    console.log(type_config.water)
    */



/*moved this from index.html attack temporarily. changed it from bp to base id. Gonna try something else for BP
 -Austin  <input type="number" name="base" id="base"></input> */