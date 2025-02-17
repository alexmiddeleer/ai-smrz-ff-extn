import { pipeline } from '@huggingface/transformers';
import { env } from '@huggingface/transformers';

env.allowRemoteModels = false;
env.allowLocalModels = true;
env.localModelPath = '/content_scripts/';
env.backends.onnx.wasm.wasmPaths = '/content_scripts/';

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

console.log(`and the result is ${JSON.stringify(text)}`)
const generator = await pipeline('summarization');

//     console.log(`acquired pipeline... complete`)

// text = 'The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, ' +
//     'and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. ' +
//     'During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest ' +
//     'man-made structure in the world, a title it held for 41 years until the Chrysler Building in New ' +
//     'York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to ' +
//     'the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the ' +
//     'Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second ' +
//     'tallest free-standing structure in France after the Millau Viaduct.';

let result
try {
    console.log('attempting to use generator with the text')
    result = await generator(text, {
        max_new_tokens: 400,
    });
    console.log(JSON.stringify(result))
    document.getElementById('popup-content').innerText = result[0].summary_text

} catch (error) {
    document.getElementById('popup-content').innerText = 'There was an error.'
    console.error(`failed to execute generator: ${error}`);
}

console.log(`acquired summary... complete`)

// })
// .catch(e => {
//     console.error(e)
//     debugger;
// });