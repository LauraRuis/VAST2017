# VAST Challenge 2017, MC 1
This document contains a project proposal for the VAST Challenge 2017, mini challenge 1 (for details, see: http://vacommunity.org/VAST+Challenge+2017+MC1).

## Contents
Link | Content
------------ | ------------- 
[Introduction to problem](#introduction-to-problem) | Introduction to problem, questions to be answered
[Data](#data) | Description of available data, features to be extracted
[Proposed approach](#proposed-approach) | Approach to solving the problem, three different visualizations, limitations and problems
[Related visualizations](#related-visualizations) | List of related visualizations and implementations
[Minimum Viable Product](#minimum-viable-product) | Minimum requirements for viable product

## Introduction to problem
Analyzing traffic movement in a nature preserve for a ornithologist that needs to examine the reason for a decline in nesting of a certain bird that has its habitat in the preserve. In summary, the questions to be answered are the following (for the full questions, again see: http://vacommunity.org/VAST+Challenge+2017+MC1):
1. Describe up to six daily patterns of life by vehicles traveling through and within the park (kind of vehicles, spatial activities, temporal activities). Please limit your answer to six images and 500 words.
2. Describe up to six patterns of life that occur over multiple days by vehicles traveling through and within the park. Please limit your answer to six images and 500 words.
3. Describe up to six unusual patterns and highlight why you find them unusual. Please limit your answer to six images and 500 words.
4. What are the top 3 patterns you discovered that you suspect could be most impactful to bird life in the nature preserve?

## Data
The data is delivered by the VAST Challenge in a .csv file. It contains data from sensors around the nature preserve. A map with the locations of roadways and sensors is also supplied. The data in the .csv file specifies per row:
- timestamp
- car ID (unique per vehicle)
- car type
- sensor that measured the data
Possible features to solve the problem to get from this data are:
- Time spent by cars in the preserve (per ID, per car type)
- Busy locations (sensors) over time
- Travel speed of cars (per ID, per car type)
- Type of cars at locations / over time
- etc.
These features should be extracted through data analysis, since the variables are not yet. 

## Proposed approach
This project will consist of a partial solving of this problem and should solve the problem together with the projects of two project-partners (Sven van Dam en Peter van Twuijver). 

In this proposed approach three visualizations with several interactive elements will be proposed. These should together solve part of the problem. It should be noted that the choices of visualizations could change at any time during the project. Before starting the visualization process, we will do some data analytics and explore the data. Based on insights we get from this we might decide on different visualizations than proposed here. 

### Graph representation of map
One of the important issues in this challenge is the mapping of the nature preserve, which could be very well represented in a graph structure. The nodes of this graph would be the sensors, or gates. The edges would be the possible roadways between these gates. The size of the nodes would represent the amount of passing traffic (total number of entire dataset) and the color of the node would represent the gate type (e.g. entrances would be green, ranger stops would be yellow). Furthermore, the edge thickness would represent the amount of traffic that traveled over this road (total number). This should immediately show possible paths between gates and also which paths are frequently traveled (busy). 

### Barchart per gate
When clicking on a node in the graph (that represents a gate), a barchart will appear. This barchart contains information about the number of vehicles passing through that gate over time. A number of vehicles on a day (or other amount of time) will be represented by a single bar. The color of the bar will represent the car type, and it will be a stacked bar chart. Per car type that is selected the amount of cars will be stacked on top of each other. This should show how many and what kind of vehicles show up at certain gates.

### Sankey diagram for daily paths per car type
A possibility for showing the paths certain car types travel would be a sankey diagram. The first and last column of this diagram would contain the five possible entrances (exits) and between these a number of columns all containing every possible gate (except for the entrances). A line will start at an entrance and move through the columns through gates. The point of this visualization would be showing patterns of paths vehicle take. The possible problems with this visualization would be deciding to take daily data or 'entrace-to-entrace' data. In the latter the time period would not be specified, and in the daily data it is very possible that certain lines would not go from entrance to entrance, and thus only travel part of the sankey diagram. Another decision to be made in this visualization would be to take either different colored lines per car type of only 1 car type per sankey diagram. The final problem would be how to link this diagram with the bar chart and the graph visualization. 

## Related visualizations
This section contains some examples on related visualization. These show entirely different data but are visualized in a similar way. 

### Related graph
At the following link an example of a graph is shown: https://bl.ocks.org/mbostock/4062045. The graph in this project would not be draggable like this one, but the user would be able to click on nodes that represent certain gates and move to the stacked bar chart. 

### Related stacked bar chart
At the following link an example of a stacked bar chart is shown: https://bl.ocks.org/mbostock/1134768. The stacked bar chart from this project could be implemented in the same way. It would have to add the interactive features of selecting one or more car types. 

### Related sankey diagram
At the following link an example of a sankey diagram is shown: https://bl.ocks.org/jasondavies/1341281. The difference being the possible colored lines per car type, where this example had only one color line (blue). Another difference would be that the first column and last will have a different amount of ticks on the axis than the axis in the columns between these. This example has the interactive possibility to highligt certain ticks. This would also be a good idea for this project. The user could click on one of the entrances and highlight all paths from this entrance. 

## Minimum Viable Product
All three visualizations should be present for this product to be viable. The implementation of the sankey diagram should be decided upon and per visualization different interactivity could be implemented. For the product to be viable, several html elements should be added as well. One could be the menu for selecting car types for the bar chart. Another could be a dropdown menu for choosing car types in the sankey diagram, or a slider to move through time in the graph visualization. These decisions should be made after the initial insights from the data are gathered. 
