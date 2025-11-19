
async function getTopHabit()
{
    console.log("hi");
    try{
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        console.log(response);
        const entries = response.data.data;
        console.log(entries);

        const topHabitCount={};

        entries.forEach(entry => {
            const habit = entry.top_habit;
            if(habit)
            {
                if(!topHabitCount[habit])
                {
                    topHabitCount[habit]=0;
                }
                topHabitCount[habit]++;
            }
        });
        console.log(topHabitCount);
        return topHabitCount;

    }
    catch(error)
    {
        console.log(error);
    }
}

async function getWeakestHabit()
{
    try{
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        console.log(response);
        const entries = response.data.data;
        console.log(entries);

        const weakestHabitCount={};
        entries.forEach(entry =>{
            const habit = entry.weak_habit;
            if(habit)
            {
                if(!weakestHabitCount[habit])
                {
                    weakestHabitCount[habit]=0;
                }
                weakestHabitCount[habit]++;
            }
        });
        console.log(weakestHabitCount);
        return weakestHabitCount; 

    }
    catch(error)
    {
        console.log(error);
    }
}




async function loadAndDrawCharts() {
    try {
        console.log("GLOBAL userId in getTopHabit():", userId);

        const topHabitCounts = await getTopHabit();
        const weakHabitCounts = await getWeakestHabit();

        drawBarChart("#topHabitChart", topHabitCounts, "steelblue");
        drawBarChart("#weakHabitChart", weakHabitCounts, "tomato");


    } catch (error) {
        console.error("Failed to load charts:", error);
    }
}
function drawBarChart(svgID, obj, color) {
    const svg = d3.select(svgID)
                  .attr("width", 500)
                  .attr("height", 500);

    const data = Object.entries(obj).map(([habit, count]) => ({habit, count}));

    const margin = {top: 40, right: 20, bottom: 60, left: 60};
    const width = +svg.attr("width") - margin.left - margin.right;
    const height = +svg.attr("height") - margin.top - margin.bottom;

    const x = d3.scaleBand()
                .domain(data.map(d => d.habit))
                .range([0, width])
                .padding(0.4);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.count)])
                .nice()
                .range([height, 0]);


    const g = svg.append("g")
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    // Bars
    g.selectAll("rect")
     .data(data)
     .join("rect")
     .attr("x", d => x(d.habit))
     .attr("y", d => y(d.count))
     .attr("height", d => height - y(d.count))
     .attr("width", x.bandwidth())
     .attr("fill", color);

    // X-axis
    g.append("g")
     .attr("transform", `translate(0,${height})`)
     .call(d3.axisBottom(x));

    // Y-axis
    g.append("g")
     .call(d3.axisLeft(y));
}


loadAndDrawCharts();
