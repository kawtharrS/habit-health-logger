function filterEntriesByWeek(entries, data = "date") {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());  //moves to sunday 
    return entries.filter(entry => {
        if (!entry[data]) return false;
        const entryDate = new Date(entry[data]);
        return entryDate >= startOfWeek && entryDate <= now;
    });
}

function countHabits(entries, field) {
    const count = {};
    entries.forEach(entry => {
        const habit = entry[field];
        if (habit) count[habit] = (count[habit] || 0) + 1;
    });
    return count;
}

async function getWeeklyHabits() {
    try {
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        const entries = response.data.data;

        console.log(entries);

        const dateField = "created_at";

        const weeklyEntries = filterEntriesByWeek(entries, dateField);
        console.log(weeklyEntries);

        const weeklyTopHabitCount = countHabits(weeklyEntries, "top_habit");
        const weeklyWeakHabitCount = countHabits(weeklyEntries, "weak_habit");

        console.log(weeklyTopHabitCount);
        console.log(weeklyWeakHabitCount);
        return { weeklyTopHabitCount, weeklyWeakHabitCount, weeklyEntries };
    } catch (error) {
        console.log(error);
    }
}

async function getAllTimeHabits() {
    try {
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        const entries = response.data.data;

        console.log(entries);

        const allTimeTopHabitCount = countHabits(entries, "top_habit");
        const allTimeWeakHabitCount = countHabits(entries, "weak_habit");

        console.log(allTimeTopHabitCount);
        console.log(allTimeWeakHabitCount);

        return { allTimeTopHabitCount, allTimeWeakHabitCount, entries };
    } catch (error) {
        console.log(error);
    }
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
        .attr("transform", "rotate(-20)")
        .style("text-anchor", "end");

    g.append("g").call(d3.axisLeft(y));
}

async function loadAndDrawCharts() {
    const { weeklyTopHabitCount, weeklyWeakHabitCount, weeklyEntries } = await getWeeklyHabits();

    if (weeklyEntries.length === 0) {
        console.warn("No weekly data available to draw charts.");
    }

    drawBarChart("#weeklyTopHabitChart", weeklyTopHabitCount, "steelblue");
    drawBarChart("#weeklyWeakHabitChart", weeklyWeakHabitCount, "tomato");

    const { allTimeTopHabitCount, allTimeWeakHabitCount } = await getAllTimeHabits();

    drawBarChart("#TopHabitChart", allTimeTopHabitCount, "steelblue");
    drawBarChart("#WeakHabitChart", allTimeWeakHabitCount, "tomato");
}

async function getAdvice() {
    try {
        const data = await axios.get(`${URLS.entries}?user_id=${userId}`);
        const adviceArray = data.data.data;

        const adviceList = adviceArray.map(a => a.advice).filter(Boolean);

        const response = await axios.post(
            URLS.advice,
            { advice: adviceList },
            { headers: { "Content-Type": "application/json" } }
        );

        document.getElementById("adviceContent").innerText = response.data.reply;
    } catch (error) {
        console.log(error);
    }
}

async function getRate()
{
    try{
        const response = await axios.get(`${URLS.entries}?user_id=${userId}`);
        const entries = response.data.data;

        let sum=0;
        entries.forEach(entry =>{
            const i = entry.rating;
            sum+=i;
        });

        console.log("sum",sum);
        console.log("length", entries.length);
        const length =entries.length;
        if(length>0)
        {
            const average = Math.round(sum/length);
            document.getElementById("ratingContent").innerText = average;
        }
        else{
            alert("Nothing to show!");
        }
        
    }
    catch(error)
    {
        console.log(error);
    }
}

loadAndDrawCharts();
getAdvice();
getRate()
