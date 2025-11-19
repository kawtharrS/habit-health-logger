if (login !== "true") {
    window.location.href = "not-authenticated.html"; 
}

loadAndDrawCharts();
getAdvice();
getRate()

async function loadAndDrawCharts() {
    const { weeklyTopHabitCount, weeklyWeakHabitCount, weeklyEntries } = await getWeeklyHabits();

    if (weeklyEntries.length === 0) {
        console.warn("No weekly data available to draw charts.");
    }

    drawBarChart("#weeklyTopHabitChart", weeklyTopHabitCount, "steelblue");
    drawBarChart("#weeklyWeakHabitChart", weeklyWeakHabitCount, "steelblue");

    const { allTimeTopHabitCount, allTimeWeakHabitCount } = await getAllTimeHabits();

    drawBarChart("#TopHabitChart", allTimeTopHabitCount, "tomato");
    drawBarChart("#WeakHabitChart", allTimeWeakHabitCount, "tomato");
}

function drawBarChart(svgID, obj, color) {
    const svg = d3.select(svgID);

    const data = Object.entries(obj).map(([habit, count]) => ({ habit, count }));

    if (data.length === 0) {
        console.warn(`No data to display for ${svgID}`);
        svg.append("text")
           .attr("x", 50)
           .attr("y", 50)
           .text("No data for this week")
           .style("fill", "gray")
           .style("font-size", "16px");
        return;
    }

    const margin = { top: 40, right: 20, bottom: 60, left: 60 };
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleBand()
        .domain(data.map(d => d.habit))
        .range([0, width])
        .padding(0.4);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count) || 1])
        .nice()
        .range([height, 0]);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    g.selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", d => x(d.habit))
        .attr("y", d => y(d.count))
        .attr("height", d => height - y(d.count))
        .attr("width", x.bandwidth())
        .attr("fill", color);

    g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-22)")
        .style("text-anchor", "end");

    g.append("g").call(d3.axisLeft(y));
}






