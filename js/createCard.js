let common_config = {};
let type_config = {};

// Creates the canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Placeholder cardback to show that canvas has been drawn
// This function runs when page is initially loaded
(() => {
    const cardback = new Image();
    cardback.onload = (() => {
        ctx.drawImage(cardback, 0, 0, cardback.width, cardback.height,
            0, 0, canvas.width, canvas.height);
    });
    cardback.src = "img/cardback.png";
})();

// Access the name for download
export function getName() {
    return common_config.name || "myImage.jpg";
}

// Allows external functions to update common config
export function updateCommonConfig(key, value) {
    common_config[key] = value;
}

// This function gathers the form data, loads the assets, and then draws the card
export async function createCard() {

    // Resets the canvas to prepare for redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gathers the form data and puts them into config
    const common_data = new FormData(document.getElementById('common-form'));
    for (const [key, value] of common_data.entries()) {
        common_config[key] = value;
    }

    // Resets card type specific properties between redraws
    // to prevent old data from persisting after form changes
    type_config= {};

    const type_data = new FormData(document.getElementById('type-form'));
    for (const [key, value] of type_data.entries()) {
        type_config[key] = value;
    }

    // Loads all the required images
    const assets = await loadAssets();

    // After images are loaded, you can draw the card 
    drawCard(assets);

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
    }

    return assets;
}

const formatTextWrap = (text, maxLineLength) => {
    // const words = text.replace(/[\r\n]+/g, ' ').split(' ');
    console.log('in: ' + text)
    const words = text.split(' ');
    let lineLength = 0;
    
    // use functional reduce, instead of for loop 
    return words.reduce((result, word) => {
      if (lineLength + word.length >= maxLineLength) {
        lineLength = word.length;
        return result + `\n${word}`; // don't add spaces upfront
      } else {
        lineLength += word.length + (result ? 1 : 0);
        return result ? result + ` ${word}` : `${word}`; // add space only when needed
      }
    }, '');
}

function resetDropShadow() {
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "black";
}

/* This function draws the card layer by layer, specify where images/text is drawn */
function drawCard(assets) {
    resetDropShadow();

    // Eventually we'll need to differentiate between location orientation, but save that for later
    // Because it requires changing the canvas dimensions among other things

    /* Draws the parts of the cards that are common between everything besides locations */

    if (assets.art) {
        ctx.drawImage(assets.art, 0, 0, assets.art.width, assets.art.height,
            10.26, 25.3, 228.94, 191.9);
    }
    if (assets.card) {
        ctx.drawImage(assets.card, 0, 0, assets.card.width, assets.card.height,
            0, 0, canvas.width, canvas.height);
    }
    if (assets.symbol) {
        ctx.drawImage(assets.symbol, 0, 0, assets.symbol.width, assets.symbol.height,
            0, 0, canvas.width, canvas.height);
    }

    // Name and subname
    if (common_config.name && common_config.subname) { 
        ctx.font = '11px Eurostile-BoldExtendedTwo';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 1;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = "black"
        ctx.fillText(common_config.name, canvas.width/2 , 19)
        ctx.font = '7px Eurostile-BoldExtendedTwo';
        ctx.fillText(common_config.subname, canvas.width/2 , 28)
    } else if (common_config.name) {  // just name
        ctx.font = '11px Eurostile-BoldExtendedTwo';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowBlur = 1;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = "black"
        ctx.fillText(common_config.name, canvas.width/2 , 23)
    }

    /* Ability */
    if (common_config.ability) {
        resetDropShadow();
        
        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        let abilityWrapped = formatTextWrap(common_config.ability,34).split("\n")
        if (abilityWrapped.length > 7) {
            abilityWrapped.length = 7;
        }
        for (var idx = 0; idx < abilityWrapped.length; idx++) {
            ctx.fillText(abilityWrapped[idx], 45, 234+idx*12); 
        }

        console.log(common_config.ability);
        console.log(abilityWrapped);
    }   

    if (common_config.type == "attack") {
        drawAttack(assets);
    } 
    else if (common_config.type == "battlegear") {
        drawBattlegear(assets);
    }
    else if (common_config.type == "creature") {
        drawCreature(assets);
    }

}

/* Artist */
function artistLine(offsetX, offsetY) {
    resetDropShadow();
    ctx.font = 'bold 8px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';  

    if (common_config.artist) {
        ctx.fillText('Art:' + common_config.artist, offsetX, offsetY);
    }
}

/* Type Line */
function typeLine(type, offsetX, offsetY) {
    ctx.font = 'italic 7px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.shadowBlur = .5;
    ctx.shadowOffsetX = .5;
    ctx.shadowOffsetY = .5;
    ctx.shadowColor = "black";

    if (common_config.past || common_config.subtype || type_config.tribe) {
        type += " -";
    }
    if (common_config.past) {
        type += " Past";
    }
    if (type_config.tribe) {
        type += (() => {
            switch (type_config.tribe.toLowerCase()) {
                case "danian": return " Danian";
                case "overworld": return " OverWorld";
                case "mipedian": return " Mipedian";
                case "underworld": return "UnderWorld";
                case "m'arrillian": return "M'arrillian";
                default: return "";
            }
        })();
    }
    if (common_config.subtype) {
        type += ` ${common_config.subtype}`
    }

    console.log(type);
    
    ctx.fillText(type, offsetX, offsetY);
}

function drawAttack(assets) {
    resetDropShadow();

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

    
    /* Build Points */
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';

    if (type_config.bp) {
        ctx.fillText(type_config.bp, 20, 25);    
    }

    /* Element damage values */
    ctx.font = 'bold 14px Eurostile black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';

    if (type_config.firedamage) {
        ctx.fillText(type_config.firedamage, 91, 242)
    }

    if (type_config.airdamage) {
        ctx.fillText(type_config.airdamage, 133, 242)
    }    

    if (type_config.earthdamage) {
        ctx.fillText(type_config.earthdamage, 175, 242)
    }

    if (type_config.waterdamage) {
        ctx.fillText(type_config.waterdamage, 217, 242)
    }

    /* Base Damage */
    ctx.font = 'bold 26px Eurostile black extended';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';

    if (type_config.basedamage) {
        ctx.fillText(type_config.basedamage, 39, 247)
    }

    artistLine(60, 333);

    typeLine("Attack", 19, 220);
}

function drawBattlegear(assets) {
    artistLine(60, 333);

    typeLine("Battlegear", 19, 220);
}

function drawCreature(assets) {
    resetDropShadow();

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

    /* Mugic Ability */
    ctx.font = 'bold 14px Eurostile-BoldExtendedTwo';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';

    if (type_config.mugic) {
        ctx.fillText(type_config.mugic, 16, 333);
    }

    /* Energy */
    ctx.font = '19px Arial black';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    
    if (type_config.energy) {
        ctx.fillText(type_config.energy, 216, 336);
    }

    /* Disciplines */
    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'right';

    if (type_config.courage) {
        ctx.fillText(type_config.courage, 33, 232);
    }   
    if (type_config.power) {
        ctx.fillText(type_config.power, 33, 257);
    }
    if (type_config.wisdom) {
        ctx.fillText(type_config.wisdom, 33, 281);
    }
    if (type_config.speed) {
        ctx.fillText(type_config.speed, 33, 305);
    }

    artistLine(47, 332);

    typeLine("Creature", 40, 219);
}
