# Day 1
Started with meeting with project partners Sven and Peter and with Gosia to discuss the VAST Challenge and the approach we will take to solving the problem. 

Decided that two things have to be tackled before starting on answering the questions:
1. Exploring the data with simple plots
2. Reading in the map of the nature preserve

When this is done we can all start on our own part of the project. I will focus on a graph visualization and two related visualizations.

Also wrote proposal today in README.md.

**Summary of day 1**
- Started on decision process on how to tackle challenge
- Divided work to be done
- Decided on stand-up meetings with Gosia every monday, tuesday and wednesday.

**Related images day 1**
![Decisions day 1](https://github.com/LauraRuis/VAST2017/blob/master/Process/decisions_day_1.jpg)

# Day 2
Started with stand-up meeting, discussed proposals. Decided to do some data analysis today.

Made several python files for converting the sensor data to jsons with different formats. Also made some python files for calculating some variables from this json files. Calculated busyness on total preserve per day (number of unique vehicles totally and split up per car type), but also per gate (.json file with data per gate and .csv with busyness per gate; total 80 data files)

**Summary of day 2**
- data analysis of busyness per day per gate and totally

# Day 3
Started with stand-up meeting, discussed yesterdays work and decided to move forward with data analysis.

Made design.md file and learned about how to implement a force directed graph in D3. Started on formatting the data from the bitmap of the nature preserve to a .json file that can be used for the force directed graph. 

Made JSON file for force directed graph and made beta version of graph (even though bitmap is not correctly read yet). Nodes colored according to gate type and edges are roadways.

**Summary of day 3**
- further data analysis
- created design.md
- started on force directed graph

# Day 4
Gave presentation on progress. 

Decided on further design choices. Made questions.md in shared github with question we would like answered from the data. Made list of variables I will extract from data. Also decided I will try some initial clustering visualizations on the data.
With the list of variables I will make a parallel coordinates graph to see some groups.

**Summary of day 4**
- Summarised questions to answer
- Started on parallel coordinates

# Day 5
Discussed some problems at stand-up. Talked about ways to represent data in csv files. Talked about the possibility to link all of our graphs at the end of the project. Decided to try and do this in the last week. 

Made some new variables from data and converted parallel coordinates graph from d3 v4 to d3 v3. Got a working version now, but too much data so viz is too slow. Thought of a way to speed this up, will implement tomorrow.

Also made csv file per day per gate.

Made to do list with features to finish before end of project (see process folder)

**Summary of day 5**
- Decided to try to link all of our visualizations in the last week
- Converted parallel coordinates from v4 to v3
- made features list (see process folder)

# Day 6
Stand-up meeting discussed timeline. Goal is to finish working prototypes at the end of this or beginning of next week. Discussed possible links between our visualizations (with date's as only data possibly). Decided on goal to be finished by the end of the third week so the last week is reserved for filming and analysis of the visualizations for answering the answersheet of the challenge.

Fixed parallel coordinates: made grouped lines (not one line per id but one line per combination), made brushes possible.
Also made some new tsv files (41) for data per minute.

**Summary of day 6**
- Fixed parallel coordinates
- Made tsv files

# Day 7
Discussed all three of our alpha versions that should be finished by friday. Discussed some problems we encountered. Decided what we will try and finish today.

Made two last visualizations: table and line chart. Also made some new python scripts for getting aggregated data files. Line chart and table functionally work, tomorrow will try to make functions of all visualizations and load them into another html file to show them all on one page.

**Summary day 7**
- Made table
- Made linechart
- Made some data files

# Day 8
Discussed some new problems at stand-up meeting. Decided to start with putting all my visualizations in a function and add them on one dashboard.

Put all 4 visualizations in functions and loaded in a new html as libraries, made new javascript file to make the total dashboard. Table, Line chart and graph work and are visable together on a page. Parallel Coordinates is written in d3 v3, so does not work yet. Need to find solution for this.

Added interactivity between graph nodes and line chart.

**Summary day 8**
- Merged visualizations on a page
- Encountered problem of using d3 v3 and v4 together
- Interactivity graph - line chart

# Day 9
Worked on highlighting route in graph on click of row in table. Works now, but buggy. Also need to add some sort of tooltip showing the time of arrival at that node in the graph. 

Decided on a plan for using the parallel coordinates visualization: let user decide if he wants graph or pc as center visualization, remove line chart if pc is chosen and make graph smaller to focus on pc. Before working on this I need to know how to use d3 v3 and v4 together.

Did presentation.

**Summary day 9**
- Highlight route on click
- Presentation

# Day 10
Sick

# Day 11
Still sick

# Day 12
Stand-up meeting discussed answering questions of VAST Challenge. Discussed 6 daily patterns (found 2 so far), 6 multiple day patterns (found more than 6), discussed unusual patterns (found 3). 

Tried to merge v3 and v4 of d3 together, does not work. Decided to maybe make two websites, one with v3 and one with v4.
Made csv files of data of all types of gates together.
Found a way to use d3 v3 and v4 together and made switch button for switching between two main visualizations (force directed graph as main and parallel coordinates as main on the other page).
Put everything in a bootstrap css template. 
Added final functionality of highlighting ID in parallel coordinates.

**Summary day 12**
- Started answering challenge questions
- Merged v3 and v4
- Connected all visualizations
- Put everything in bootstrap template

# Day 13
Stand-up meeting discussed usage of same template for all of our projects which will be nice for the movie. Also discussed some problems in implementing the bootstrap css template.

Tried to change initial zoom of force directed graph, but cannot get it right for now. Maybe need d3-zoom.
Cleaned template html file and fixed scroll bugs.
Cleaned some code in fdgraph.js

**Summary day 13**
- Finished putting everything in bootstrap template
- Finished beta version
- Started on code cleaning
