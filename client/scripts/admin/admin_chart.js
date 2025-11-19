if (login !== "true") {
    window.location.href = "not-authenticated.html"; 
}

loadAndDrawCharts();

async function loadAndDrawCharts() {
    const { allTimeTopHabitCount, allTimeWeakHabitCount } = await getAllTimeHabitsAll();
    drawBarChart("#TopHabitChart", allTimeTopHabitCount, "tomato");
    drawBarChart("#WeakHabitChart", allTimeWeakHabitCount, "tomato");
}

function drawBarChart(svgID, dataObj, color) {
    const svg = d3.select(svgID);
    const data = Object.entries(dataObj).map(([habit, count]) => ({ habit, count }));

    if (data.length === 0) {
        svg.append("text")
            .attr("x", 50)
            .attr("y", 50)
            .text("No data to display");
        return;
    }

    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .domain(data.map(d => d.habit))
        .range([0, chartWidth])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([chartHeight, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.habit))
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth())
        .attr("height", d => chartHeight - y(d.count))
        .attr("fill", color);

    g.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

    g.append("g").call(d3.axisLeft(y));
}





