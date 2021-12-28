// This is the spacing of a new line
const linespace = 12;

/**
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {string} text Text to draw
 * @param {number} offsetX Offset from left where to begin drawing text
 * @param {number} offsetY Offset from top where to begin drawing text
 * @param {number} maxX Maximum width of the text to be drawn
 * @returns {number} Returns the new Y offset after finished writing text;
 */
export function drawText(ctx, text, offsetX, offsetY, maxX) {
    // preserve user lines
    const sections = text.split(/\r\n|\n|\r/);

    for (const section of sections) {
        // If user inputed a newline without text
        if (section.trim() == '') {
            offsetY += linespace;
            continue;
        }

        const words = section.split(" ");
        let remaining = words.length;

        // Recursive function that draws lines of text
        // If the text is longer than the line, breaks on the next word
        const drawLine = () => {
            let line = words[words.length - remaining];
            let width = ctx.measureText(line).width;

            do {
                remaining--;
                const next_word = words[words.length - remaining];
                const new_width = width + ctx.measureText(next_word).width;
                if (new_width > maxX) {
                    ctx.fillText(line, offsetX, offsetY);
                    offsetY += linespace;
                    return drawLine();
                }
                else {
                    line += ` ${next_word}`;
                    width = new_width;
                }
            } while (remaining > 1);

            ctx.fillText(line, offsetX, offsetY);
            offsetY += linespace;            
        }

        drawLine();

    }

    return offsetY;
}
