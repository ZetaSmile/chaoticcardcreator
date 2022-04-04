import { parseTextArea, parseLine } from './parseTextArea.js';
import { loadAssets } from './gatherAssets.js';

let common_config = {};
let type_config = {};

/** Create the Canvas
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Placeholder cardback to show that canvas has been drawn
// This function runs when page is initially loaded
(() => {
    const cardback = new Image();
    cardback.onload = (() => {
        ctx.drawImage(cardback, 
            0, 0, cardback.width, cardback.height,
            0, 0, canvas.width, canvas.height
        );
    });
    cardback.src = "img/cardback.png";
})();

// Converts the Canvas into a image data stream 
// and sets the specified element to be a downloadable image
export function setDownload(el) {
    const image = canvas.toDataURL("image/jpg");
    el.download = common_config.name || "myImage.jpg";
    el.href = image;
}

// Allows external functions to update common config
export function updateCommonConfig(key, value) {
    common_config[key] = value;
}

// This function gathers the form data, loads the assets, and then draws the card
export async function createCard() {
    // Rest the old checkboxes values
    (["unique", "legendary", "loyal"]).forEach((value) => {
        delete common_config[value];
    });

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
    const assets = await loadAssets(common_config, type_config);

    // After images are loaded, you can draw the card 
    drawCard(assets);

    return Promise.resolve();
}


function resetDropShadow() {
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = "black";
}


/***
* The following functions should be modified in accordance to the forms data
**/

/* This function draws the card layer by layer, specify where images/text is drawn */
function drawCard(assets) {
    // Resets the canvas to prepare for redraw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    resetDropShadow();

    // Eventually we'll need to differentiate between location orientation, but save that for later
    // Because it requires changing the canvas dimensions among other things

    if (common_config.type == "location") {
        canvas.width = 350;
        canvas.height = 250;

        // TODO figure out these values
        if (assets.art) {
            ctx.drawImage(assets.art,
                0, 0, assets.art.width, assets.art.height,
                10.26, 25.3, 191.9, 228.94
            );
        }

        if (assets.template) {
            ctx.drawImage(assets.template,
                0, 0, assets.template.width, assets.template.height,
                0, 0, canvas.width, canvas.height
            );
        }

        // TODO figure out these values
        // Real todo is upload proper icons not this full size hack
        if (assets.symbol) {
            ctx.drawImage(assets.symbol,
                228, 21, assets.symbol.width - 31, 447,
                162, 8, canvas.width, canvas.height
            );
        }

    } else {
        canvas.width = 250;
        canvas.height = 350;

        /* Draws the parts of the cards that are common between everything besides locations */

        if (assets.art) {
            if (common_config.type == "mugic") {
                // TODO full image art for mugic
            } else {
                ctx.drawImage(assets.art, 
                    0, 0, assets.art.width, assets.art.height,
                    10.26, 25.3, 228.94, 191.9
                );
            }
        }

        if (assets.template) {
            ctx.drawImage(assets.template,
                0, 0, assets.template.width, assets.template.height,
                0, 0, canvas.width, canvas.height
            );
        }
        if (assets.symbol) {
            ctx.drawImage(assets.symbol,
                0, 0, assets.symbol.width, assets.symbol.height,
                0, 0, canvas.width, canvas.height
            );
        }
    }

    // Name and subname
    if (common_config.name) {
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.shadowBlur = .8;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = "dim-grey";
    
        if (common_config.subname) {
            ctx.font = '12px Eurostile-BoldExtendedTwo';
            ctx.fillText(common_config.name, canvas.width/2 , 18);
            ctx.font = '7px Eurostile-BoldExtendedTwo';
            ctx.fillText(common_config.subname, canvas.width/2 , 27);
        } else {
            ctx.font = '12px Eurostile-BoldExtendedTwo';
            ctx.fillText(common_config.name, canvas.width/2 , 23);
        }
    }

    switch (common_config.type) {
        case 'attack':
            drawAttack(assets);
            break;
        case 'battlegear':
            drawBattlegear(assets);
            break;
        case 'creature':
            drawCreature(assets);
            break;
        case 'location':
            drawLocation(assets);
    }

}

// This is the spacing of a new line
const linespace = 10;

/** Ability 
 * @param {*} assets The list of drawable image assets
 * @param {number} offsetX Offset from left where to begin drawing text
 * @param {number} offsetY Offset from top where to begin drawing text
 * @param {number} maxX Maximum width of the text area
 * @param {number} maxY Maximum height of text area
 * */ 
function drawTextArea(assets, offsetX, offsetY, maxX, maxY) {
    resetDropShadow();
     
    // This variable storess where the text was drawn in the text area, so that text doesn't overlap 
    // When using the drawText for card text area, update this value 
    let flavorHeight = 0;
    let sections = [];
    let ull = "";

    ctx.textBaseline = "top";

    if (common_config.flavor) {
        ctx.font = 'italic 9px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';

        const { lines } = parseTextArea(ctx, common_config.flavor, maxX, false)
            .reduce((p, c) => ({ lines: [...p.lines, ...c.lines] }));

        // Flavor text gets drawn at the bottom of the card
        // Take the height of the text area and subtract the number of lines from the bottom
        flavorHeight = ((lines.length) * linespace);

        const flavorTop = (offsetY + maxY) - flavorHeight;
        lines.forEach((line, i) => {
            ctx.fillText(line, offsetX, flavorTop + (i * linespace));
        });
    }

    if (common_config.unique || common_config.loyal || common_config.legendary) {
        const { unique, loyal, legendary, loyal_restrict } = common_config;
        
        if (legendary) {
            ull = "Legendary";
            if (loyal) {
                ull += ", ";
            }
        }
        else if (unique) {
            ull = "Unique";
            if (loyal) {
                ull += ", ";
            }
        }

        if (loyal) {
            ull += "Loyal";
            if (loyal_restrict) {
                ull += ` - ${loyal_restrict}`;
            }
        }
    }

    if (common_config.ability) {
        ctx.font = 'bold 10px Arial';
        sections = parseTextArea(ctx, common_config.ability, maxX);
    }
    
    // Sections include unique/loyal/legendary line
    if (sections.length > 0 || ull != "") {
        let textSpace = 0;
        if (ull != "") {
            // This +2 here and when its drawn is because the font is larger
            // You can remove these if you want less linespace for unique/loyal
            // textSpace += linespace + 2;
            textSpace += linespace + 2;
        }
        if (sections.length > 0) {
            sections.forEach(({ lines }) => {
                textSpace += linespace * lines.length;
            });
        }

        const total_sections = sections.length + (ull != "" ? 1 : 0);
        let space = (((maxY - flavorHeight) - textSpace) / ( 1 + total_sections)); 
        if (space < 0) space = 0;

        ctx.font = 'bold 10px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';

        let nextOffset = drawIconText(assets, sections, offsetX, offsetY, space);

        ctx.font = 'bold 11px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';

        if (ull != "") {
            nextOffset += space;
            // nextOffset -= 2;
            ctx.fillText(ull, offsetX, nextOffset);
        }
    }

    ctx.textBaseline = "alphabetic";
}

function drawIconText (assets, sections, offsetX, offsetY, space = 0) {
    let nextOffset = offsetY;

    sections.forEach(({ lines, icons }) => {
        // console.log(icons, lines);
        nextOffset += space;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            let _icons = icons.filter(icon => (icon.line === i));
            if (line == "" && _icons.length == 0) continue;
            if (line != "") {
                ctx.fillText(line, offsetX, nextOffset);
            }
            if (_icons.length != 0) {
                icons.forEach((icon) => {
                    // console.log(icon);
                    if (Object.prototype.hasOwnProperty.call(assets, icon.icon)) {
                        const asset = assets[icon.icon];
                        ctx.drawImage(asset, 
                            0, 0, asset.width, asset.height,
                            offsetX + icon.offset, nextOffset - 1, 12, 12
                        );
                    }
                });
            }
            nextOffset += linespace;
        }
    });

    return nextOffset;
}

/* Artist */
function artistLine(offsetX, offsetY) {
    if (common_config.artist) {
        resetDropShadow();
        ctx.font = 'bold 8px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';  

        ctx.fillText('Art:' + common_config.artist, offsetX, offsetY);
    }
}

/* Type Line */
function typeLine(type, offsetX, offsetY) {
    ctx.font = 'italic 7.5px Eurostile-Bold';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.shadowBlur = .1;
    ctx.shadowOffsetX = .5;
    ctx.shadowOffsetY = .5;
    ctx.shadowColor = "dim-grey";

    const tribe = (() => {
        if (!type_config.tribe) return "";
        switch (type_config.tribe.toLowerCase()) {
            case "danian": return " Danian";
            case "overworld": return " OverWorld";
            case "mipedian": return " Mipedian";
            case "underworld": return "UnderWorld";
            case "m'arrillian": return "M'arrillian";
            default: return "";
        }
    })();

    if (common_config.past || common_config.subtype || tribe) {
        type += " -";
    }
    if (common_config.past) {
        type += " Past";
    }
    if (tribe) {
        type += tribe;
    }
    if (common_config.subtype) {
        type += ` ${common_config.subtype}`;
    }
    
    ctx.fillText(type, offsetX, offsetY);
}

function drawAttack(assets) {
    resetDropShadow();

    if (assets.fireattack) {
        ctx.drawImage(assets.fireattack, 
            0, 0, assets.fireattack.width, assets.fireattack.height,
            0, 0, canvas.width, canvas.height
        );
    }
    if (assets.airattack) {
        ctx.drawImage(assets.airattack, 
            0, 0, assets.airattack.width, assets.airattack.height,
            0, 0, canvas.width, canvas.height
        );
    }
    if (assets.earthattack) {
        ctx.drawImage(assets.earthattack, 
            0, 0, assets.earthattack.width, assets.earthattack.height,
            0, 0, canvas.width, canvas.height
        );
    }
    if (assets.waterattack) {
        ctx.drawImage(assets.waterattack, 
            0, 0, assets.waterattack.width, assets.waterattack.height,
            -1, -1, canvas.width, canvas.height
        );
    }

    /* Build Points */
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';

    if (type_config.bp) {
        ctx.fillText(type_config.bp, 20, 25);    
    }

    /* Element damage values */
    ctx.font = 'bold 10px Eurostile-BoldExtendedTwo';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';


    if (type_config.firedamage) {
        ctx.fillText(type_config.firedamage, 96, 242);
    }

    if (type_config.airdamage) {
        ctx.fillText(type_config.airdamage, 139, 242);
    }    

    if (type_config.earthdamage) {
        ctx.fillText(type_config.earthdamage, 181, 242);
    }

    if (type_config.waterdamage) {
        ctx.fillText(type_config.waterdamage, 224, 242);
    }

    /* Base Damage */
    ctx.font = 'bold 22px Eurostile-BoldExtendedTwo';
    
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';

    if (type_config.basedamage) {
        ctx.fillText(type_config.basedamage, 39, 247);
    }

    drawTextArea(assets, 20, 252, 219, 64);
    // drawTextArea(assets, parseInt(common_config.offsetx), parseInt(common_config.offsety),parseInt(common_config.maxx),parseInt(common_config.maxy));


    artistLine(60, 333);

    typeLine("Attack", 19, 220);
}

function drawBattlegear(assets) {
    drawTextArea(assets, 21.2, 234, 234.4 - 21.2, 313 - 234);

    artistLine(60, 333);

    typeLine("Battlegear", 19, 220);
}

function drawCreature(assets) {
    resetDropShadow();

    if (assets.firecreature) {
        ctx.drawImage(assets.firecreature, 
            0, 0, assets.firecreature.width, assets.firecreature.height,
            0, 0, canvas.width, canvas.height
        );
    }
    if (assets.aircreature) {
        ctx.drawImage(assets.aircreature,
            0, 0, assets.aircreature.width, assets.aircreature.height,
            0, 0, canvas.width, canvas.height
        );
    }
    if (assets.earthcreature) {
        ctx.drawImage(assets.earthcreature,
            0, 0, assets.earthcreature.width, assets.earthcreature.height,
            0, 0, canvas.width, canvas.height
        );
    }
    if (assets.watercreature) {
        ctx.drawImage(assets.watercreature,
            0, 0, assets.watercreature.width, assets.watercreature.height,
            0, 0, canvas.width, canvas.height
        );
    }

    /* Mugic Ability */
    ctx.font = 'Bold 17px Eurostile-Bold';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';

    if (type_config.mugic) {
        ctx.fillText(type_config.mugic, 18, 333);
    }

    /* Energy */
    ctx.font = 'Bold 19px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    
    if (type_config.energy) {
        ctx.fillText(type_config.energy, 216, 336);
    }

    /* Disciplines */
    ctx.font = 'Bold 10px Arial';
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
    // console.log(common_config.offsetx);
    // console.log(common_config.offsety);
    // console.log(common_config.maxx);
    // console.log(common_config.maxy);

    //drawTextArea(assets, parseInt(common_config.offsetx), parseInt(common_config.offsety),parseInt(common_config.maxx),parseInt(common_config.maxy));
    drawTextArea(assets, 45, 221, 172, 89);

    artistLine(47, 332);

    typeLine("Creature", 45, 219);
}

function drawLocation(assets) {
    resetDropShadow();

    // TODO figure out these values

    ctx.font = 'bold 10px Arial';
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'left';

    // Inititive
    ctx.fillText("Inititive: ", 50, 200);
    const section = parseLine(ctx, type_config.initiative, 280);
    drawIconText(assets, [section], 100, 200);

    // Ability
    drawTextArea(assets, 60, 120, 100, 200);

    // TODO have to rethink artist line because is drawn horizontally.....
    // artistLine(47, 230);

    typeLine("Location", 23, 200);
}