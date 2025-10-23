import React, { useRef, useEffect } from "react";

/**
 * ProgressBarsCanvas
 * Props:
 *  - data: [{ label: "DX Backend", value: 80, color: "#4CAF50" }, ...]
 *  - width, height: canvas size in px
 *  - title: chart title string
 */
export default function ProgressBarsCanvas({
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
        ctx.fillText(title, width / 2, 60);

        // Layout
        const margin = { left: 280, right: 140, top: 100, bottom: 60 };
        const usableWidth = width - margin.left - margin.right;
        const usableHeight = height - margin.top - margin.bottom;
        const barGap = 30;
        const barHeight = (usableHeight - (data.length - 1) * barGap) / data.length;

        // Draw bars (in reversed order to match example top->bottom)
        const sorted = [...data].slice().reverse();

        sorted.forEach((d, i) => {
            const y = margin.top + i * (barHeight + barGap);
            const val = Math.max(0, Math.min(100, d.value)); // clamp 0..100
            const barW = (val / 100) * usableWidth;

            // Bar background (light gray track)
            ctx.fillStyle = "#eee";
            const trackX = margin.left;
            const trackY = y;
            ctx.fillRect(trackX, trackY, usableWidth, barHeight);

            // Actual bar
            ctx.fillStyle = d.color || "#888";
            // Rounded rectangle helper
            const radius = Math.min(barHeight / 2, 12);
            roundRect(ctx, trackX, trackY, barW, barHeight, radius, true, false);

            // Percentage text at the right end of the bar area
            ctx.fillStyle = "#222";
            ctx.font = "bold 20px Arial";
            ctx.textAlign = "left";
            // Put percentage slightly to the right of actual bar end
            let percentX = trackX + barW + 12;
            let percentColor = "#222";
            if (barW + 120 > usableWidth) {
                // if bar nearly full, place percent inside bar but keep it black
                percentX = trackX + usableWidth - 60;
                percentColor = "#222"; // Keep black color for visibility
                ctx.textAlign = "right";
            } else {
                ctx.textAlign = "left";
            }
            ctx.fillStyle = percentColor;
            ctx.fillText(`${val}%`, percentX, trackY + barHeight / 2 + 8);

            // Draw task label on the left side
            ctx.fillStyle = "#333";
            ctx.font = "bold 16px Arial";
            ctx.textAlign = "right";
            ctx.fillText(d.label, trackX - 15, trackY + barHeight / 2 + 6);
        });

        // Utility: rounded rect
        function roundRect(ctx, x, y, w, h, r, fill, stroke) {
            if (w <= 0) return;
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
        link.download = "progress_chart.png";
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
