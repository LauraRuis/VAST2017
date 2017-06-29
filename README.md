# Link to final version
https://lauraruis.github.io/VAST2017/js/dashboard.html#home

# VAST Challenge 2017, MC 1 dashboard

## Contents
Link | Content
------------ | ------------- 
[Product](#product) | Product
[External Elements](#external-elements) | External elements

## Product
This section contains screenshots of the product with a short functional description.

### Homepage
![Homepage](https://github.com/LauraRuis/VAST2017/blob/master/Doc/homepage.png)
At the home page the user sees immediately that the graph represents the map of the Lekagul Preserve park, with the nodes representing the gates and the links the roadways between these gates. The slider in the sidebar on the left can be used to update the graph node size according to number of check-ins at that gate per week. The data in the table below gets updated as well. The user can click on the details column in the table to show the route of a car ID. This route gets highlighted in the graph as well. This functionality of the table stays available in the entire product. When hovering over nodes in the graph the user can see all routes that lead to this node (or gate).

### Line Chart
![Line](https://github.com/LauraRuis/VAST2017/blob/master/Doc/line%20page.png)
This page lets the user click on the nodes (gates) in the graph, and shows the number of unique cars passing through this gate each day throughout the year. The line chart can show the total number of cars, but also the number of cars per car-type. This can be changed with the toggle buttons above the line chart. The same functionality in the table and the slider as on the homepage remains on this page. A new functionality is that when the user slides the slider, the line chart shows which week the data represents.

### Parallel Coordinates
![PC](https://github.com/LauraRuis/VAST2017/blob/master/Doc/pc%20page.png)
This page shows the different variables per car ID in a parallel coordinates diagram. This is data per week, and the parallel coordinates also updates with the slider. The user can choose to view the PC with, or without outliers through the radio buttons above the visualization. The user can also brush on each dimension of the parallel coordinates. By clicking an axis and dragging, the lines that have the selected variables get highlighted. The user can also click on these lines. When doing this, the data from that line gets loaded into the table. This is because the parallel coordinates shows grouped lines. When multiple car ID's have for example car-type 2 and 6 number of stops, this line only gets drawn once, and the more ID's have this pair of variables, the darker blue this line is colored. When the user clicks on the details column of the table, now not only the route gets highlighted in the graph, but also in the parallel coordinates.

### t-SNE Visualization
![t-SNE](https://github.com/LauraRuis/VAST2017/blob/master/Doc/tsne%20page.png)
This visualization shows a t-SNE plot for each month of the data (sometimes 2 or 3 weeks instead of a month, specified in the dropwdown menu). The user can select a month in the dropdown and the t-SNE gets drawn. It has no axes, since x and y coordinates do not have an interpretation in a t-SNE visualization. The user can select dots with a lasso function, and the selected dots get loaded in the table. This way it is possible to explore ID's that have the same variables, or are similar according to the t-SNE method. 

## External elements
### External code
- d3 v3
- d3 v4
- d3-legend
- Bootstrap 
- d3-scale-chromatic
- d3-lasso
- d3-queue
- DataTables
- w3.css Analytics template

### External data
- VAST MC1 data
- .jpg image of preserve by VAST

*Publiced open source under Unilicense*
