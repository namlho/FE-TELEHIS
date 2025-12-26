import React, { useRef, useEffect } from "react";

/**
 * VerticalBarChart - Biểu đồ cột dọc
 * Props:
 *  - data: [{ label: "DX Backend", value: 80, color: "#4CAF50" }, ...]
 *  - width, height: canvas size in px
 *  - title: chart title string
 */
export default function VerticalBarChart({
    data = [],
    width = 1200,
    height = 700,
    title = "Tiến độ công việc được giao",
}) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Background white
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);

        // Title
        ctx.fillStyle = "#222";
        ctx.font = "bold 28px Arial";
        ctx.textAlign = "center";
        ctx.fillText(title, width / 2, 40);

        // Layout margins
        const margin = { left: 80, right: 80, top: 80, bottom: 120 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        // Chart area
        const chartX = margin.left;
        const chartY = margin.top;

        // Draw Y-axis (vertical line)
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(chartX, chartY);
        ctx.lineTo(chartX, chartY + chartHeight);
        ctx.stroke();

        // Draw X-axis (horizontal line)
        ctx.beginPath();
        ctx.moveTo(chartX, chartY + chartHeight);
        ctx.lineTo(chartX + chartWidth, chartY + chartHeight);
        ctx.stroke();

        // Y-axis labels (0%, 20%, 40%, 60%, 80%, 100%)
        ctx.fillStyle = "#666";
        ctx.font = "14px Arial";
        ctx.textAlign = "right";
        for (let i = 0; i <= 100; i += 20) {
            const y = chartY + chartHeight - (i / 100) * chartHeight;
            ctx.fillText(`${i}%`, chartX - 10, y + 5);

            // Grid lines
            if (i > 0) {
                ctx.strokeStyle = "#e0e0e0";
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(chartX, y);
                ctx.lineTo(chartX + chartWidth, y);
                ctx.stroke();
            }
        }

        // Bar settings
        const barWidth = chartWidth / (data.length + 1); // +1 for spacing
        const barSpacing = barWidth * 0.2; // 20% spacing
        const actualBarWidth = barWidth - barSpacing;

        // Draw bars
        data.forEach((item, index) => {
            const x = chartX + (index + 0.5) * barWidth + barSpacing / 2;
            const barHeight = (item.value / 100) * chartHeight;
            const y = chartY + chartHeight - barHeight;

            // Draw bar
            ctx.fillStyle = item.color || "#4CAF50";
            roundRect(ctx, x, y, actualBarWidth, barHeight, 6, true, false);

            // Draw percentage on top of bar
            ctx.fillStyle = "#222";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "center";
            ctx.fillText(`${item.value}%`, x + actualBarWidth / 2, y - 8);

            // Draw label below X-axis
            ctx.fillStyle = "#333";
            ctx.font = "14px Arial";
            ctx.textAlign = "center";

            // Split long labels into multiple lines
            const words = item.label.split(' ');
            const maxWidth = actualBarWidth + 20;
            let lines = [];
            let currentLine = words[0];

            for (let i = 1; i < words.length; i++) {
                const testLine = currentLine + ' ' + words[i];
                const metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth) {
                    lines.push(currentLine);
                    currentLine = words[i];
                } else {
                    currentLine = testLine;
                }
            }
            lines.push(currentLine);

            // Draw each line
            lines.forEach((line, lineIndex) => {
                ctx.fillText(
                    line,
                    x + actualBarWidth / 2,
                    chartY + chartHeight + 25 + (lineIndex * 18)
                );
            });
        });

        // Y-axis title
        ctx.save();
        ctx.translate(30, chartY + chartHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = "#333";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Tiến độ (%)", 0, 0);
        ctx.restore();

        // Utility: rounded rect
        function roundRect(ctx, x, y, w, h, r, fill, stroke) {
            if (w <= 0 || h <= 0) return;
            if (typeof r === "undefined") r = 5;
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.arcTo(x + w, y, x + w, y + h, r);
            ctx.arcTo(x + w, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.arcTo(x, y, x + w, y, r);
            ctx.closePath();
            if (fill) ctx.fill();
            if (stroke) ctx.stroke();
        }
    }, [data, width, height, title]);

    // Download PNG
    function download() {
        const canvas = canvasRef.current;
        const link = document.createElement("a");
        link.download = "vertical_bar_chart.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    }

    return (
        <div style={{ textAlign: "center" }}>
            <canvas
                ref={canvasRef}
                style={{
                    width: `${Math.min(width, 1000)}px`,
                    height: `${(height * Math.min(width, 1000)) / width}px`,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    borderRadius: 6,
                }}
            />
            <div style={{ marginTop: 12 }}>
                <button
                    onClick={download}
                    style={{
                        padding: "8px 14px",
                        background: "#1976d2",
                        color: "#fff",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Download PNG
                </button>
            </div>
        </div>
    );
}
