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
