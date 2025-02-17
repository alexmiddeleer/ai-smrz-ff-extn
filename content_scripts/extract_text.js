(() => {
    // console.log('initializing tldr content script')

    /**
     * Given a URL to a beast image, remove all existing beasts, then
     * create and style an IMG node pointing to
     * that image, then insert the node into the document.
     */
    function extractUniqueText() {
        let seenText = new Set();
        let extractedText = [];

        function isVisible(el) {
            const style = window.getComputedStyle(el);
            return !(style.display === "none" || style.visibility === "hidden" || style.opacity === "0");
        }

        function getTextFromNode(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = node.nodeValue.trim();
                if (text && !seenText.has(text)) {
                    seenText.add(text);
                    extractedText.push(text);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE && isVisible(node)) {
                for (let child of node.childNodes) {
                    getTextFromNode(child);
                }
            }
        }

        getTextFromNode(document.body);
        return extractedText.join(" ");
    }

    /**
     * Listen for messages from the background script.
     * Call "insertBeast()" or "removeExistingBeasts()".
     */
    browser.runtime.onMessage.addListener((message) => {
        if (message.command === "tldr_extractText") {
            // console.log(`received message ${JSON.stringify(message)}`)
            const result = extractUniqueText();
            // console.log(`returning ${result.substring(0, Math.min(result.length - 1, 50))}...`)
            return Promise.resolve(result);
        }
    });
})();
