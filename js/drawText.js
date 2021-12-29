export function parseLine(ctx, text, maxWidth) {
    // These are all the lines that will be drawn;
    const lines = [];
    const icons = [];

    // If user inputed a newline without text
    if (text.trim() == '') {
        return { lines, icons };
    }

    const words = text.split(" ");
    let remaining = words.length;

    // Recursive function that draws lines of text
    // If the text is longer than the line, breaks on the next word
    const drawLine = () => {
        let line = words[words.length - remaining];
        let width = ctx.measureText(line).width;

        while (--remaining > 0) {
            const next_word = ` ${words[words.length - remaining]}`;
            const new_width = width + ctx.measureText(next_word).width;
            if (new_width > maxWidth) {
                lines.push(line);
                return drawLine();
            }
            else {
                line += next_word;
                width = new_width;
            }
        }

        lines.push(line);
    }

    drawLine();

    return { lines, icons };
}

/**
 * @param {CanvasRenderingContext2D} ctx The canvas context
 * @param {string} text Text to draw
 * @param {number} maxWidth Maximum width of the text to be drawn
 * @returns { [{lines: string[], icons: *[]}] } Returns the lines and icons of the drawn text area
 */
export function parseTextArea(ctx, text, maxWidth) {
    const sections = [];

    // preserve user lines
    const paragraphs = text.split(/\r\n|\n|\r/);
    for (const i in paragraphs) {
        sections.push(parseLine(ctx, paragraphs[i], maxWidth))
    }

    return sections;
}
