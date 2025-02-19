# smrz-ff-ext

This is a firefox extension for briefly summarizing a web page. It works offline and sends no personal data to any server, thanks to Firefox's [experimental huggingface integration](https://firefox-source-docs.mozilla.org/toolkit/components/ml/extensions.html).

To install dependencies:

```bash
bun install
```

To build
```bash
bun run build
```
or autobuild

```bash
bun run build:watch
```

Then open Firefox, go to about:debugging#/runtime/this-firefox and click Load Temporary Add-on and select the `manifest.json` in this directory. You will also need to view the addon, click manage, go to permissions, and grant the ML permisisons. See https://stackoverflow.com/a/79447270/752916. I may fix this in a future version by adding a button in the popup to request permissions.