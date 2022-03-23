const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];
let adjustX = 0;
let adjustY = 0;

const mouse = {
  x: undefined,
  y: undefined,
  radius: 70
}

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

ctx.fillStyle = 'white';
ctx.font = '25px Verdana';
ctx.fillText('Code', 45, 45);
const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = 'white';
    this.activeColor = 'rgba(143, 44, 44, 0.2)';
    this.initialColor = 'white';
    this.distanceToMouse = undefined;
    this.size = 3;
    this.baseX = this.x;
    this.baseY = this.y;
    this.density = (Math.random() * 20);
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update() {
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    this.distanceToMouse = Math.sqrt(dx * dx + dy * dy);
    let forceDirectionX = dx / this.distanceToMouse;
    let forceDirectionY = dy / this.distanceToMouse;
    let maxDistance = mouse.radius;
    let force = (maxDistance - this.distanceToMouse) / maxDistance;
    let directionX = forceDirectionX * force * this.density;
    let directionY = forceDirectionY * force * this.density;

    if (this.distanceToMouse < mouse.radius) {
      this.x -= directionX;
      this.y -= directionY;
      this.color = this.activeColor;
    } else {
      if (this.x !== this.baseX) {
        let dx = this.x - this.baseX;
        this.x -= dx / 10;
      }
      if (this.y !== this.baseY) {
        let dy = this.y - this.baseY;
        this.y -= dy / 10;
      }
      this.color = this.initialColor;
    }
  }
}

function init() {
  particlesArray.array = 0;
  for (let y = 0; y < textCoordinates.height; y++) {
    for (let x = 0; x < textCoordinates.width; x++) {
      if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
        let positionX = x + adjustX;
        let positionY = y + adjustY;
        let distance = 10;
        particlesArray.push (new Particle(positionX * distance, positionY * distance));
      }
    }
  }
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(particle => {
    particle.draw();
    particle.update();
  });
  connect();
  requestAnimationFrame(animate);
}
animate();

function connect() {
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let dx = particlesArray[a].x - particlesArray[b].x;
      let dy = particlesArray[a].y - particlesArray[b].y;

      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 18) {
        opacityValue = 1 - (distance / 50);

        if (particlesArray[a].distanceToMouse < mouse.radius) {
          ctx.strokeStyle = particlesArray[a].activeColor;
        } else {
          ctx.strokeStyle = particlesArray[a].initialColor;
        }

        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}
