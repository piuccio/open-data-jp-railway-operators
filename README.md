## List of Railway operators in Japan

The list is extracted from the [National Land numerical information (railway data), Ministry of Land, Infrastructure, Transport and Tourism](http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N02-v2_3.html).

English names are taken from Wikipedia.

### Usage

Just grab the file `operators.json` it has a list of objects with the structure

```json
{
  "name": {
    "ja": "Name of the company in Japanese",
    "en": " Name of the company in English"
  },
  "railways": [
    {
      "ja": "Name of the railway in Japanese",
      "en": "Name of the railway in English",
      "prefectures": ["List of prefectures served by this railway"]
    }
  ]
}
```

### Building locally

Download the Shapefile from the website above, extract the zip file and run:

```
npx mapshaper -i ~/Downloads/N02-18_GML/N02-18_Station.shp encoding=932 -o cut-table input/operators.json
rm input/operators.json
```

This will leave only the table with all attributes.

From the same website download the Shapefile for the [prefectures](http://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-v2_3.html) and run:

```
node input/prefectures.sh
```

This will link stations to prefectures.

Finally run:

```
node index.js
```

Generates the output file from the input attributes table.

## Related links

More [open data repositories](https://github.com/piuccio?utf8=%E2%9C%93&tab=repositories&q=open-data-jp&type=&language=).
