<a id="readme-top"></a>
<br />
<div align="center">
  <a href="https://github.com/pgedelman/Block-Smash">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Block Smash</h3>

  <p align="center">
    A game designed to be played by AI. 
    <br />
    <a href="https://github.com/pgedelman/Block-Smash"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/pgedelman/Block-Smash">Play Game</a>
    ·
    <a href="https://github.com/pgedelman/Block-Smash/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Block Smash is a game in which you place provided blocks onto a 10x10 grid, with the goal of occupying a row or column to smash the blocks and increase your score. It is heavily inspired by games similar to Block Puzzle and the goal with creating Block Smash was to create a project with Javascript that interacts with Python with the explicit goal of a game that could be played by AI. 

Smash-Bot, the main goal of this project, is the AI that is designed to get very high scores on Block Smash. It was built with a neural network that recieves information from the script running Block Smash, and sends it back after processing the information to interact with the game.

I decided to do this project because I wanted to interact with AI in a meaningful way. When figuring out how I could do that, I decided I would emulate a game I played on my phone. I was inspired by watching Youtube videos of similar projects :::: and decided that I could do something similar. This project allowed me to qualify my knowledge of Javascript and Python, as well as gain a foothold in medium sized projects and machine learning.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## How to play

1. Drag any of the blocks from the block bar on the right of the game canvas onto the grid to place it. You won't be able to place it anywhere where it would overlap occupied tiles or fall off the grid.
  
2. Once all the blocks from the block bar are placed, the block bar will refresh with more blocks.

3. If at any point there is a row or column that is completely full, meaning all tiles in that section are occupied, the section will get smashed. When a section gets smashed all tiles within it will return to being empty, available for blocks to occupy them. Smashing will happen all at once so multiple rows and columns can be smashed at the same time!

4. Smashing a section will increase your score, which can be seen on the top left of the screen. Smashing multiple sections in a move will make your score go up even more.
   
5. If there are no possible places you could place a block on the grid, then you lose :( . Your score will be displayed on the screen.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## How to use Smash-Bot

1. To allow the website to use Smash-Bot, hit the "Change to AI" button on the left side of the screen. This will restart the game and allow the AI to recieve information

2. To make the AI start playing the game, hit the "Use AI" button on the left side of the screen. The AI will take a little bit in between moves, especially when there are more options for the AI.

3. When the Smash-Bot loses, it will display its score on the canvas.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)
* ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Neural Network

For the input of the network, I decided that there were four metrics that would determine the best move: minimizing surface area of the blocks, minimizing 1x1  holes, maximizing 3x3 holes, and maximizing the score. To calculate these metrics for each move, I developed a recursive function that would find each possible move and then calculate each metric. Once they were calculated I would send the metrics for each move to the Flask server, where it could be used as input for the network. The network was structured with four input neurons, eight hidden neurons, four more hidden neurons, and then one output neuron. The greatest output between all of the moves would determine which move was the best. 

<div align="center"><img src="https://github.com/user-attachments/assets/bc0c3bfd-7189-4b31-997a-593bdc1293b7"></div>

To train this model, the game was played by the AI 2500 times. It had 50 generations of 50 games, the 10 highest scorers would be mutated and reproduced into the next generation. The highest scoring model across all generations was saved seperately. 

### First Iteration

My initial attempt was to make the input the game state as well as all possible block placements for all possible blocks. The issues with this were that it only processed one block placement at a time instead of all three blocks available to be placed, it required masking impossible placements, and would have had convoluted results due to the gamestate. I quickly realized I should score the possible moves instead.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Paul Edelman - pgedelman@gmail.com

Project Link: [https://github.com/pgedelman/Block-Smash](https://github.com/pgedelman/Block-Smash)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/paul-edelman
[product-screenshot]: images/screenshot.png

[flask-url]: https://flask.palletsprojects.com/en/3.0.x/#
