[![egghead-logo](https://raw.githubusercontent.com/eggheadio/egghead-brand/master/Egghead-Logo-Dark.png)](https://egghead.io/)

# egghead RSS downlaoder
A simple script to download egghead videos for personal offline usage.

## Installing / Getting started
Install the dependencies:
```shell
npm i
```
Run the script with the link to the RSS feed as first argument:
```shell
node ./egghead-rss-downlader.js "https://egghead.io/courses/..."
```
This will generate a folder with the course name with an info file and the lessen videos inside.


### Built With
- rss-parser v3.1.x