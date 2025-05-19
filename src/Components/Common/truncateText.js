function truncateText(text, maxLength = 37) {
    if (text.length <= maxLength) return text;

    let truncated = text.slice(0, maxLength + 1); // Take extra character to check next space
    let lastSpace = truncated.lastIndexOf(" ");

    return lastSpace === -1 ? truncated.trim() + "..." : truncated.slice(0, lastSpace) + "...";
}

export default truncateText;