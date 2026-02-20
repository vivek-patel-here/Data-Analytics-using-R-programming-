import express from "express";
import type { Request, Response } from "express";
import { spawn } from "child_process";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import CORS from "cors";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);  
const rScriptPath = path.join(__dirname, "../src/analysis.R");

app.use(CORS({
    origin:"*"
}))
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));
app.use(express.urlencoded({ extended: true }));

//routes
app.get("/health-check", (req: Request, res: Response) => {
    return res.status(200).json({ success: true, health: "active" });
})
 


app.post("/analyse", (req: Request, res: Response) => {
  try {

    const stock = req.body.stock;

    if(!stock){
      return res.status(400).json({ error:"Stock symbol required" });
    }

    const rProcess = spawn("Rscript", [rScriptPath, stock]);

    let data = "";
    let errData = "";

    rProcess.stdout.on("data", (chunk) => {
      data += chunk.toString();
    });

    rProcess.stderr.on("data", (chunk) => {
      errData += chunk.toString();
    });


    rProcess.on("close", () => {

      if(errData){ 
        console.error("R STDERR:", errData);
      }

      try{
        const parsed = JSON.parse(data);
        return res.json({ plots: parsed });
      }catch(parseErr){
        console.error("JSON PARSE ERROR:", parseErr);
        return res.status(500).json({ error:"Invalid JSON from R" });
      }

    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error:"Server Error" });
  }
});



app.listen(8000, () => console.log("Server is running on port 8000."));