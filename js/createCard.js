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
    
    if (common_config.set) {
        assets.push({symbol: `img/set/${common_config.set}${common_config.rarity}.png`});
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

        if (type_config.firedamage) {
            assets.push({fireattack: "img/fireattack.png"});
        }
    
        if (type_config.airdamage) {
            assets.push({airattack: "img/airattack.png"});
        }
    
        if (type_config.earthdamage) {
            assets.push({earthattack: "img/earthattack.png"});
        }
    
        if (type_config.waterdamage) {
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
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "black"
    if (assets.art) {
        ctx.drawImage(assets.art, 0, 0, assets.art.width, assets.art.height,
            10, 20, canvas.width - 10, canvas.height - 100);
    }
    if (assets.card) {
        ctx.drawImage(assets.card, 0, 0, assets.card.width, assets.card.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.symbol) {
        ctx.drawImage(assets.symbol, 0, 0, assets.symbol.width, assets.symbol.height,
            0, 0, canvas.width, canvas.height);
    }
    if (common_config.ability) {
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(common_config.ability, 45, 234)
        console.log(common_config.ability)
    }   
    if (common_config.type === "attack" && type_config.bp) {
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000000';
        ctx.fillText(type_config.bp, 20, 25)
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
    if (type_config.mugic) {
        ctx.font = 'bold 19px eurostile black condensed';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.fillText(type_config.mugic, 19, 334)
    }
    if (type_config.energy) {
        ctx.font = 'bold 19px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText(type_config.energy, 215, 336)
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
    ctx.font = 'bold 26px eurostile black extended';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';

    if (common_config.type === "attack" && type_config.basedamage) {
        ctx.fillText(type_config.basedamage, 39, 247)
        console.log(type_config.basedamage)
    }

    ctx.font = 'bold 14px eurostile black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';  
    if (type_config.firedamage) {
        ctx.fillText(type_config.firedamage, 91, 242)
    }
    if (type_config.airdamage) {
        ctx.fillText(type_config.airdamage, 133, 242)
        console.log(type_config.airdamage)
    }    
    if (type_config.earthdamage) {
        ctx.fillText(type_config.earthdamage, 175, 242)
    }
    if (type_config.waterdamage) {
        ctx.fillText(type_config.waterdamage, 217, 242)
    }
    ctx.font = 'bold 8px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';  
    if (common_config.artist) {
        if (common_config.type == "battlegear") {
            ctx.fillText('Art:' + common_config.artist, 60, 333)
        } 
        else if (common_config.type == "attack") {
            ctx.fillText('Art:' + common_config.artist, 60, 333)
        } 
        else if (common_config.type == "creature") {
            ctx.fillText('Art:' + common_config.artist, 47, 332)
        }
    }
    if (common_config.name && common_config.subname) {  // has name and subname
        ctx.font = '15.5px Eurostile-BoldExtendedTwo';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowBlur = .7;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = "black"
        ctx.fillText(common_config.name, canvas.width/2 , 19)
        ctx.font = '10px Eurostile-BoldExtendedTwo';
        ctx.fillText(common_config.subname, canvas.width/2 , 28)
    } else if (common_config.name) {  // just name
        ctx.font = '19.275px Eurostile-BoldExtendedTwo';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowBlur = .7;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = "black"
        ctx.fillText(common_config.name, canvas.width/2 , 23)
    }
    ctx.font = 'italic 7px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.shadowBlur = .5;
    ctx.shadowOffsetX = .5;
    ctx.shadowOffsetY = .5;
    ctx.shadowColor = "black";
    if (common_config.type == "creature") {
        if (common_config.subtype) {
            ctx.fillText('Creature - ' + common_config.subtype, 48, 219)
            console.log(common_config.subtype)
        } else {
            ctx.fillText('Creature', 48, 219)
            console.log(common_config.subtype)
        }
    }
    if (common_config.type == "battlegear") {
        if (common_config.subtype) {
            ctx.fillText('Battlegear - ' + common_config.subtype, 19, 220)
            console.log(common_config.subtype)
        } else {
            ctx.fillText('Battlegear', 19, 220)
            console.log(common_config.subtype)
        }
    }
    if (common_config.type == "attack") {
        if (common_config.subtype) {
            ctx.fillText('Attack -' + common_config.subtype, 19, 220)
            console.log(common_config.subtype)
        } else {
            ctx.fillText('Attack', 19, 220)
            console.log(common_config.subtype)
        }
    }
}

    /*console.log(type_config.fire)
    console.log(type_config.air)
    console.log(type_config.earth)
    console.log(type_config.water)
    */



/*moved this from index.html attack temporarily. changed it from bp to base id. Gonna try something else for BP
 -Austin  <input type="number" name="base" id="base"></input> */
