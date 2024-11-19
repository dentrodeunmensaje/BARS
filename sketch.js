let freqs = [261, 293, 329, 349, 392, 440, 523, 587];
let numLines = 8;
let colors = [];
let oscillators = [];
let reverb;
let delay;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);

  // Initialize neon colors for each line
  for (let i = 0; i < numLines; i++) {
    let hue = (360 / numLines) * i;
    colors.push(color(hue, 100, 100));
  }

  // Initialize oscillators for each line
  for (let i = 0; i < numLines; i++) {
    let osc = new p5.Oscillator('sine');
    osc.freq(freqs[i]);
    osc.amp(0);
    osc.start();
    oscillators.push(osc);
  }

  // Create reverb and delay effects
  reverb = new p5.Reverb();
  delay = new p5.Delay();

  // Process oscillators through effects
  for (let i = 0; i < oscillators.length; i++) {
    oscillators[i].disconnect(); // Disconnect from master output
    reverb.process(oscillators[i], 6, 4); // reverbTime, decayRate
    delay.process(oscillators[i], 0.4, 0.7, 2300); // delayTime, feedback, filter frequency
  }

  // Set dry/wet mix for effects
  reverb.drywet(0.7);
  delay.drywet(0.7);

  //background(0);
  
}

function draw() {
  // Create visual delay effect
  noStroke();
  colorMode(RGB)
  fill(0,30);
  rect(0, 0, width, height);
  colorMode(HSB, 360, 100, 100);

  let lineHeight = height / numLines;
  let time = millis() / 1000; // Current time in seconds

  // Calculate synthesizer amplitude based on mouse X position
  let synthAmplitude = constrain(mouseX / width, 0, 1);

  for (let i = 0; i < numLines; i++) {
    let y = lineHeight * (i + 0.5);
    let distance = abs(mouseY - y);
    let proximity = max(0, 1 - distance / (lineHeight / 2));

    // Combined amplitude based on mouse X and Y positions
    let amplitude = synthAmplitude * proximity;

    // Set oscillator amplitude based on combined amplitude
    oscillators[i].amp(amplitude, 0.1);

    // Set stroke color and weight
    stroke(colors[i]);
    strokeWeight(45); // Lines are wider
    noFill();

    if (proximity > 0) {
      // Draw vibrating line as a sine wave matching the frequency
      beginShape();
      let waveAmplitude = 480 * amplitude; // Amplitude of the visual wave proportional to synth amplitude
      let baseFrequency = 261; // Base frequency (C4)
      let baseNumCycles = 2;   // Base number of cycles to display
      let numCycles = (freqs[i] / baseFrequency) * baseNumCycles;
      let phase = time * TWO_PI * numCycles; // Phase shift for animation
      for (let x = 0; x <= width; x += 5) {
        let angle = (x / width) * TWO_PI * numCycles + phase;
        let sinY = y + waveAmplitude * sin(angle);
        vertex(x, sinY);
      }
      endShape();
    } else {
      // Draw static line
      line(0, y, width, y);
    }
  }
  //filter(BLUR);
}

function mousePressed() {
  // Resume audio context after user interaction
  userStartAudio();
}


