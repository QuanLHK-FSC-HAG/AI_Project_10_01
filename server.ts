import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to lazily initialize GoogleGenAI client safely
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY is missing. Please configure it in your Settings > Secrets panel.");
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// Endpoint for Warm-up Reaction
app.post("/api/warmup-reaction", async (req, res) => {
  try {
    const { activity } = req.body;
    if (!activity) {
      return res.status(400).json({ error: "Thiếu thông tin hoạt động." });
    }

    const ai = getGeminiClient();
    const prompt = `Bạn là một trợ lý giảng dạy AI thân thiện, sáng tạo của môn học STEM AI lớp 10 tại trường FPT Schools. 
Một học sinh vừa chọn hoạt động: "${activity}" làm hoạt động AI mà bạn ấy từng làm hoặc thấy thú vị nhất.
Hãy viết một phản hồi ngắn (khoảng 3-4 câu), hào hứng, khích lệ học sinh, giải thích ngắn gọn tại sao hoạt động này đang thay đổi thế giới hiện đại và liên hệ một cách thông minh với chương trình SMART (Trải nghiệm Thế giới thông minh) của trường FPT. 
Sử dụng ngôn từ trẻ trung, phù hợp với học sinh lớp 10 (ví dụ gọi 'em', xưng 'thầy/cô' hoặc 'AI Trợ lý').`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Warmup reaction error:", error);
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi hệ thống khi gọi Gemini." });
  }
});

// Endpoint for AI vs Human analysis
app.post("/api/analyze-guess", async (req, res) => {
  try {
    const { type, choice, isCorrect, itemTitle, detailText } = req.body;

    const ai = getGeminiClient();
    const prompt = `Bạn là một chuyên gia AI giảng dạy môn STEM AI lớp 10.
Học sinh đang chơi trò chơi "AI hay Người thật?".
Thông tin lượt chơi:
- Thể loại: ${type} (ví dụ: Thơ, Tranh vẽ, Đồng phục học sinh)
- Tác phẩm/Chi tiết: "${itemTitle}"
- Chi tiết cụ thể: "${detailText}"
- Lựa chọn của học sinh: ${choice} (Đoán đây là do ${choice === "AI" ? "AI tạo" : "Con người tạo"})
- Kết quả lựa chọn này là: ${isCorrect ? "Đúng" : "Sai"}

Hãy viết một phản hồi ngắn gọn (khoảng 4-5 câu) bằng tiếng Việt để:
1. Chúc mừng nếu học sinh trả lời đúng, hoặc giải thích nhẹ nhàng nếu học sinh trả lời sai.
2. Phân tích điểm khác biệt cốt lõi giữa AI và con người trong ví dụ này. (Ví dụ: Thơ của Tố Hữu thì có cảm xúc thật, trải nghiệm cách mạng sâu sắc; thơ AI thì gieo vần khá máy móc, thiếu hồn. Hoặc tranh Van Gogh thì có nét cọ điêu luyện, cảm xúc mạnh mẽ; tranh AI thì đều màu, giả lập phong cách).
3. Đưa ra lời khuyên cho học sinh về tư duy phản biện khi tiếp cận sản phẩm nghệ thuật/văn học để tránh bị nhầm lẫn.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Analyze guess error:", error);
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi hệ thống khi gọi Gemini." });
  }
});

// Endpoint for Hallucination analysis ("Săn lỗi AI")
app.post("/api/verify-hallucination", async (req, res) => {
  try {
    const { category, textContent } = req.body;
    if (!textContent) {
      return res.status(400).json({ error: "Thiếu nội dung cần kiểm tra." });
    }

    const ai = getGeminiClient();
    const prompt = `Học sinh lớp 10 môn STEM AI đang thực hiện thử thách "Săn lỗi AI" (Phát hiện Ảo giác - Hallucination).
Danh mục: ${category}
Nội dung AI tạo ra chứa lỗi: "${textContent}"

Hãy đóng vai là "AI Săn Lỗi", viết một báo cáo phân tích bằng tiếng Việt theo cấu trúc sau (trình bày rõ ràng bằng Markdown):
1. **Lỗi phát hiện**: Chỉ rõ điểm sai sót, phi lý hoặc ảo giác (hallucination) trong nội dung trên.
2. **Giải thích vì sao sai**: Lý giải nguyên nhân tại sao mô hình ngôn ngữ lớn (LLM) hoặc AI tạo hình ảnh lại mắc phải lỗi tính toán, sai lệch lịch sử hoặc biến dạng hình ảnh này (ví dụ: AI hoạt động dựa trên dự đoán từ tiếp theo theo xác suất chứ không thực sự tư duy, hoặc dữ liệu huấn luyện có nhiễu, lỗi đếm ngón tay trong thuật toán vẽ...).
3. **Đề xuất cách kiểm chứng độc lập (Mã SLOs LO2)**: Gợi ý ít nhất 2 nguồn đáng tin cậy hoặc phương pháp thực tế để học sinh đối chiếu thông tin (ví dụ: Sách giáo khoa, bài báo khoa học, trang tin chính thống, tự giải thủ công...).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Verify hallucination error:", error);
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi hệ thống khi gọi Gemini." });
  }
});

// Endpoint for RCTFC Prompt Engineering evaluation
app.post("/api/evaluate-prompt", async (req, res) => {
  try {
    const { subject, promptV1 } = req.body;
    if (!promptV1) {
      return res.status(400).json({ error: "Thiếu câu lệnh Prompt V1." });
    }

    const ai = getGeminiClient();
    const prompt = `Bạn là một Giáo sư AI hướng dẫn học sinh viết Prompt hiệu quả theo công thức RCTFC.
Công thức RCTFC gồm:
- R (Role) - Vai trò
- C (Context) - Bối cảnh
- T (Task) - Nhiệm vụ
- F (Format) - Định dạng
- C (Constraint) - Ràng buộc/Giới hạn

Học sinh vừa viết câu lệnh Prompt V1 sau cho môn học "${subject}":
"${promptV1}"

Hãy thực hiện đánh giá và tối ưu hóa câu lệnh này. Bạn cần trả về một JSON Object khớp hoàn toàn với cấu trúc sau:
{
  "score": <number từ 1 đến 5, ví dụ 2>,
  "feedback": "<nhận xét ngắn gọn, vui vẻ về Prompt V1, chỉ ra các yếu tố RCTFC còn thiếu>",
  "missingElements": ["Role", "Constraint", ...],
  "improvedPromptV2": "<Prompt V2 đã được nâng cấp hoàn chỉnh, chứa đầy đủ các yếu tố RCTFC một cách tối ưu>",
  "explanation": "<giải thích rõ bạn đã thêm những yếu tố nào (R, C, T, F, C) để giúp Prompt V2 vượt trội>",
  "outputV1": "<mô phỏng một đoạn trả lời ngắn, chung chung, sơ sài mà AI sẽ tạo ra khi dùng Prompt V1>",
  "outputV2": "<mô phỏng một đoạn trả lời cực kỳ chất lượng, trực quan, chuyên nghiệp mà AI tạo ra khi dùng Prompt V2>"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["score", "feedback", "missingElements", "improvedPromptV2", "explanation", "outputV1", "outputV2"],
          properties: {
            score: { type: Type.INTEGER, description: "Điểm số từ 1 đến 5" },
            feedback: { type: Type.STRING, description: "Nhận xét chi tiết về Prompt V1" },
            missingElements: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Các yếu tố trong RCTFC còn thiếu"
            },
            improvedPromptV2: { type: Type.STRING, description: "Câu lệnh V2 tối ưu đầy đủ RCTFC" },
            explanation: { type: Type.STRING, description: "Giải thích các nâng cấp đã thực hiện" },
            outputV1: { type: Type.STRING, description: "Mô phỏng đầu ra sơ sài của V1" },
            outputV2: { type: Type.STRING, description: "Mô phỏng đầu ra chuyên nghiệp của V2" }
          }
        }
      }
    });

    const result = JSON.parse(response.text.trim());
    res.json(result);
  } catch (error: any) {
    console.error("Evaluate prompt error:", error);
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi hệ thống khi gọi Gemini." });
  }
});

// Endpoint for Personal AI Philosophy Essay evaluation
app.post("/api/evaluate-essay", async (req, res) => {
  try {
    const { essayText } = req.body;
    if (!essayText) {
      return res.status(400).json({ error: "Thiếu nội dung bài luận." });
    }

    const ai = getGeminiClient();
    const prompt = `Bạn là một giáo viên chấm điểm và hướng dẫn viết bài luận cuối khóa môn STEM AI lớp 10.
Chủ đề bài luận: "Triết lý AI cá nhân của tôi" (Yêu cầu độ dài 600 - 800 từ, trả lời được các câu hỏi: AI giúp ích gì? Hạn chế là gì? Vai trò con người? Cách dùng tương lai có trách nhiệm?).

Học sinh vừa viết bản nháp bài luận sau:
"${essayText}"

Hãy phân tích bài luận này và viết một phản hồi phản tư sâu sắc (dưới dạng Markdown) gồm:
1. **Đánh giá tổng quan**: Khen ngợi những ý tưởng thành thật, thực tế từ trải nghiệm học tập của học sinh.
2. **Kiểm tra độ sâu sắc (Mã SLOs LO5)**: Đánh giá xem học sinh đã hiểu được giới hạn của AI (ảo giác, thiếu cảm xúc thật) và ý thức được vai trò làm chủ của con người hay chưa.
3. **Gợi ý cải thiện**: Chỉ ra 2-3 điểm cụ thể học sinh có thể bổ sung ví dụ thực tế hoặc lập luận chặt chẽ hơn để hoàn thiện bài luận cuối khóa đạt điểm xuất sắc.
4. **Đánh giá mức độ**: Cho biết bài nháp hiện tại đang ở mức nào (Chưa đạt, Cần cải thiện, Tốt, hay Xuất sắc) kèm theo thang điểm mô phỏng (ví dụ: 8.5/10).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Evaluate essay error:", error);
    res.status(500).json({ error: error.message || "Đã xảy ra lỗi hệ thống khi gọi Gemini." });
  }
});

// ----------------------------------------------------
// VITE OR STATIC FRONTEND SERVING MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
