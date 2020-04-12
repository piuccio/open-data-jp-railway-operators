npx mapshaper -i ~/Downloads/N03-190101_GML/N03-19_190101.shp encoding=932 -dissolve N03_001 -o input/cache/prefectures-only.shp
npx mapshaper -i ~/Downloads/N02-18_GML/N02-18_Station.shp encoding=932 -divide input/cache/prefectures-only.shp -o input/cache/prefectures-stations.shp
npx mapshaper -i input/cache/prefectures-stations.shp -drop fields=N02_001,N02_002 -o input/stations.csv
