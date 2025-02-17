# smrz-ff-ext

This is a firefox extension for briefly summarizing a web page. It works offline and sends no personal data to any server, thanks to local copies of onnx runtime and a huggingface summarization onnx model.

To install dependencies:

```bash
bun install
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