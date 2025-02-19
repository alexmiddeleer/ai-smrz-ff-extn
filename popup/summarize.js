console.log('starting up')
if (browser.permissions.contains({ permissions: ['trialML'] })) {
    console.log("correct permissions, proceeding")
} else {
    console.log("missing trialML permissions, aborting!")
    throw ("No trialML permission, please manually grant this permission to the extension")
}
browser.trial.ml.onProgress.addListener(progressData => {
    console.log(progressData);
});


try {
    await browser.trial.ml.createEngine({
        modelHub: "huggingface",
        taskName: "summarization"
        // taskName: "summarization",
        // modelId: "Xenova/distilbart-cnn-6-6"
    });
} catch (error) {
    console.log('Could not create engine, it is probably already created')
    console.log(error)
}

const activeTabId = async () => (await browser.tabs.query({ active: true, currentWindow: true }))[0].id;

console.log(`active tab is ${await activeTabId()}`)

console.log('attempting to execute content script')
let frameId;
try {
    const result = await browser.scripting.executeScript({
        files: ['/content_scripts/extract_text.js'],
        target: {
            tabId: await activeTabId(),
            allFrames: true
        },
    })
    frameId = result[0].frameId;
    console.log(`frameId for script is ${frameId}`)
} catch (error) {
    console.error(`failed to execute script: ${error}`);
}
let text = await browser.tabs.sendMessage((await activeTabId()), {
    command: "tldr_extractText",
});


let result
try {
    console.log('attempting to use generator with the text')
    result = await browser.trial.ml.runEngine({
        args: [text],
    });
    console.log(JSON.stringify(result))
    document.getElementById('popup-content').innerText = result[0].summary_text

} catch (error) {
    document.getElementById('popup-content').innerText = 'There was an error.'
    console.error(`failed to execute generator: ${error}`);
}

console.log(`acquired summary... complete`)