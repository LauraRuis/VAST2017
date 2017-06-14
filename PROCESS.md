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

