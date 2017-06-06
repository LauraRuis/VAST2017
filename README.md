# VAST Challenge 2017, MC 1
This document contains a project proposal for the VAST Challenge 2017, mini challenge 1 (for details, see: http://vacommunity.org/VAST+Challenge+2017+MC1).

## Contents
Link | Content
------------ | ------------- 
[Introduction to problem](#introduction-to-problem) | Introduction to problem, questions to be answered
[Data](#data) | Description of available data
[Proposed approach](#proposed-approach) | Approach to solving the problem
[Related visualizations](#related-visualiations) | list of related visualizations and implementations
[Minimum Viable Product](#minimum-viable-product) | MVP

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
This project will consist of a partial solving of this problem and should solve the problem together with the projects of two project-partners. 

### Graph representation of map
One of the important issues in this challenge is the mapping of the nature preserve, which could be very well represented in a graph structure. The nodes of this graph would be the sensors, or gates. The edges would be the possible roadways between these gates. The size of the nodes would represent the amount of passing traffic (total number of entire dataset) and the color of the node would represent the gate type (e.g. entrances would be green, ranger stops would be yellow). Furthermore, the edge thickness would represent the amount of traffic that traveled over this road (total number). 

### Barchart per gate
When clicking on a node in the graph (that represents a gate), a barchart will appear. This barchart contains information about the number of vehicles passing through that gate over time. A number of vehicles on a day (or other amount of time) will be represented by a single bar. The color of the bar will represent the car type, and it will be a stacked bar chart. Per car type that is selected the amount of cars will be stacked on top of each other. 

### ..

## Related visualizations


## Minimum Viable Product
