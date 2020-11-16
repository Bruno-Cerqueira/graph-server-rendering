module.export = function drawSeparateLine(svgChartsRoot) {
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

		svgChartsRoot
			.append("line")
			.attr("x1", 0)
			.attr("y1", i * height + PRECISION_5)
			.attr("x2", widthWithPrecision5X)
			.attr("y2", i * height + PRECISION_5)
			.attr("class", "graph-separate-line")
	}
};
