export const canvas = document.querySelector<HTMLCanvasElement>("canvas")!;

const context = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;
