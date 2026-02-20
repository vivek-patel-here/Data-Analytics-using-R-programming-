"use client"
import React, { useState } from "react";
import { LoaderCircle, Maximize2, Minimize2 } from "lucide-react";
import { motion } from "framer-motion";
import Divider from "@/components/Divider";
import Footer from "@/components/Footer";
import dynamic from "next/dynamic";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

interface CompanyHash {
  [symbol: string]: string;
}

export default function Home() {

  const [loader, setLoader] = useState(false);
  const [company, setCompany] = useState("");
  const [currCompany, setCurrentCompany] = useState("");
  const [plot, setPlot] = useState<any>(null);

  const [fullscreenPlot, setFullscreenPlot] = useState<any>(null);

  const [visible, setVisible] = useState({
    price: true,
    volume: true,
    rsi: true,
    macd: true
  });

  const companyHash: CompanyHash = {
    "AAPL": "Apple",
    "MSFT": "Microsoft",
    "TSLA": "Tesla",
    "INFY.NS": "Infosys",
    "GOOG": "Google",
    "AMZN": "Amazon",
    "META": "Meta",
    "RELIANCE.NS": "Reliance Industries"
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoader(true);
    setPlot(null);

    try {
      const resp = await fetch("http://localhost:8000/analyse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ stock: company })
      });

      const parsedResp = await resp.json();

      if (resp.ok) setPlot(parsedResp.plots);
      setCurrentCompany(companyHash[company]);

    } catch (err) {
      console.error(err);
    } finally {
      setLoader(false);
    }
  };

  const Card = ({ title, children, plotObj }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className="bg-[#11161c] border border-neutral-800 rounded-xl p-5 shadow-lg flex flex-col gap-4 relative"
    >
      <h3 className="text-emerald-400 font-semibold text-lg">
        {title}
      </h3>

      {/* ⭐ Expand Button */}
      <button
        onClick={() => setFullscreenPlot(plotObj)}
        className="absolute top-4 right-4 p-1 hover:bg-neutral-800 rounded-md"
      >
        <Maximize2 size={16} />
      </button>

      <div className="w-full h-95">
        {children}
      </div>
    </motion.div>
  );

  const RenderPlot = (plotObj: any) => (
    <Plot
      data={plotObj.data}
      layout={{
        ...plotObj.layout,
        autosize: true,
        height: 350,
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
        font: { color: "#111827", size: 12 },
        xaxis: {
          ...plotObj.layout?.xaxis,
          showgrid: true,
          gridcolor: "#e5e7eb",
          zeroline: false,
          color: "#111827"
        },
        yaxis: {
          ...plotObj.layout?.yaxis,
          showgrid: true,
          gridcolor: "#e5e7eb",
          zeroline: false,
          color: "#111827"
        },
        title: {
          ...plotObj.layout?.title,
          font: { color: "#111827", size: 16 }
        },
        margin: { l: 50, r: 20, t: 40, b: 40 }
      }}
      config={{
        displaylogo: false,
        responsive: true,
        scrollZoom: true,
        modeBarButtonsToRemove: ["lasso2d", "select2d"]
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
    />
  );

  const FullscreenPlot = (plotObj: any) => (
    <Plot
      data={plotObj.data}
      layout={{
        ...plotObj.layout,
        autosize: true,
        height: window.innerHeight - 120,
        paper_bgcolor: "#ffffff",
        plot_bgcolor: "#ffffff",
        font: { color: "#111827" }
      }}
      config={{
        responsive: true,
        scrollZoom: true,
        displaylogo: false
      }}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
    />
  );

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center py-10 px-6 text-white gap-10">

      <h1 className="text-4xl md:text-5xl text-center text-emerald-500 font-semibold">
        Stock Market Technical Indicator Visualizer
      </h1>

      <div className="bg-neutral-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-neutral-800">
        <h2 className="text-xl font-bold mb-6 text-center text-emerald-400">
          Stock Analysis
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            required
            onChange={(e) => setCompany(e.target.value)}
            value={company}
            className="w-full bg-black border border-neutral-700 rounded-lg px-4 py-2"
          >
            <option value="">Select Company</option>
            <option value="AAPL">Apple</option>
            <option value="MSFT">Microsoft</option>
            <option value="TSLA">Tesla</option>
            <option value="INFY.NS">Infosys</option>
            <option value="GOOG">Google</option>
            <option value="AMZN">Amazon</option>
            <option value="META">Meta</option>
            <option value="RELIANCE.NS">Reliance Industries</option>
          </select>

          <button
            type="submit"
            className="w-full bg-emerald-600 grid place-items-center hover:bg-emerald-700 transition rounded-lg py-2 font-semibold"
          >
            {!loader ? "Analyse Stock" : <LoaderCircle className="animate-spin" />}
          </button>
        </form>
      </div>

      {plot && (
        <>
          <Divider />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-6xl bg-[#11161c] border border-neutral-800 rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-3xl text-emerald-400 font-semibold">
              {currCompany} Market Dashboard
            </h2>

            <div className="flex flex-wrap gap-3 mt-4">
              {Object.keys(visible).map((k) => (
                <button
                  key={k}
                  onClick={() => setVisible(v => ({ ...v, [k]: !v[k] }))}
                  className={`px-3 py-1 rounded-full text-sm border transition
                  ${visible[k as keyof typeof visible]
                      ? "bg-emerald-500/20 border-emerald-500"
                      : "bg-neutral-800 border-neutral-700"}`}
                >
                  {k.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>

          <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">

            {visible.price && plot?.p1 &&
              <Card title="Price + Moving Averages" plotObj={plot.p1}>
                {RenderPlot(plot.p1)}
              </Card>
            }

            {visible.volume && plot?.p2 &&
              <Card title="Trading Volume" plotObj={plot.p2}>
                {RenderPlot(plot.p2)}
              </Card>
            }

            {visible.rsi && plot?.p3 &&
              <Card title="RSI Indicator" plotObj={plot.p3}>
                {RenderPlot(plot.p3)}
              </Card>
            }

            {visible.macd && plot?.p4 &&
              <Card title="MACD Indicator" plotObj={plot.p4}>
                {RenderPlot(plot.p4)}
              </Card>
            }

          </div>
        </>
      )}

      {fullscreenPlot && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-6 backdrop-blur-sm">

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl w-full h-full p-6 relative shadow-2xl"
          >

            <button
              onClick={() => setFullscreenPlot(null)}
              className="absolute top-3 left-3 z-50 text-black/50 flex items-center gap-1 text-xs bg-white/90 hover:bg-neutral-100 px-2 py-1 rounded-md shadow border"
            >
              <Minimize2 size={12} />
            </button>

            {FullscreenPlot(fullscreenPlot)}

          </motion.div>
        </div>
      )}


      <Footer />
    </div>
  );
}
