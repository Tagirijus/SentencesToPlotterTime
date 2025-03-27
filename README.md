# Sentences to Plotter Time

I use this plugin to calculate the sentences in the selected text (or the whole document) and calculate it with a config value to output a time calculation. I use it in my story writing calculation, where a plot point, which I write as a sentence, might have a certain average duartion of play time later in the (radio play) project.

## Build
To build this plug, make sure you have [SilverBullet installed with Deno](https://silverbullet.md/Install/Deno). Then, build the plug with:

```shell
deno task build
```

Or to watch for changes and rebuild automatically

```shell
deno task watch
```

Then, copy the resulting `.plug.js` file into your space's `_plug` folder. Or build and copy in one command:

```shell
deno task build && cp *.plug.js /my/space/_plug/
```

SilverBullet will automatically sync and load the new version of the plug, just watch the logs (browser and server) to see when this happens.

## Installation
If you would like to install this plug straight from Github, make sure you have the `.js` file committed to the repo and simply add

```
- github:Tagirijus/SentencesToPlotterTime/sentencestoplottertime.plug.js
```

to your `PLUGS` file, run `Plugs: Update` command and off you go!
