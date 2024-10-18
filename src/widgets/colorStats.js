//import * as d3 from "d3";

class ColorStats {

    constructor(data) {
        this.data = data;
    }

    buildStats(element) {
        const width = 200;
        const height = 200;
        const radius = Math.min(width, height) / 2;

        // Определите соответствие цвета и его названия
        const color = d3.scaleOrdinal()
            .domain(this.data.map(d => d.color))
            .range([
                '#808080',  // Gray
                '#FAEBD7', // White
                '#0000FF', // Blue
                '#228B22', // Green
                '#B22222', // Red
                '#000000' // Black
            ]);

        const pie = d3.pie()
            .value(d => d.count)
            .sort(null);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        
        const label = document.createElement('label');
        label.textContent = "Deck Mana Color Distribution";
        label.classList.add("colorLabel");
        element.appendChild(label);

        const svg = d3.select(element)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const arcs = svg.selectAll("arc")
            .data(pie(this.data))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.color));
    }
}

export { ColorStats };
