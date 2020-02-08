# CreativeML-Maze-Game

This game allows user to interact and control with various sounds of everyday things.

I have this idea of creating my own little Guitar Hero game. In this project, I am exploring the capabilities of web development and machine learning, and checking how can I implement a solution using the sounds of everyday items.

---

## Instructions

Open the Weki project with Wekinator by double clicking on ```WekinatorProject.wekproj```

*Install Packages*

```npm install```

*Run the Node server*

``` node src/app.js```

*From your browser, go:*

```127.0.0.1:3000```

A guitar sound will let you go right, if you hit a plastic lid with a metal spoon that means going up. Hitting on a metal object with a spoon will suggest going down. You can also whistle to go left!

---

### Wekinator
The Wekinator is free, open-source software created by Rebecca Fiebrink. It allows anyone to use machine learning to build new musical instruments, gestural game controllers, computer vision or computer listening systems, and more.
For more information, visit here: http://www.wekinator.org/

### Sounds
I literally used random sounds and recorded each of them individually for several hundred times.
Things/sounds I used:
* Salt shaker
* Various kinds of IKEA plates, eventually decided on metallic ones
* Ceramic mug
* Plastic blender lid
* Guitar
* Coughing --> I don't recommend this one since you might have a sore throat after a while
* Clapping
* Whistling

![Items](https://i.imgur.com/fUAGfjZ.png)
![Items](https://i.imgur.com/s1ewR3x.jpg)

### Algorithms

I tried a bunch of algorithms to evaluate to sound accuracy. I get the best results with k-Nearest-Neighbour and AdaBoost.
I used three input values to classify the sound. These are:

* Peak frequency (aka pitch)
* Spectral centroid
* RMS

I filtered the OSC data by its RMS value so that I can get the precise vibration of the sound.

The output has four classes, which are primarily up, down, left, right.

![values](https://i.imgur.com/pjbtegH.png)

### Game

The game is developed on p5.js library itself; it receives the input/output values via a WebSocket built with Node.JS. It is also possible to use WASD keys, though I left it for only debugging purposes.

![game-screenshot](https://i.imgur.com/cBSd2hW.png)

### Little demo

![demo](https://media.giphy.com/media/TILT3uJJvLr8tFBf3X/giphy.gif)
