# LINK TO BETA VERSION
https://lauraruis.github.io/VAST2017/Scripts/template.html

# VAST Challenge 2017, MC 1
This document contains a project proposal for the VAST Challenge 2017, mini challenge 1 (for details, see: http://vacommunity.org/VAST+Challenge+2017+MC1).

## Contents
Link | Content
------------ | ------------- 
[Product summary](#product-summary) | Summary of goals of this project
[Introduction to problem](#introduction-to-problem) | Introduction to problem, questions to be answered
[Data](#data) | Description of available data, features to be extracted
[Proposed approach](#proposed-approach) | Approach to solving the problem, three different visualizations, limitations and problems
[List of necessary external components](#external-components) | List of libraries and programs that will be used
[Related visualizations](#related-visualizations) | List of related visualizations and implementations
[Minimum Viable Product](#minimum-viable-product) | Minimum requirements for viable product

## Product summary
This product will consist of the combined work of three students. My part will be focused on a graph that represents the map of a nature preserve and a sankey diagram that represents daily travels of vehicles. For drilling down purposes the nodes of the graph will be clickable and a more detailed visualization will show up. Some insights I hope to show with these visualizations will be the frequently traveled paths by different car types and daily occuring patterns. The total product will aim to answer all questions asked by the VAST Challenge 2017 as specified in the introduction of the problem (see [introduction to problem](#introduction-to-problem)). 

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
- gate name (sensor that measured the data)

Possible features to solve the problem to get from this data are:
- Time spent by cars in the preserve (per ID, per car type)
- Busy locations (sensors) over time
- Travel speed of cars (per ID, per car type)
- Type of cars at locations / over time
- etc.

These features should be extracted through data analysis, since these variables are not immediately shown in the data set. Depending on the visualization and the format it requires, several different .csv files will be composed. This way the calculations can be done in python and the .csv files can be composed. The visualizations made with D3 in javascript will only use the final formatted .csv files.

## Proposed approach
This project will consist of a partial solving of this problem and should solve the problem together with the projects of two project-partners (Sven van Dam and Peter van Twuijver). 

In this proposed approach three visualizations with several interactive elements will be proposed. These should together solve part of the problem. It should be noted that the choices of visualizations could change at any time during the project. Before starting the visualization process, we will do some data analytics and explore the data. Based on insights we get from this we might decide on different visualizations than proposed here.

### Graph representation of map
One of the important issues in this challenge is the mapping of the nature preserve, which could be very well represented in a graph structure. The nodes of this graph would be the sensors, or gates. The edges would be the possible roadways between these gates. The size of the nodes would represent the amount of passing traffic (total number of entire dataset) and the color of the node would represent the gate type (e.g. entrances would be green, ranger stops would be yellow). Furthermore, the edge thickness would represent the amount of traffic that traveled over this road (total number). This should immediately show possible paths between gates and also which paths are frequently traveled (busy). When one clicks a node, the check-ins per day of that gate will show up in the line chart.

### Linechart per gate
When clicking on a node in the graph (that represents a gate), a line will appear in the linechart. This chart contains information about the number of vehicles passing through that gate over time. A user can select one or more car types. Per car type that is selected the amount of cars will be shown by a different line. This should show how many and what kind of vehicles show up at certain gates. A problem with this visualization could be that in this way it is not possible to compare the data of different gates directly. Nevertheless, it might still proof useful.

### Parallel Coordinates diagram for daily paths per car type
A possibility for showing clusters will be a parallel coordinates graph. Each column will represent a different variable that. Per car-id, all the variables that car-id has will be linked. This way it will be possible to show similarities between certain variables. Also, the user will be able to choose between some dummy variables. When clicking on for example the "weekend dummy" the car-id's that spent the weekend in the preserve will get a different color than those who did not spend the weekend.

### Tables
A table will show all the values of the variables of all the car-id's. Each row will be clickable, and the route that car-id took will be shown in the graph.

### Sketch of this proposal
![Prototype Sketch](https://github.com/LauraRuis/VAST2017/blob/master/Process/prototype_sketch.jpeg)

## External components
For this project two programming languages will be used: python and javascript.
In python several yet to be determined libraries will be used, in javascript D3 will definitely be used.

For now, the list of necessary external components is the following:
- Python
- Javascript
- D3
- Bootstrap 
- DataTables

This list will be expanded during the project.

## Related visualizations
This section contains some examples of related visualization. These show entirely different data but are visualized in a similar way. 

### Related graph
At the following link an example of a graph is shown: https://bl.ocks.org/mbostock/4062045. The graph in this project would not be draggable like this one, but the user would be able to click on nodes that represent certain gates and move to the stacked bar chart. 

### Related stacked bar chart
At the following link an example of a stacked bar chart is shown: https://bl.ocks.org/mbostock/1134768. The stacked bar chart from this project could be implemented in the same way. It would have to add the interactive features of selecting one or more car types. 

### Related sankey diagram
At the following link an example of a sankey diagram is shown: https://bl.ocks.org/jasondavies/1341281. The difference being the possible colored lines per car type, where this example had only one color line (blue). Another difference would be that the first column and last will have a different amount of ticks on the axis than the axis in the columns between these. This example has the interactive possibility to highligt certain ticks. This would also be a good idea for this project. The user could click on one of the entrances and highlight all paths from this entrance. 

## Minimum Viable Product
All three visualizations should be present for this product to be viable. The implementation of the sankey diagram should be decided upon and per visualization different interactivity could be implemented. For the product to be viable, several html elements should be added as well. One could be the menu for selecting car types for the bar chart. Another could be a dropdown menu for choosing car types in the sankey diagram, or a slider to move through time in the graph visualization. These decisions should be made after the initial insights from the data are gathered. 
