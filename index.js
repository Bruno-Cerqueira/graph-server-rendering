var fs = require('fs');
var d3 = require('d3');
var JSDOM = require('jsdom').JSDOM;
var path = require('path');

var mainCss = fs.readFileSync(path.normalize(__dirname + "/index.css"), 'utf8');

const TOTAL_TIME = 2.8 // seconds
const MV_BY_5MM = 0.5 // 5 mm = 0.5 mV
const PRECISION_5 = 18
const PRECISION_1 = PRECISION_5 / 5
const TIME_BY_5MM = 0.2 // seconds
// Area stage
const width = (TOTAL_TIME / TIME_BY_5MM) * PRECISION_5
const height = PRECISION_5 * 9
const COLUMNS = 4
const ROWS = 4
const WIDTH_ALL_GRAPHS = width * COLUMNS + PRECISION_5 * 2
const HEIGHT_ALL_GRAPHS = height * ROWS + PRECISION_5 * 2
// Strokes
const STROKE_5 = 0.4
const STROKE_1 = 0.2

var outputLocation = 'test.svg';
		

const {document} = (new JSDOM('<!doctype html><html><body></body></html>')).window;  
global.document = document;  
global.window = document.defaultView;
var head = document.getElementsByTagName('head')[0];
style = document.createElement("style");
style.type = 'text/css';
style.innerHTML = mainCss;
head.appendChild(style);

window.d3 = d3.select(window.document);
const selector = 'body';

function createSvgChart(selector) {
	return window.d3.select(selector)
		.append('div').attr('class', 'container') //make a container div to ease the saving process
		.append("svg")
		.attr("class", "graph")
		.style("background-color", 'white')
		.attr("id", selector.replace("#", "") + "-svg")
		.attr("width", WIDTH_ALL_GRAPHS)
		.attr("height", HEIGHT_ALL_GRAPHS)
		.append('g')
}

const svgChartsRoo = createSvgChart(selector)
drawSeparateLine(svgChartsRoo);
drawGrids(svgChartsRoo);

fs.writeFileSync(outputLocation, window.d3.select('.container').html()) //using sync to keep the code simple


function drawSeparateLine(svgChartsRoot) {
	const heightWithPrecision5YBorders = height * 4 + PRECISION_5 + PRECISION_5
	const heightWithPrecision5Y = height * 3 + PRECISION_5
	const widthWithPrecision5X = width * 4 + PRECISION_5 + PRECISION_5

	for (let i = 0; i <= 4; i++) {
		const heightSpace =
			i === 0 || i === 4
				? heightWithPrecision5YBorders
				: heightWithPrecision5Y

		svgChartsRoot
			.append("line")
			.attr("x1", i * width + PRECISION_5)
			.attr("y1", 0)
			.attr("x2", i * width + PRECISION_5)
			.attr("y2", heightSpace)
			.attr("class", "graph-separate-line")
			.attr("stroke-width", 1)
			.attr('stroke', '#f81d59');

		svgChartsRoot
			.append("line")
			.attr("x1", 0)
			.attr("y1", i * height + PRECISION_5)
			.attr("x2", widthWithPrecision5X)
			.attr("y2", i * height + PRECISION_5)
			.attr("class", "graph-separate-line")
			.attr("stroke-width", 1)
			.attr('stroke', '#f81d59');
	}
};

function drawGrids(svgChartsRoot) {
	const gridXGroup = svgChartsRoot.append("g")
	const gridYGroup = svgChartsRoot.append("g")
	const columns = getQuantityOfColumns()
	const rows = getQuantityOfRows()

	for (let row = 0; row <= rows * 5; row++) {
		const stroke = row % 5 === 0 || row === 0 ? STROKE_5 : STROKE_1
		drawGridXLine(gridXGroup, row, stroke)
	}

	for (let col = 0; col <= columns * 5; col++) {
		const stroke = col % 5 === 0 || col === 0 ? STROKE_5 : STROKE_1
		drawGridYLine(gridYGroup, col, stroke)
	}
}

function getQuantityOfColumns() { return Math.ceil(TOTAL_TIME / TIME_BY_5MM) * 4;}
function getQuantityOfRows() { return (height / PRECISION_5) * 4;}

function drawGridXLine(gridXGroup, row, borderWidth) {
	const leftMargin = borderWidth === STROKE_5 ? 6 : 11
	const rightMargin =
		borderWidth === STROKE_5 ? PRECISION_5 * 2 - 6 : PRECISION_5 * 2 - 11

	gridXGroup
		.append("line")
		.attr("x1", leftMargin)
		.attr("y1", row * PRECISION_1)
		.attr("x2", width * 4 + rightMargin)
		.attr("y2", row * PRECISION_1)
		.attr("class", "graph-grid")
		.attr("stroke-width", borderWidth)
		.attr('stroke', '#f81d59')
		.attr("transform", `translate(0, ${PRECISION_5})`)
}

function drawGridYLine(gridYGroup, col, borderWidth) {
	const topMargin = borderWidth === STROKE_5 ? 6 : 11
	const bottomMargin =
		borderWidth === STROKE_5 ? PRECISION_5 * 2 - 6 : PRECISION_5 * 2 - 11

	gridYGroup
		.append("line")
		.attr("x1", col * PRECISION_1)
		.attr("y1", topMargin)
		.attr("x2", col * PRECISION_1)
		.attr("y2", height * 4 + bottomMargin)
		.attr("class", "graph-grid")
		.attr("stroke-width", borderWidth)
		.attr('stroke', '#f81d59')
		.attr("transform", `translate(${PRECISION_5}, 0)`)
}