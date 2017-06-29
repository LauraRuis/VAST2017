# Technical Report

## Contents
Link | Content
------------ | ------------- 
[dashboard](#dashboardjs) | dashboard.js
[fdgraph](#fdgraphjs) | fdgraph.js
[linechart](#linechartjs) | linechart.js

## dashboard.js
The main file of the product. This file has a window.onload function that reads all jsons per week for the graph and for the parallel coordinates and table recursively. This recursive function loads two different queues in different variables and the calls the function dashboard while passing all the data as parameters. This dashboard function draws the entire dashboard, depending on which hash is passed (currentHash). The hash determines which page the user loads. Home for homepage, pc for parallel coordinates, line for the line chart. The tsne visualization is in a different html with a different main javascript file, since this is written in d3 v3 which causes conflict if put together in one html.

The dashboard function draws all elements depending on the hash. For example if the hash in line, the linechart gets drawn, the table, the graph and the toggle buttons for toggling between car types. Some functions from other files get used in this process. The function for drawing toggles and radio buttons is from helpers.js. This helpers file contains several more used function: highlightRoute, sliderToFilename and dateFromWeeknumber. These get explained later on in this report.

## fdgraph.js
This javascript files draws a force directed graph with d3-force. It contains a function for drawing the graph initially (makeGraph) and one for restarting the graph with new data (restart). Most of the code is used from the d3-force library. The mouseover function highlights all the connected links by looping over all links and highlighting the links if it is either the source or the target of the current node. It sets the opacity of all the other links to 0.1. This function takes into account highlighted routes. If a user has clicked on a row in the table, a route gets highlighted in a green color. When the user hovers over nodes now and the mouse leaves again, this route should be still highlighted. 

It should also be noted that the zoom for this graph is initialized zoomed out (70% of the size). This is also the reason why the legend for size is scaled with factor 0.7. 

The function makeGraph returns all objects necessary in later functions that are called from different javascript files.

The function restart updates the graph and legend. The legend gets updated by inverting the radius to the number of check-ins and updating the labels. 

## linechart.js
This file draws a line chart. It has a function for initializing the line chart (makeLineChart e.g. the axis and scaling), for updating the line chart with new data (updateLines), for updating the focus area that highlights which week the data represents (updateFocus) and a function that adds a node listener to the nodes and adds a change event listener to the toggle buttons (nodeListener). The first two functions are trivial d3 code for making and updating a line chart. The third function, updateFocus, takes a date, calculates the end of the week, sets an area in the line chart for this week and draws a rect with opacity 0.5 showing the user which week his data represents. The function nodeListener adds an event listener to the nodes in the graph that update the line chart on click. It also adds a change listener to the toggle buttons that add or remove lines for different car types on change.

## pc.js
This file contains functions for drawing and updating the parallel coordinates. MakePC initializes the parallel coordinates, drawPC, draws the lines and makes use of groupData, scalePC, radioFunctions and brushFunctions. groupData groups the lines to draw only one line for each variable value pair (see README). It does this by looping over the data and counting occurences, all the while keeping track of the paths per ID. The brushfunctions are seperated because these need to be updated when the PC gets updates with new data and when the PC gets rescaled when a user chooses to remove the outliers. Within the brush functions a special dict gets constructed for inverting ordinal scales, since d3 does not have this functionality. This makes it possible to also brush ordinal dimensions. Function scalePC is trivial, and gets used by drawPC as well as updatePC. radioFunctions adds the functionality of updating the dimensions with outliers with a regular d3 update pattern. updatePC also uses a regular d3 update pattern.

## helpers.js
This function contains all helper functions, all of which are used regularly throughout the dashboard and all of which are trivial, except for highlightRoute. This function contains all listeners used by the datatable. When a user clicks on the details row on the homepage, different events get triggered than when the user does this on the line chart or parallel coordinates page. Depending on whether or not visualizations are available on the page (if the selection of the svg is not undefined) events get attached to different elements. This function relies heavily on classes. When a route in the graph or in the parallel coordinates get highlighted, the get a different class. This class gets used in other mouseover functions in fdgraph.js and pc.js so that these mouseover function do not undo the selections.

## scatterpage.js
This file uses the same way of loading queues as dashboard.js (only with different files). The dashboard function the draws the dashboard for the tsne page. This page contains a table (with the same option to show the route per car ID), a scatterplot explained in scatterplot.js and a dropdown menu. On change of the dropdown menu the scatter gets updated. This javascript file uses functions from scatterplot.js

## scatterplot.js
  This file contains functions for drawing the t-SNE visualization in a scatter plot. The drawScatter function is a trivial function for drawing a scatterplot with d3. The function lassoFunctions sets the functions for using d3-lasso. This is seperated because they need to be updated when the scatterplot gets updated. These lasso functions are also trivial, except for lasso_end, where the functionality is added that when a user selects dots with the lasso, the data of these dots get loaded in the table. This gets done by retrieving the ID's of these dots, getting the data from a json file that contains all variables of all ID's in the entire data set, loading these in an array and filling the table. UpdateScatter uses a regular d3 update pattern on the scatter plot and also updates the data used for the lasso functions. highlighRoute is called when this function is done, because new data has to be loaded in the details section of the table.
