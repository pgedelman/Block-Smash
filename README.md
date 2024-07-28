# Block-Smash

    Block-Smash is a game in which you place provided blocks onto a 10x10 grid, with the goal of occupying a row or column to smash the blocks and increase your score.
It is heavily inspired by games similar to Block Puzzle and the goal with creating Block Smash was to create a project with Javascript, and more importantly provide
a game that could be played with AI. 
    Smash-Bot, the main goal of this project, is the AI that is designed to get very high scores on Block Smash. It was built with a neural network that recieves information from the script running Block Smash, and sends it back after processing the information to interact with the game.

I decided to do this project because I wanted to interact with AI in a meaningful way. When figuring out how I could do that, I decided I would emulate a game I played on my phone. I was inspired by watching Youtube videos of similar projects :::: and decided that I could do something similar. This project allowed me to qualify my knowledge of Javascript and Python, as well as gain a foothold in medium sized projects and neural network development. The specifics on some of what I learned and what I could improve upon are described later in this documentation.


## How it was Made

The game was built using the Javascripts canvas. The two main components are the Grid and the Blocks.

Grid:

    The Grid consists of 100 Tiles and facilitates the main functionality of the game. The main purpose of the tiles is to be occupied by the blocks, meaning that they have the ability to stop blocks from being placed or allow rows and columns to be smashed. When a block is placed the 

 

Move Score Calculation
Minimize Surface Area +
Minimize Areas of 1x1 +
Maximize Areas of 3x3 +
Maximize Score =
Move 

Move consists of the 3 intermediate moves you could take