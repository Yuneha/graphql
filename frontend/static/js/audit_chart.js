function renderAuditChart() {
  //Configuration
  const width = 400;
  const height = 50;
  const margin = { top: 0, right: 50, bottom: 0, left: 100 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  // SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  // Chart element
  const chart = document.createElementNS("http://www.w3.org/2000/svg", "g");
  chart.setAttribute("transform", `translate(${margin.left}, ${margin.top})`);
  svg.appendChild(chart);

  const data = [xpFormat(auditDone).Number, xpFormat(auditReceived).Number];

  const maxValue = Math.max(...data);
  const xScale = chartWidth / maxValue;
  const barHeight = chartHeight / data.length;

  // Bar element
  data.forEach((value, index) => {
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const barWidth = value * xScale;

    bar.classList.add(`bar${index}`);
    bar.setAttribute("x", 0);
    bar.setAttribute("y", index * barHeight);
    bar.setAttribute("width", barWidth);
    bar.setAttribute("height", barHeight - 5);
    chart.appendChild(bar);

    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", barWidth + 5);
    text.setAttribute("y", index * barHeight + barHeight / 2);
    text.setAttribute("dominant-baseline", "middle");
    chart.appendChild(text);
  });

  // Label element
  const categories = ["Done", "Received"];
  categories.forEach((category, index) => {
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    label.classList.add(`label${category}`);
    label.setAttribute("x", -5);
    label.setAttribute("y", index * barHeight + barHeight / 2);
    label.setAttribute("text-anchor", "end");
    label.setAttribute("dominant-baseline", "middle");
    label.textContent = category;
    chart.appendChild(label);
  });

  document.getElementById("audit_chart").appendChild(svg);
}
