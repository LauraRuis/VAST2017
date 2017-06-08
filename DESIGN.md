# Design File
This project will have a drill-down story. It will attempt to guide the user through the traffic data of the nature preserve to let the user find answers on why the Rose-crested Pipit is breeding less. At this stage of the project it is not clear what kind of visualizations will be used to this end, but for now this document will describe the design and user interface of some proposed visualizations.

## Summary of product design
When the user first opens the website, he will see a map of the nature preserve, with all the gates and roads between the gates. The user has the option to start an animation that shows either a heatmap of sound or of speeding cars over time (this depends on further data analysis). The user will also have the option to see a graph of the preserve. This graph will try show the average busyness of the entire park at a glance. The user then gets the option to click on nodes (gates) or edges (roadways). Depending on the type of gate, a barchart or a calender view will show up. These will show the busyness over time. Further drill-down options will be decided upon after further data analysis.

## Sketches of visualizations
- map
![Map](https://github.com/SvenvDam/programmeerproject/blob/master/doc/map.JPG)
- heatmap
![Heatmap](https://github.com/SvenvDam/programmeerproject/blob/master/doc/heatmap.JPG)
- calender view
See website for beta version of visualization: https://pvtwuyver.github.io/vast2017/calendar.html
- graph
![Graph](https://github.com/LauraRuis/VAST2017/blob/master/Doc/Graph.jpeg)
- barchart
![Stacked Bar Chart](https://github.com/LauraRuis/VAST2017/blob/master/Doc/Stacked%20Bar%20Chart.jpeg)

## List of data sources
- Lekagul Sensor Data (.csv file)
- Lekagul Roadways (BMP File)
- Lekagul Preserve Description (word file)
- Lekagul Roadways labeled (JPG File)
- Data Descriptions for MC1 (word file)
All data available at http://vacommunity.org/VAST+Challenge+2017+MC1.

## List of frameworks that provide functionality
- D3
- Bootstrap
- ...
