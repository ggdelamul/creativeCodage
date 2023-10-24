const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const math = require("canvas-sketch-util/math");
const settings = {
  dimensions: [1080, 1080],
  animate: true,
};
//animation avec la fonciton animationrequest frame cf doc pour faire ca sans canvas-sketch
// const animate = () => {
//   console.log("Animate");
//   requestAnimationFrame(animate);
// };
// animate();
const sketch = ({ context, width, height }) => {
  const agents = [];
  for (let i = 0; i < 40; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x, y));
  }
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    // const agentA = new Agent(400, 800);
    // const agentB = new Agent(300, 700);
    // agentA.draw(context);
    // agentB.draw(context);
    //dessin des lignes /////
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];
        const dist = agent.pos.getDistance(other.pos);
        if (dist > 200) continue; //ignore la suite de la boucle for
        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }
    //dessin des cercle dans le canvas //////
    agents.forEach((agent) => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};
canvasSketch(sketch, settings);

///////////////////classes///////////////////////////////
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x; //distance sur le plan des absicce
    const dy = this.y - v.y; //distance sur le plan des ordonnée
    return Math.sqrt(dx * dx + dy * dy);
  }
}
class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(4, 12);
  }

  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    context.lineWidth = 4;
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.vel.x *= -1;
    }
    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.vel.y *= -1;
    }
  }
}
