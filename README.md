# smrz-ff-ext

This is a firefox extension for briefly summarizing a web page. It works offline and sends no personal data to any server, thanks to local copies of onnx runtime and a huggingface summarization onnx model.

To install dependencies:

```bash
bun install
curl -o ./content_scripts/ort-wasm-simd-threaded.jsep.wasm https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0/dist/ort-wasm-simd-threaded.jsep.wasm
```

You will also need to manually include a summarization model and put it in the `content_scripts` dir. I was able to do this by copying the model out of my local huggingface cache after running a test script (trying running `node console.js` to force this to happen. It doesn't work with `bun`, as of today at least).

At the end you should have a `content_scripts` directory like this

```
content_scripts/
   Xenova/distilbart-cnn-6-6/onnx
   ort-wasm-simd-threaded.jsep.wasp.js
```

To build
```bash
bun run build
```

or

```bash
bun run build:watch
```

Then open Firefox, go to about:debugging#/runtime/this-firefox and click Load Temporary Add-on and select the `manifest.json` in this directory.