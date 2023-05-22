import "./style.css";

// --- utils ---

const DEG_TO_RAD = Math.PI / 180;

type point = [number, number];

// --- canvas setup ---

const canvases = Array.from(document.querySelectorAll("canvas"));
const contexts = canvases.map((c) => c.getContext("2d")!);

canvases.forEach((canvas) => {
	canvas.width = canvas.height = 600;
});

contexts.forEach((ctx) => {
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
});

const canvas1 = canvases[0];
const [ctx1, ctx2] = contexts;

const center: point = [canvas1.width / 2, canvas1.height / 2];

// --- configuration ---

const r_1 = 200;
const r_2 = 80;
const r_3 = 20;

const scale_speed = 1.0002;

const alpha_1_speed = 0.1;
const alpha_2_speed = -1;
const alpha_3_speed = 10;

let scale = 0.01;
let alpha_1 = 0;
let alpha_2 = 0;
let alpha_3 = 0;

const colors = ["yellow", "orangered", "skyblue", "magenta"];

// --- main loop ---

let previous_points: (point | null)[] = new Array(4).fill(null);

document.addEventListener("DOMContentLoaded", loop);

function loop() {
	ctx1.clearRect(0, 0, canvas1.width, canvas1.height);

	const p_1 = get_point_on_circle(center, scale * r_1, alpha_1);

	draw_line(center, p_1, ctx1);

	for (const step of [0, 1, 2, 3]) {
		const angle = alpha_2 + step * 90;

		const p_2 = get_point_on_circle(p_1, scale * r_2, angle);
		draw_line(p_1, p_2, ctx1);

		const p_3 = get_point_on_circle(p_2, scale * r_3, alpha_3);
		draw_line(p_2, p_3, ctx1);

		if (previous_points[step]) {
			draw_line(
				previous_points[step]!,
				p_3,
				ctx2,
				colors[step],
				scale
			);
		}

		previous_points[step] = p_3;
	}

	alpha_1 += alpha_1_speed;
	alpha_2 += alpha_2_speed;
	alpha_3 += alpha_3_speed;
	scale *= scale_speed;
	requestAnimationFrame(loop);
}

// --- helper functions ---

function draw_line(
	p: point,
	q: point,
	ctx: CanvasRenderingContext2D,
	color: string = "white",
	width: number = 1
) {
	ctx.beginPath();
	ctx.moveTo(...p);
	ctx.lineTo(...q);
	ctx.strokeStyle = color;
	ctx.lineWidth = width;
	ctx.stroke();
	ctx.closePath();
}

function get_point_on_circle(
	p: point,
	r: number,
	angle: number
): point {
	return [
		p[0] + r * Math.cos(angle * DEG_TO_RAD),
		p[1] + r * Math.sin(angle * DEG_TO_RAD),
	];
}

// --- toggle opacity of canvas1 via click ---

document.body.addEventListener("click", () =>
	toggle_opacity(canvas1)
);

function toggle_opacity(element: HTMLElement) {
	element.classList.toggle("opaque");
}
