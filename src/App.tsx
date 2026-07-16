import React, { useState } from "react";
import { 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  ListTodo, 
  Brain, 
  ChevronRight, 
  Award, 
  CheckCircle, 
  AlertTriangle, 
  Send, 
  FileText, 
  Plus, 
  Trash2, 
  Download,
  Info,
  Layers,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ThumbsUp
} from "lucide-react";

// Types
interface PromptJournalEntry {
  id: string;
  subject: string;
  promptV1: string;
  promptV2: string;
  score: number;
  feedback: string;
  explanation: string;
  outputV1: string;
  outputV2: string;
}

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<"study" | "curriculum">("study");
  const [activeStation, setActiveStation] = useState<number>(1);

  // Global State: Prompt Journal
  const [promptJournal, setPromptJournal] = useState<PromptJournalEntry[]>([
    {
      id: "1",
      subject: "Toán học",
      promptV1: "Giải phương trình bậc hai.",
      promptV2: "Đóng vai là giáo viên toán cấp 3, hãy hướng dẫn từng bước cách giải phương trình bậc hai x^2 - 5x + 6 = 0 cho học sinh lớp 10 dễ hiểu.",
      score: 4,
      feedback: "Prompt V1 thiếu vai trò, bối cảnh và giới hạn định dạng.",
      explanation: "Đã thêm vai trò giáo viên, bối cảnh lớp 10, yêu cầu định dạng từng bước rõ ràng.",
      outputV1: "Để giải phương trình bậc hai, ta tính delta = b^2 - 4ac. Nếu delta > 0 phương trình có 2 nghiệm...",
      outputV2: "Thầy chào em! Hôm nay thầy sẽ hướng dẫn em giải phương trình x^2 - 5x + 6 = 0 từng bước cực dễ nhé:\nBước 1: Xác định hệ số: a=1, b=-5, c=6\nBước 2: Tính biệt thức Delta = (-5)^2 - 4*1*6 = 25 - 24 = 1...\nNghiệm là x1 = 3 và x2 = 2."
    },
    {
      id: "2",
      subject: "Ngữ văn",
      promptV1: "Tóm tắt Chí Phèo.",
      promptV2: "Đóng vai giáo viên Ngữ văn lớp 11, tóm tắt truyện ngắn Chí Phèo của Nam Cao bằng sơ đồ gạch đầu dòng 5 ý chính ngắn gọn, súc tích.",
      score: 5,
      feedback: "Prompt V1 quá ngắn, không có định dạng.",
      explanation: "Đã thêm Vai trò + Định dạng danh sách 5 ý ngắn gọn.",
      outputV1: "Chí Phèo là truyện ngắn của Nam Cao viết về đề tài người nông dân bị tha hóa trước cách mạng...",
      outputV2: "Chào các em học sinh thân yêu! Dưới đây là tóm tắt Chí Phèo qua 5 mốc sự kiện cốt lõi:\n1. Chí Phèo sinh ra là đứa trẻ mồ côi tội nghiệp...\n2. Chí bị Bá Kiến đẩy vào tù oan sai...\n3. Chí trở về thành tay sai rạch mặt ăn vạ...\n4. Cuộc gặp gỡ Thị Nở thức tỉnh phần người...\n5. Chí tuyệt vọng sát hại Bá Kiến và tự sát."
    }
  ]);

  // Station 1: Warmup State
  const [warmupActivity, setWarmupActivity] = useState<string>("Tạo ảnh bằng AI");
  const [warmupThought, setWarmupThought] = useState<string>("");
  const [warmupResponse, setWarmupResponse] = useState<string>("");
  const [isWarmupLoading, setIsWarmupLoading] = useState<boolean>(false);

  // Station 2: Game State (AI vs Human)
  const [gameRound, setGameRound] = useState<number>(1);
  const [selectedGuess, setSelectedGuess] = useState<string | null>(null);
  const [hasGuessed, setHasGuessed] = useState<boolean>(false);
  const [gameResponse, setGameResponse] = useState<string>("");
  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);

  // Station 3: Hallucination Simulator State
  const [selectedHallucination, setSelectedHallucination] = useState<string>("math");
  const [customHallucinationText, setCustomHallucinationText] = useState<string>(
    "AI so sánh 9.9 và 9.11 và khẳng định 9.11 lớn hơn 9.9 một cách tự tin vì 11 lớn hơn 9."
  );
  const [hallucinationReport, setHallucinationReport] = useState<string>("");
  const [isHallucinationLoading, setIsHallucinationLoading] = useState<boolean>(false);

  // Station 4: Prompt Optimizer State
  const [promptSubject, setPromptSubject] = useState<string>("Toán học");
  const [promptInput, setPromptSubjectInput] = useState<string>("");
  const [isPromptLoading, setIsPromptLoading] = useState<boolean>(false);
  const [evaluatedResult, setEvaluatedResult] = useState<any>(null);

  // Station 5: Quiz & Essay State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizAnswersSubmitted] = useState<boolean>(false);
  const [essayDraft, setEssayDraft] = useState<string>("");
  const [essayReport, setEssayReport] = useState<string>("");
  const [isEssayLoading, setIsEssayLoading] = useState<boolean>(false);

  // Game data configuration
  const gameRounds = [
    {
      id: 1,
      type: "Thơ ca",
      title: "Đố vui thơ lục bát",
      itemTitle: "Khổ thơ A vs Khổ thơ B",
      prompt: "Đọc kỹ hai khổ thơ dưới đây - Khổ thơ nào do AI sáng tác?",
      optionA: "Khổ thơ A",
      optionB: "Khổ thơ B",
      textA: "Từ ấy trong tôi bừng nắng hạ\nMặt trời chân lý chói qua tim\nHồn tôi là một vườn hoa lá\nRất đậm hương và rộn tiếng chim...",
      textB: "Trong lòng ta nở ánh bình minh\nChân trời tri thức rạng lung linh\nTâm hồn như cánh đồng xanh mướt\nNgập tràn giai điệu của thanh bình...",
      correct: "B",
      detail: "Khổ thơ A là tác phẩm 'Từ ấy' cực kỳ nổi tiếng của nhà thơ cách mạng Tố Hữu. Khổ thơ B do AI (ChatGPT) tự động mô phỏng và gieo vần dựa trên từ khóa, lời lẽ khá chung chung và sáo rỗng.",
    },
    {
      id: 2,
      type: "Thơ lục bát",
      title: "Đố vui thơ Việt Bắc",
      itemTitle: "Khổ thơ A vs Khổ thơ B",
      prompt: "Bài thơ nào do AI tự viết?",
      optionA: "Khổ thơ A",
      optionB: "Khổ thơ B",
      textA: "Mình đi mình có nhớ quê?\nChiều thu gió nhẹ bốn bề vấn vương.\nMình đi mình có nhớ đường\nHoa rơi nhớ lối, khói sương nhớ chiều?",
      textB: "Mình về mình có nhớ ta?\nMười lăm năm ấy thiết tha mặn nồng.\nMình về mình có nhớ không\nNhìn cây nhớ núi, nhìn sông nhớ nguồn?",
      correct: "A",
      detail: "Khổ thơ B trích từ bài 'Việt Bắc' của Tố Hữu dạt dào tình nghĩa kháng chiến. Khổ thơ A do AI tự gieo vần bắt chước đại từ 'mình - ta' nhưng bối cảnh thiên nhiên khá mờ nhạt và chắp vá.",
    },
    {
      id: 3,
      type: "Nghệ thuật Tranh vẽ",
      title: "Tranh Đêm Đầy Sao (Starry Night)",
      itemTitle: "Tranh nguyên bản Van Gogh vs Tranh mô phỏng AI",
      prompt: "Lựa chọn nào mô tả đúng về tranh do AI vẽ giả lập?",
      optionA: "Tranh A: Có các nét cọ sơn dầu dày cộm, gồ ghề đầy cảm xúc, chuyển màu thô ráp.",
      optionB: "Tranh B: Nét cọ cực kỳ trơn tru, mịn màng, màu sắc chuyển tiếp mượt mà như kỹ thuật số hoàn hảo.",
      correct: "B",
      detail: "Nghệ sĩ thật (Van Gogh) vẽ bằng cả linh hồn với kỹ thuật đắp sơn (impasto) nổi sần sùi mang nặng nỗi niềm u uất. AI chỉ giả lập thuật toán pixel nên tranh mượt mà một cách vô hồn, thiếu độ sâu vật lý.",
    },
    {
      id: 4,
      type: "Hình ảnh học sinh FPT",
      title: "Ảnh thực tế vs Ảnh AI tạo",
      itemTitle: "Học sinh FPT mặc đồng phục cam",
      prompt: "Chi tiết nào giúp phát hiện bức ảnh do AI vẽ?",
      optionA: "Bức ảnh A: Có học sinh chuyển động tự nhiên, logo FPT thêu hơi lệch nhẹ, hậu cảnh mờ nhòe chân thực.",
      optionB: "Bức ảnh B: Học sinh có làn da láng mịn như sáp, ngón tay có 6 ngón, logo FPT thêu chữ viết loằng ngoằng, méo mó vô nghĩa.",
      correct: "B",
      detail: "AI hiện nay vẫn gặp khó khăn trong việc vẽ các chi tiết nhỏ như ngón tay người (dễ bị thừa ngón) và văn bản chữ viết trên logo (AI tạo ra các ký tự vô nghĩa giống chữ nhưng không đọc được).",
    }
  ];

  // Hallucination cases configuration
  const hallucinationCases = [
    {
      id: "math",
      title: "Toán học (Lỗi so sánh)",
      category: "Toán học sai lầm",
      text: "AI so sánh 9.9 và 9.11 và khẳng định 9.11 lớn hơn 9.9 một cách tự tin vì 11 lớn hơn 9.",
    },
    {
      id: "history",
      title: "Lịch sử (Năm sinh)",
      category: "Sai lệch Lịch sử",
      text: "AI cung cấp thông tin sai lệch về ngày tháng năm sinh của các nhân vật lịch sử nổi tiếng một cách vô cùng quyết đoán và tự tin.",
    },
    {
      id: "reference",
      title: "Bịa nguồn tài liệu",
      category: "Bịa tài liệu trích dẫn",
      text: "AI tự động bịa ra tên sách, tên tác giả, số chương và số trang hoàn toàn không tồn tại để làm minh chứng cho bài luận chính trị.",
    },
    {
      id: "hands",
      title: "Vẽ tay 6 ngón",
      category: "Hình ảnh lỗi cấu trúc",
      text: "AI vẽ chân dung học sinh FPT Schools nhảy dây, nhưng bàn tay học sinh có tới 6 ngón và sợi dây bay lơ lửng không chạm đất.",
    }
  ];

  // Quiz questions configuration
  const quizQuestions = [
    {
      id: 1,
      q: "AI có thể gặp hiện tượng 'ảo giác' (hallucination). Điều này nghĩa là gì?",
      options: {
        A: "AI có khả năng mơ ước và sáng tạo như con người.",
        B: "AI tự tin tạo ra các thông tin sai lệch, không có thật.",
        C: "AI bị virus tấn công dẫn đến hỏng hệ thống.",
        D: "AI có cảm xúc vui buồn khi tương tác với học sinh."
      },
      correct: "B",
      explanation: "Ảo giác (hallucination) là hiện tượng AI tự tin đưa ra câu trả lời sai lệch, bịa đặt nguồn tài liệu hoặc giải toán sai nhưng trình bày rất mạch lạc và thuyết phục."
    },
    {
      id: 2,
      q: "Công thức viết Prompt hiệu quả RCTFC bao gồm các thành phần nào?",
      options: {
        A: "Role (Vai trò) - Context (Bối cảnh) - Task (Nhiệm vụ) - Format (Định dạng) - Constraint (Ràng buộc)",
        B: "Reading (Đọc) - Coding (Lập trình) - Testing (Kiểm thử) - Feedback (Góp ý) - Chat (Trò chuyện)",
        C: "Review (Đánh giá) - Create (Sáng tạo) - Teach (Giảng dạy) - Form (Phiếu) - Correct (Sửa lỗi)",
        D: "Robot (Máy móc) - Calculation (Tính toán) - Translation (Dịch) - Fun (Vui vẻ) - Creative (Sáng tạo)"
      },
      correct: "A",
      explanation: "RCTFC là viết tắt của: Role (Vai trò), Context (Bối cảnh), Task (Nhiệm vụ), Format (Định dạng), Constraint (Ràng buộc/Giới hạn). Đây là công thức vàng giúp nâng cao chất lượng phản hồi từ AI."
    },
    {
      id: 3,
      q: "Mục đích cốt lõi của hoạt động Peer Review (Đánh giá chéo) trong môn học Portfolio AI là gì?",
      options: {
        A: "Để so bì điểm số và hạ thấp bài làm của bạn học khác.",
        B: "Sao chép toàn bộ prompt của bạn để mang về làm bài của mình.",
        C: "Gợi ý nhận xét chân thành để giúp nhau hoàn thiện sản phẩm tốt hơn.",
        D: "Nhờ bạn học làm hộ toàn bộ các phần nội dung còn thiếu."
      },
      correct: "C",
      explanation: "Peer Review giúp học sinh có thêm góc nhìn khách quan, nhận ra thiếu sót mà mình bỏ qua, hỗ trợ nhau hoàn thiện Portfolio AI v1.0 đạt chuẩn xuất sắc."
    }
  ];

  // Handler: Station 1 Warmup API
  const handleWarmupSubmit = async () => {
    setIsWarmupLoading(true);
    setWarmupResponse("");
    try {
      const activityText = warmupThought ? `${warmupActivity} (${warmupThought})` : warmupActivity;
      const res = await fetch("/api/warmup-reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity: activityText }),
      });
      const data = await res.json();
      if (res.ok) {
        setWarmupResponse(data.text);
      } else {
        setWarmupResponse(`Có lỗi xảy ra: ${data.error}`);
      }
    } catch (err: any) {
      setWarmupResponse(`Không thể kết nối đến server: ${err.message}`);
    } finally {
      setIsWarmupLoading(false);
    }
  };

  // Handler: Station 2 Guess Game API
  const handleGuessSelection = async (option: string) => {
    setSelectedGuess(option);
    setHasGuessed(true);
    setIsGameLoading(true);
    setGameResponse("");

    const roundData = gameRounds[gameRound - 1];
    const isCorrect = option === roundData.correct;

    try {
      const res = await fetch("/api/analyze-guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: roundData.type,
          choice: option === "A" ? "Khổ thơ/Phương án A" : "Khổ thơ/Phương án B",
          isCorrect,
          itemTitle: roundData.itemTitle,
          detailText: option === "A" ? roundData.textA : roundData.textB
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGameResponse(data.text);
      } else {
        setGameResponse(`Lỗi từ Gemini: ${data.error}`);
      }
    } catch (err: any) {
      setGameResponse(`Lỗi kết nối: ${err.message}`);
    } finally {
      setIsGameLoading(false);
    }
  };

  const handleNextRound = () => {
    if (gameRound < gameRounds.length) {
      setGameRound(gameRound + 1);
      setSelectedGuess(null);
      setHasGuessed(false);
      setGameResponse("");
    } else {
      // Loop back
      setGameRound(1);
      setSelectedGuess(null);
      setHasGuessed(false);
      setGameResponse("");
    }
  };

  // Handler: Station 3 Hallucination API
  const handleHallucinationVerify = async () => {
    setIsHallucinationLoading(true);
    setHallucinationReport("");
    try {
      const currentCase = hallucinationCases.find(c => c.id === selectedHallucination);
      const content = customHallucinationText || currentCase?.text;
      const res = await fetch("/api/verify-hallucination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: currentCase?.category || "Lỗi chung",
          textContent: content
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setHallucinationReport(data.text);
      } else {
        setHallucinationReport(`Có lỗi xảy ra: ${data.error}`);
      }
    } catch (err: any) {
      setHallucinationReport(`Không thể kết nối server: ${err.message}`);
    } finally {
      setIsHallucinationLoading(false);
    }
  };

  // Handler: Station 4 Prompt Engineering Optimizer API
  const handleEvaluatePrompt = async () => {
    if (!promptInput.trim()) return;
    setIsPromptLoading(true);
    setEvaluatedResult(null);
    try {
      const res = await fetch("/api/evaluate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: promptSubject,
          promptV1: promptInput
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEvaluatedResult(data);
      } else {
        alert(`Lỗi phân tích: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Lỗi mạng: ${err.message}`);
    } finally {
      setIsPromptLoading(false);
    }
  };

  const saveToPromptJournal = () => {
    if (!evaluatedResult) return;
    const newEntry: PromptJournalEntry = {
      id: Date.now().toString(),
      subject: promptSubject,
      promptV1: promptInput,
      promptV2: evaluatedResult.improvedPromptV2,
      score: evaluatedResult.score,
      feedback: evaluatedResult.feedback,
      explanation: evaluatedResult.explanation,
      outputV1: evaluatedResult.outputV1,
      outputV2: evaluatedResult.outputV2
    };
    setPromptJournal([newEntry, ...promptJournal]);
    setPromptSubjectInput("");
    setEvaluatedResult(null);
    alert("Đã lưu câu lệnh tối ưu thành công vào Nhật ký Prompt Journal của em!");
  };

  const deleteJournalEntry = (id: string) => {
    setPromptJournal(promptJournal.filter(entry => entry.id !== id));
  };

  // Handler: Station 5 Essay evaluation API
  const handleEvaluateEssay = async () => {
    if (!essayDraft.trim()) {
      alert("Vui lòng viết bản nháp bài luận trước khi gửi phản tư!");
      return;
    }
    setIsEssayLoading(true);
    setEssayReport("");
    try {
      const res = await fetch("/api/evaluate-essay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essayText: essayDraft }),
      });
      const data = await res.json();
      if (res.ok) {
        setEssayReport(data.text);
      } else {
        setEssayReport(`Lỗi đánh giá bài luận: ${data.error}`);
      }
    } catch (err: any) {
      setEssayReport(`Lỗi mạng khi kết nối server: ${err.message}`);
    } finally {
      setIsEssayLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col selection:bg-orange-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-orange-600 to-orange-400 p-2.5 rounded-xl shadow-lg shadow-orange-500/20">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-bold text-orange-500 font-display">FPT Schools</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 font-bold border border-slate-700 text-slate-400">SMART SYSTEM</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white font-display">STEM AI Portfolio Kickstart Hub</h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("study")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "study"
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-600/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              Tương Tác Trạm 1 - 5
            </button>
            <button
              onClick={() => setActiveTab("curriculum")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === "curriculum"
                  ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md shadow-orange-600/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Tóm Tắt Dự Án (Markdown)
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col gap-6">
        
        {activeTab === "curriculum" ? (
          /* CURRICULUM TAB (Markdown Summary) */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 animate-fade-in shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
              <Info className="h-6 w-6 text-orange-500" />
              <div>
                <h2 className="text-2xl font-bold text-white font-display">Tóm Tắt Dự Án: Portfolio Khám phá AI của Tôi</h2>
                <p className="text-slate-400 text-sm">Học phần STEM AI - Khối Phổ thông FPT (FPT Schools)</p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none text-slate-300 space-y-8 leading-relaxed">
              
              <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                <h3 className="text-lg font-bold text-orange-400 flex items-center gap-2 mb-2 font-display">
                  <TrendingUp className="h-5 w-5" />
                  Mục tiêu Cốt lõi của Học phần
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-300">
                  <li><strong>Làm chủ Prompt Engineering</strong>: Sử dụng thành thạo công thức <strong>RCTFC</strong> (Role, Context, Task, Format, Constraint) để nâng cấp câu lệnh AI.</li>
                  <li><strong>Ứng dụng đa môn học</strong>: Dùng AI hỗ trợ đắc lực cho Ngữ văn (phân tích thơ), Toán học & KHTN (giải toán, giải thích hiện tượng), Khoa học xã hội (Lịch sử, Địa lý), và Hướng nghiệp (viết CV).</li>
                  <li><strong>Tư duy phản biện độc lập</strong>: Hiểu rõ khái niệm ảo giác (hallucination) của AI, thực hiện kiểm chứng chéo thông tin bằng 2 nguồn độc lập trước khi đưa vào Portfolio.</li>
                  <li><strong>Lưu trữ hành trình học tập</strong>: Quản lý Nhật ký câu lệnh (Prompt Journal) xuyên suốt 18 tiết học để đo lường sự tiến bộ.</li>
                </ul>
              </div>

              {/* Steps timeline 1 to 18 */}
              <div>
                <h3 className="text-xl font-bold text-white font-display mb-4 border-l-4 border-orange-500 pl-3">Bản Đồ Hành Trình 18 Tiết Học</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Tiết 1 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 1 - 2</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">Khởi động & Lập kế hoạch</h4>
                    <p className="text-xs text-slate-400 mt-1">Làm quen khái niệm AI, chơi game đoán sản phẩm AI vs Con người. Chọn công cụ (Canva) thiết lập khung cấu trúc Portfolio.</p>
                  </div>
                  {/* Tiết 3 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 3 - 4</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">ChatGPT & Công thức Prompt</h4>
                    <p className="text-xs text-slate-400 mt-1">Học nguyên lý dự đoán từ tiếp theo của ChatGPT. Thực hành công thức <strong>RCTFC</strong> để tạo ra prompt chất lượng cao.</p>
                  </div>
                  {/* Tiết 5 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 5</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">AI Sáng tạo & Mini poster</h4>
                    <p className="text-xs text-slate-400 mt-1">Trải nghiệm Generative AI tạo hình ảnh và thiết kế sản phẩm sáng tạo như poster môi trường, bìa sách, story.</p>
                  </div>
                  {/* Tiết 6 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 6</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">Khởi tạo E-Portfolio</h4>
                    <p className="text-xs text-slate-400 mt-1">Thiết kế trang giới thiệu cá nhân (About me) và trang giới thiệu dự án lý do tại sao em lập Portfolio này.</p>
                  </div>
                  {/* Tiết 7 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 7 - 8</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">AI trong Văn học & Toán học</h4>
                    <p className="text-xs text-slate-400 mt-1">Dùng AI tóm tắt văn học, phân tích thơ Việt Bắc/Đồng chí. Giải phương trình toán và lý giải hiện tượng ảo ảnh quang học vật lý.</p>
                  </div>
                  {/* Tiết 9 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 9 - 10</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">AI trong Tiếng Anh & KHXH</h4>
                    <p className="text-xs text-slate-400 mt-1">Luyện nói bằng Voice Mode với AI, làm bài tập sửa lỗi ngữ pháp. Dùng AI dựng dòng thời gian lịch sử và thiết kế Infographic.</p>
                  </div>
                  {/* Tiết 11 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 11 - 12</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">Hướng nghiệp & Tổng hợp liên môn</h4>
                    <p className="text-xs text-slate-400 mt-1">Tương tác khám phá nghề nghiệp tương lai, dùng AI tư vấn viết CV. Kiểm kê toàn bộ sản phẩm và tuyển chọn "Prompt Vàng".</p>
                  </div>
                  {/* Tiết 13 - 14 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 13 - 14</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">Portfolio Development Studio</h4>
                    <p className="text-xs text-slate-400 mt-1">Lắp ráp các sản phẩm liên môn, thiết kế khung giao diện Canva đẹp mắt, thống nhất phong cách chuyên nghiệp.</p>
                  </div>
                  {/* Tiết 15 - 18 */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-xs text-orange-500 font-bold font-mono">Tiết 15 - 18</span>
                    <h4 className="font-semibold text-white mt-1 text-sm">Peer Review & Showcase</h4>
                    <p className="text-xs text-slate-400 mt-1">Thực hiện đánh giá chéo bài học, viết bài luận "Triết lý AI cá nhân" (600-800 từ) và tổ chức triển lãm Portfolio Expo.</p>
                  </div>
                </div>
              </div>

              {/* FPT Specific tips */}
              <div className="border-t border-slate-800 pt-6">
                <h3 className="text-lg font-bold text-white font-display mb-3">Lưu ý quan trọng từ Giảng viên (QuanLHK - FSC Hậu Giang):</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Sai lầm học sinh dễ mắc phải:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Xem AI là "máy giải bài tập" tuyệt đối mà bỏ qua khâu kiểm chứng độc lập.</li>
                      <li>Quên lưu lại câu lệnh và kết quả (minh chứng) ngay khi thực hành gây thiếu hụt dữ liệu khi làm Portfolio.</li>
                      <li>Hiểu nhầm Peer Review là bắt lỗi hoặc chấm điểm hạ thấp lẫn nhau.</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-400 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" /> Giải pháp và Mẹo dạy học:
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-400">
                      <li>Luôn chuẩn bị "Prompt mẫu V1" (sơ sài) làm đòn bẩy yêu cầu học sinh nâng cấp lên V2 theo RCTFC.</li>
                      <li>Rèn luyện tư duy phản biện qua việc giáo viên cố tình đưa ra các kết quả sai hoặc ảo giác của AI cho học sinh tìm kiếm.</li>
                      <li>Nhắc nhở học sinh cập nhật Prompt Journal ngay sau mỗi buổi thực hành để tích lũy dần.</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* STUDY / INTERACTIVE STEPS TAB */
          <div className="flex flex-col gap-6">
            
            {/* Horizontal Station Stepper */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-wrap justify-between items-center gap-2 shadow-xl">
              {[
                { step: 1, name: "Trạm 1: Khởi Động", icon: Sparkles },
                { step: 2, name: "Trạm 2: Khám Phá", icon: HelpCircle },
                { step: 3, name: "Trạm 3: Phân Tích", icon: Brain },
                { step: 4, name: "Trạm 4: Kết Nối", icon: ListTodo },
                { step: 5, name: "Trạm 5: Tổng Kết", icon: Award }
              ].map(s => {
                const Icon = s.icon;
                const isSelected = activeStation === s.step;
                const isCompleted = activeStation > s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => setActiveStation(s.step)}
                    className={`flex-1 min-w-[150px] py-3 px-4 rounded-2xl flex items-center gap-2.5 transition-all duration-300 font-display ${
                      isSelected 
                        ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold shadow-md shadow-orange-600/10" 
                        : isCompleted
                        ? "bg-slate-950 text-orange-400 border border-slate-800/80 hover:bg-slate-900"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-950"
                    }`}
                  >
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isSelected 
                        ? "bg-white text-orange-600" 
                        : isCompleted
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-slate-800 text-slate-400"
                    }`}>
                      {s.step}
                    </div>
                    <span className="text-sm truncate">{s.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Station Workspace */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 min-h-[500px] shadow-2xl flex flex-col justify-between">
              
              {/* STATION 1: WARMUP */}
              {activeStation === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-500 font-display">TIẾT 1: KHỞI ĐỘNG</span>
                      <h2 className="text-2xl font-bold text-white font-display mt-2">AI Đang Ở Quanh Bạn</h2>
                      <p className="text-slate-400 text-sm mt-1">Khám phá vai trò của Trí tuệ nhân tạo trong học tập và đời sống.</p>
                    </div>
                    {/* FPT badge branding */}
                    <div className="text-right hidden md:block">
                      <span className="text-[11px] font-mono text-slate-500 block">FPT Schools | SMART Program</span>
                      <span className="text-xs font-bold text-orange-500 font-mono">[AI]/[10] Lớp 10</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mt-4">
                    {/* Left: Interactive Survey / Prompt to Gemini */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col justify-between gap-4">
                      <div className="space-y-4">
                        <label className="text-sm font-semibold text-slate-300 block">
                          Câu hỏi khảo sát: Em đã từng sử dụng hoặc quan sát thấy công nghệ AI trong hoạt động nào dưới đây?
                        </label>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {["Viết luận văn", "Tạo ảnh nghệ thuật", "Luyện ngoại ngữ", "Dịch thuật thông minh", "Giải toán nhanh", "Mô phỏng giọng nói"].map(act => (
                            <button
                              key={act}
                              onClick={() => setWarmupActivity(act)}
                              className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all duration-300 ${
                                warmupActivity === act 
                                  ? "bg-orange-500/10 border-orange-500 text-orange-400 shadow-md shadow-orange-500/5" 
                                  : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                              }`}
                            >
                              {act}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-2 pt-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Chia sẻ nhanh kỳ vọng hoặc suy nghĩ ngắn gọn của em (Tùy chọn):</label>
                          <input
                            type="text"
                            placeholder="Ví dụ: Em muốn dùng AI viết bài văn phân tích bài thơ Đồng chí..."
                            value={warmupThought}
                            onChange={(e) => setWarmupThought(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all duration-300"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleWarmupSubmit}
                        disabled={isWarmupLoading}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                      >
                        {isWarmupLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Đang kết nối với FPT AI Assistant...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Xem FPT AI Assistant Phản Hồi
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right: Simulated Video Player & AI Response */}
                    <div className="flex flex-col gap-4">
                      {/* Interactive Real-time Gemini Response */}
                      <div className="flex-1 bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col">
                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                          <Sparkles className="h-5 w-5 text-orange-500" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider font-display">Lời khuyên của FPT AI Assistant</span>
                        </div>
                        {warmupResponse ? (
                          <div className="text-sm text-slate-300 leading-relaxed overflow-y-auto max-h-[160px] pr-2">
                            {warmupResponse}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-xs flex flex-col items-center justify-center flex-1 text-center py-6">
                            <Brain className="h-8 w-8 mb-2 opacity-30 text-orange-500" />
                            <p>Chọn hoạt động và viết suy nghĩ của em ở ô bên trái, sau đó nhấn gửi để nhận phản hồi tương tác thời gian thực từ Gemini!</p>
                          </div>
                        )}
                      </div>

                      {/* Mockup Video Hook */}
                      <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-850 flex items-center gap-4">
                        <div className="bg-slate-900 border border-slate-800 h-24 w-36 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 relative group">
                          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="text-[10px] uppercase tracking-widest text-orange-500 font-bold font-mono">Video Hook</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-xs">Video Hook: Trải nghiệm Thế giới thông minh</h4>
                          <p className="text-[11px] text-slate-400 mt-1">Xem video tư liệu ngắn (8 phút) về tầm quan trọng của tư duy đồng hành và làm chủ công nghệ AI một cách có trách nhiệm.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATION 2: GAME (AI HAY CON NGUOI) */}
              {activeStation === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-500 font-display">TIẾT 1 - HOẠT ĐỘNG 2</span>
                      <h2 className="text-2xl font-bold text-white font-display mt-2">Game: AI Hay Con Người?</h2>
                      <p className="text-slate-400 text-sm mt-1">Đọc kỹ tác phẩm hoặc quan sát và đoán xem đâu là sản phẩm do AI hay Con người sáng tác.</p>
                    </div>
                    {/* Game progress bar */}
                    <div className="text-right">
                      <span className="text-xs text-orange-400 font-bold font-mono">Vòng {gameRound} / {gameRounds.length}</span>
                      <div className="w-24 h-1.5 bg-slate-850 rounded-full mt-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 transition-all duration-300"
                          style={{ width: `${(gameRound / gameRounds.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850">
                    <p className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {gameRounds[gameRound - 1].prompt}
                    </p>
                  </div>

                  {/* Two choices layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    {/* Option A Card */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-slate-400">PHƯƠNG ÁN A</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono">Mẫu 1</span>
                        </div>
                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850/80 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line min-h-[120px]">
                          {gameRounds[gameRound - 1].textA}
                        </div>
                      </div>

                      <button
                        onClick={() => !hasGuessed && handleGuessSelection("A")}
                        disabled={hasGuessed}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                          selectedGuess === "A" 
                            ? gameRounds[gameRound - 1].correct === "A" 
                              ? "bg-green-600 text-white" 
                              : "bg-red-600 text-white"
                            : hasGuessed
                            ? "bg-slate-900 text-slate-500 border border-slate-800"
                            : "bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        {selectedGuess === "A" 
                          ? gameRounds[gameRound - 1].correct === "A" ? "✓ CHÍNH XÁC (CON NGƯỜI)" : "✗ SAI RỒI (AI TẠO)"
                          : "Đoán đây là AI"}
                      </button>
                    </div>

                    {/* Option B Card */}
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 flex flex-col justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xs font-bold text-slate-400">PHƯƠNG ÁN B</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-400 font-mono">Mẫu 2</span>
                        </div>
                        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850/80 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line min-h-[120px]">
                          {gameRounds[gameRound - 1].textB}
                        </div>
                      </div>

                      <button
                        onClick={() => !hasGuessed && handleGuessSelection("B")}
                        disabled={hasGuessed}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                          selectedGuess === "B" 
                            ? gameRounds[gameRound - 1].correct === "B" 
                              ? "bg-green-600 text-white" 
                              : "bg-red-600 text-white"
                            : hasGuessed
                            ? "bg-slate-900 text-slate-500 border border-slate-800"
                            : "bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300"
                        }`}
                      >
                        {selectedGuess === "B" 
                          ? gameRounds[gameRound - 1].correct === "B" ? "✓ CHÍNH XÁC (AI TẠO)" : "✗ SAI RỒI (CON NGƯỜI)"
                          : "Đoán đây là AI"}
                      </button>
                    </div>
                  </div>

                  {/* Feedback Report Box */}
                  {hasGuessed && (
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-850 animate-fade-in space-y-4">
                      <div className="space-y-2 border-b border-slate-800 pb-3">
                        <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-orange-500">Lời giải từ tài liệu FPT:</span>
                        <p className="text-xs text-slate-300">{gameRounds[gameRound - 1].detail}</p>
                      </div>

                      {/* Interactive Gemini AI Evaluation */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider font-mono text-cyan-400 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5" />
                          Nhận xét chi tiết từ FPT AI Assistant (Gemini):
                        </span>
                        {isGameLoading ? (
                          <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
                            <RefreshCw className="h-4.5 w-4.5 animate-spin text-orange-500" />
                            <span>Gemini đang phân tích sắc thái cảm xúc và thuật toán sáng tạo...</span>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">{gameResponse}</p>
                        )}
                      </div>

                      {/* Navigation next round */}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={handleNextRound}
                          className="bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 text-orange-400 px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5"
                        >
                          Lượt Tiếp Theo
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* STATION 3: HALLUCINATION (SAN LOI AI) */}
              {activeStation === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-500 font-display">TIẾT 1 - HOẠT ĐỘNG 3</span>
                      <h2 className="text-2xl font-bold text-white font-display mt-2">Xưởng Săn Lỗi AI (Ảo giác)</h2>
                      <p className="text-slate-400 text-sm mt-1">Đánh giá và kiểm chứng lỗi sai thực tế mà AI hay mắc phải khi học tập.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-4">
                    {/* Left selections */}
                    <div className="lg:col-span-4 flex flex-col gap-3">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Chọn lỗi AI thường gặp:</span>
                      {hallucinationCases.map(c => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedHallucination(c.id);
                            setCustomHallucinationText(c.text);
                            setHallucinationReport("");
                          }}
                          className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all duration-300 ${
                            selectedHallucination === c.id
                              ? "bg-orange-500/10 border-orange-500 text-orange-400 shadow-md shadow-orange-500/5"
                              : "bg-slate-950 border-slate-850 text-slate-400 hover:border-slate-800 hover:text-slate-200"
                          }`}
                        >
                          <div className="font-bold font-display text-[13px] mb-1">{c.title}</div>
                          <span className="text-[11px] text-slate-500 font-normal line-clamp-1">{c.text}</span>
                        </button>
                      ))}
                    </div>

                    {/* Middle custom text box & Run button */}
                    <div className="lg:col-span-8 bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col justify-between gap-5">
                      <div className="space-y-4">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Nội dung câu trả lời bị lỗi của AI để phân tích:</label>
                        <textarea
                          rows={4}
                          value={customHallucinationText}
                          onChange={(e) => setCustomHallucinationText(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed resize-none"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleHallucinationVerify}
                        disabled={isHallucinationLoading}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                      >
                        {isHallucinationLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Đang chuẩn bị báo cáo kiểm chứng độc lập...
                          </>
                        ) : (
                          <>
                            <Brain className="h-4 w-4" />
                            Săn lỗi cùng AI & Xuất báo cáo kiểm chứng (Gemini)
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Real-time Verification Report (SLOs LO2) */}
                  {hallucinationReport && (
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 animate-fade-in space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-display">Báo Cáo Săn Lỗi AI (SLOs LO2 - Kiểm Chứng Độc Lập)</span>
                      </div>
                      
                      <div className="text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-line space-y-4">
                        {hallucinationReport}
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* STATION 4: PROMPT ENGINEERING & JOURNAL */}
              {activeStation === 4 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-500 font-display">TIẾT 4: WRITING PROMPTS EFFECTIVELY</span>
                      <h2 className="text-2xl font-bold text-white font-display mt-2">Bộ Máy Đánh Giá & Tối Ưu RCTFC Prompt</h2>
                      <p className="text-slate-400 text-sm mt-1">Viết Prompt V1 sơ sài, Gemini sẽ chấm điểm và tối ưu hóa thành Prompt V2 cực mạnh rồi lưu vào Journal của em.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mt-4">
                    {/* Left inputs */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-5">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Môn học / Chủ đề:</label>
                        <select
                          value={promptSubject}
                          onChange={(e) => setPromptSubject(e.target.value)}
                          className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 transition-all duration-300"
                        >
                          <option value="Toán học">Toán học</option>
                          <option value="Ngữ văn">Ngữ văn</option>
                          <option value="Khoa học tự nhiên">Khoa học tự nhiên</option>
                          <option value="Tiếng Anh">Tiếng Anh</option>
                          <option value="Sáng tạo & Đời sống">Sáng tạo & Đời sống</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Hãy nhập Prompt V1 của em (Ví dụ Prompt sơ sài):</label>
                        <textarea
                          rows={4}
                          placeholder="Ví dụ: Giải thích quang hợp, hoặc Tóm tắt Chí Phèo..."
                          value={promptInput}
                          onChange={(e) => setPromptSubjectInput(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed resize-none"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleEvaluatePrompt}
                        disabled={isPromptLoading || !promptInput.trim()}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                      >
                        {isPromptLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Đang thẩm định Prompt theo RCTFC...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Chấm Điểm & Nâng Cấp Lên Prompt V2 (Gemini)
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right feedback output */}
                    <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 flex flex-col min-h-[300px] justify-between">
                      {evaluatedResult ? (
                        <div className="space-y-4 animate-fade-in flex-1">
                          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                            <span className="text-xs font-bold text-white uppercase tracking-wider font-display">Kết Quả Thẩm Định Prompt</span>
                            <div className="flex items-center gap-1 text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-1 rounded text-xs font-mono font-bold">
                              Điểm RCTFC: {evaluatedResult.score} / 5
                            </div>
                          </div>

                          <div className="space-y-3 overflow-y-auto max-h-[220px] pr-2 text-xs">
                            <p className="text-slate-300"><strong className="text-orange-400">Nhận xét:</strong> {evaluatedResult.feedback}</p>
                            <p className="text-slate-300"><strong className="text-orange-400">Yếu tố thiếu:</strong> {evaluatedResult.missingElements.join(", ") || "Không thiếu"}</p>
                            <p className="text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800 font-mono text-[11px] leading-relaxed"><strong className="text-cyan-400 block mb-1">Prompt V2 Tối Ưu (RCTFC):</strong> {evaluatedResult.improvedPromptV2}</p>
                            <p className="text-slate-400 italic">({evaluatedResult.explanation})</p>
                          </div>

                          <button
                            onClick={saveToPromptJournal}
                            className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs"
                          >
                            <Plus className="h-4 w-4" />
                            Lưu Prompt V2 vào Nhật Ký Prompt Journal
                          </button>
                        </div>
                      ) : (
                        <div className="text-slate-500 text-xs flex flex-col items-center justify-center flex-1 text-center py-12">
                          <Brain className="h-8 w-8 mb-2 opacity-30 text-orange-500" />
                          <p>Nhập câu lệnh của em ở cột bên trái và bấm nâng cấp. Trợ lý Gemini sẽ chấm điểm RCTFC (Role, Context, Task, Format, Constraint) và viết lại Prompt V2 hoàn hảo cho em!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Prompt Journal Table (LO1) */}
                  <div className="bg-slate-950 p-6 rounded-2xl border border-slate-850 animate-fade-in space-y-4 mt-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-orange-500" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider font-display">Nhật Ký Prompt Engineering (Tối thiểu 20 Prompt - SLOs LO1)</span>
                      </div>
                      <span className="px-2 py-1 rounded text-xs bg-slate-900 border border-slate-800 text-slate-400 font-mono font-bold">
                        Đã có: {promptJournal.length} / 20 Prompt
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-bold font-display uppercase tracking-wider">
                            <th className="py-3 px-2">Môn</th>
                            <th className="py-3 px-4 w-1/4">Prompt V1 (Sơ sài)</th>
                            <th className="py-3 px-4 w-2/5">Prompt V2 (Đầy đủ RCTFC)</th>
                            <th className="py-3 px-2 text-center">Điểm</th>
                            <th className="py-3 px-2 text-right">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-850">
                          {promptJournal.map((entry, idx) => (
                            <tr key={entry.id} className="hover:bg-slate-900/40 transition-all duration-200">
                              <td className="py-3 px-2 font-semibold text-orange-400">{entry.subject}</td>
                              <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate">{entry.promptV1}</td>
                              <td className="py-3 px-4 text-slate-200 font-mono text-[11px] select-all bg-slate-900/30 p-2 rounded border border-slate-850/50">{entry.promptV2}</td>
                              <td className="py-3 px-2 text-center font-bold text-cyan-400 font-mono">{entry.score}/5</td>
                              <td className="py-3 px-2 text-right">
                                <button
                                  onClick={() => deleteJournalEntry(entry.id)}
                                  className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-all duration-200"
                                  title="Xóa dòng"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* STATION 5: REFLECTION & ESSAY */}
              {activeStation === 5 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                    <div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-500/10 border border-orange-500/20 text-orange-500 font-display">TIẾT 15 - 16: TỔNG KẾT & PHẢN TƯ</span>
                      <h2 className="text-2xl font-bold text-white font-display mt-2">Kiểm Tra Nhanh & Viết Triết Lý AI Cá Nhân</h2>
                      <p className="text-slate-400 text-sm mt-1">Kiểm tra củng cố kiến thức môn học và viết nháp bài luận suy ngẫm (600 - 800 từ) về triết lý sử dụng AI có trách nhiệm.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-4">
                    {/* Left: Mini Quiz */}
                    <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-5">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                        <HelpCircle className="h-5 w-5 text-orange-500" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-display">Trắc Nghiệm Củng Cố Kiến Thức</span>
                      </div>

                      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                        {quizQuestions.map((q, idx) => (
                          <div key={q.id} className="space-y-2 text-xs border-b border-slate-900 pb-4">
                            <p className="font-bold text-slate-200">{idx + 1}. {q.q}</p>
                            <div className="space-y-1.5 pl-2">
                              {Object.entries(q.options).map(([key, value]) => {
                                const isSelected = quizAnswers[q.id] === key;
                                return (
                                  <button
                                    key={key}
                                    onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: key })}
                                    disabled={quizSubmitted}
                                    className={`w-full text-left p-2.5 rounded-xl border text-[11px] transition-all duration-200 flex items-center gap-2 ${
                                      isSelected
                                        ? "bg-orange-500/10 border-orange-500 text-orange-400 font-semibold"
                                        : "bg-slate-900/60 border-slate-850/80 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                                    }`}
                                  >
                                    <span className="h-5 w-5 bg-slate-850 border border-slate-700 text-slate-400 font-mono rounded flex items-center justify-center font-bold text-[10px]">{key}</span>
                                    <span className="flex-1">{value}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="mt-2 p-2 bg-slate-900/80 rounded border border-slate-850 text-[11px] text-slate-400 leading-relaxed font-sans">
                                <span className={`font-bold ${quizAnswers[q.id] === q.correct ? "text-green-500" : "text-red-500"}`}>
                                  {quizAnswers[q.id] === q.correct ? "✓ ĐÚNG: " : `✗ SAI (Đáp án đúng: ${q.correct}): `}
                                </span>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {!quizSubmitted ? (
                        <button
                          onClick={() => setQuizAnswersSubmitted(true)}
                          disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                          className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 text-xs flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Nộp Bài Trắc Nghiệm
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setQuizAnswers({});
                            setQuizAnswersSubmitted(false);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 text-slate-300 py-2.5 px-4 rounded-xl hover:bg-slate-850 transition-all duration-300 text-xs flex items-center justify-center gap-1.5"
                        >
                          Làm Lại Quiz
                        </button>
                      )}
                    </div>

                    {/* Right: Essay Draft Evaluator */}
                    <div className="lg:col-span-7 bg-slate-950 p-6 rounded-2xl border border-slate-850 space-y-4">
                      <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                        <FileText className="h-5 w-5 text-orange-500" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-display">Bản Nháp Bài Luận Triết Lý AI Cá Nhân (SLOs LO5)</span>
                      </div>

                      {/* Direction instructions */}
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 text-[10px] text-slate-400 leading-relaxed">
                        <strong className="text-orange-400 block mb-1">Định hướng viết bài luận cuối khóa (600 - 800 từ):</strong>
                        Em cần trả lời các câu hỏi: (1) AI đã giúp em học tập những môn học nào? (2) Nhận biết các lỗi/ảo giác (hallucination) của AI? (3) Những kỹ năng cốt lõi nào con người vẫn cần có (tình cảm, tư duy phản biện)? (4) Định hướng sử dụng AI có trách nhiệm trong tương lai.
                      </div>

                      <div className="space-y-2">
                        <textarea
                          rows={6}
                          placeholder="Viết bản nháp bài luận triết lý AI của em tại đây..."
                          value={essayDraft}
                          onChange={(e) => setEssayDraft(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed"
                        ></textarea>
                      </div>

                      <button
                        onClick={handleEvaluateEssay}
                        disabled={isEssayLoading || !essayDraft.trim()}
                        className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-3 px-4 rounded-xl hover:from-orange-500 hover:to-orange-400 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                      >
                        {isEssayLoading ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Đang nhờ Gemini thẩm định bài luận...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Kiểm Tra & Nhận Xét Bài Luận Phản Tư (Gemini)
                          </>
                        )}
                      </button>

                      {/* Gemini essay coach output */}
                      {essayReport && (
                        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 animate-fade-in text-[11px] leading-relaxed text-slate-300 font-mono whitespace-pre-line max-h-[180px] overflow-y-auto">
                          {essayReport}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Station Progress Footer Nav */}
              <div className="border-t border-slate-800 pt-5 mt-6 flex justify-between items-center text-xs">
                <button
                  disabled={activeStation === 1}
                  onClick={() => setActiveStation(activeStation - 1)}
                  className="bg-slate-950 border border-slate-850 hover:bg-slate-900 px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Trạm Trước
                </button>
                <span className="text-slate-500 font-mono">Trạm {activeStation} / 5</span>
                <button
                  disabled={activeStation === 5}
                  onClick={() => setActiveStation(activeStation + 1)}
                  className="bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 text-orange-400 px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Trạm Tiếp Theo
                </button>
              </div>

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-slate-500 text-xs py-6 px-4 text-center mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 FPT Schools. Hệ thống học tập Trải nghiệm Thế giới thông minh (SMART) lớp 10.</p>
          <div className="flex items-center gap-4 font-mono text-[10px] text-slate-600">
            <span>Dự án: Portfolio Khám phá AI của Tôi</span>
            <span>|</span>
            <span className="text-orange-500/80 font-semibold">Designed by QuanLHK with Vibe Coding</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
