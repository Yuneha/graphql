function skillsChart() {
  const data = [
    { axis: "Prog", value: skillProg },
    { axis: "Go", value: skillGo },
    { axis: "Back-End", value: skillBackEnd },
    { axis: "Front-End", value: skillBackEnd },
    { axis: "Algo", value: skillAlgo },
    { axis: "Js", value: skillJs },
  ];

  // Configuration
  const margin = { top: 50, right: 50, bottom: 50, left: 50 };
  const width = 500;
  const height = 500;
  const chartSize = Math.min(width, height) - margin.left - margin.right;
  const radius = chartSize / 2;
  const angleSlice = (Math.PI * 2) / data.length;

  // SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  // Create a group for the chart and center it
  const chart = document.createElementNS("http://www.w3.org/2000/svg", "g");
  chart.setAttribute("transform", `translate(${width / 2},${height / 2})`);
  svg.appendChild(chart);

  // Circular grid
  for (let i = 1; i <= 5; i++) {
    const gridCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    gridCircle.setAttribute("cx", 0);
    gridCircle.setAttribute("cy", 0);
    gridCircle.setAttribute("r", (radius * i) / 5);
    gridCircle.setAttribute("fill", "none");
    gridCircle.setAttribute("stroke", "#ccc");
    chart.appendChild(gridCircle);
  }

  // Axes
  data.forEach((d, i) => {
    const angle = i * angleSlice;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", radius * Math.cos(angle - Math.PI / 2));
    line.setAttribute("y2", radius * Math.sin(angle - Math.PI / 2));
    line.setAttribute("stroke", "#999");
    chart.appendChild(line);

    // Add axis labels
    const labelDistance = radius + 20;
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    label.setAttribute("x", labelDistance * Math.cos(angle - Math.PI / 2));
    label.setAttribute("y", labelDistance * Math.sin(angle - Math.PI / 2));
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "central");
    label.textContent = d.axis;
    chart.appendChild(label);
  });

  // Radar path
  const radarPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  const pathData =
    data
      .map((d, i) => {
        const angle = i * angleSlice;
        const r = (radius * d.value) / 100;
        return `${i === 0 ? "M" : "L"} ${r * Math.cos(angle - Math.PI / 2)},${
          r * Math.sin(angle - Math.PI / 2)
        }`;
      })
      .join(" ") + " Z";

  radarPath.setAttribute("d", pathData);
  radarPath.setAttribute("fill", "rgba(164, 181, 215, 0.5)");
  radarPath.setAttribute("stroke", "rgba(255, 255, 255, 0.5)");
  chart.appendChild(radarPath);

  document.getElementById("skills_chart").appendChild(svg);
}
