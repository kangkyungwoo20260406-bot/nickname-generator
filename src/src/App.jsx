import { useState } from "react";

const platforms = [
  { id: "instagram", label: "Instagram", emoji: "📸", color: "#E1306C" },
  { id: "facebook", label: "Facebook", emoji: "👤", color: "#1877F2" },
  { id: "youtube", label: "YouTube", emoji: "▶️", color: "#FF0000" },
  { id: "tiktok", label: "TikTok", emoji: "🎵", color: "#69C9D0" },
  { id: "twitter", label: "X / Twitter", emoji: "🐦", color: "#1DA1F2" },
  { id: "twitch", label: "Twitch", emoji: "🎮", color: "#9146FF" },
];
const moods = [
  { id: "cute", label: "귀여운 🌸" },
  { id: "cool", label: "쿨한 😎" },
  { id: "aesthetic", label: "감성적 🌙" },
  { id: "funny", label: "재미있는 😂" },
  { id: "professional", label: "전문적 💼" },
  { id: "mysterious", label: "신비로운 🌟" },
];
export default function App() {
  const [tab, setTab] = useState("nickname");
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedMoods, setSelectedMoods] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [myName, setMyName] = useState("");
  const [idMoods, setIdMoods] = useState([]);
  const [idKeyword, setIdKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState("");
  const togglePlatform = (id) => setSelectedPlatforms((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleMood = (id) => setSelectedMoods((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleIdMood = (id) => setIdMoods((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const generate = async () => {
    if (tab === "nickname" && selectedPlatforms.length === 0) { setError("플랫폼을 선택해주세요!"); return; }
    setError(""); setLoading(true); setResults([]);
    const pm = selectedPlatforms.map((id) => platforms.find((p) => p.id === id)?.label).join(", ") || "소셜미디어";
    const mm = selectedMoods.length > 0 ? selectedMoods.map((id) => moods.find((m) => m.id === id)?.label).join(", ") : "자유로운";
    const im = idMoods.length > 0 ? idMoods.map((id) => moods.find((m) => m.id === id)?.label).join(", ") : "자유로운";
    const prompt = tab === "nickname"
      ? `소셜미디어 닉네임 전문가로서 한국어 닉네임 20개 생성.\n플랫폼:${pm}\n분위기:${mm}\n키워드:${keyword||"자유"}\n규칙:한글만,영어금지,2~6글자\nJSON만: {"nicknames":[{"name":"닉네임","reason":"이유"}]}`
      : `인스타 아이디 전문가로서 영어 아이디 20개 생성.\n이름힌트:${myName||"없음"}\n분위기:${im}\n키워드:${idKeyword||"없음"}\n규칙:영소문자/숫자/_/.만,15자이하,이름티안나게,자연스럽게\n예:vibe.log/_.moonlit/nxght.r\nJSON만: {"nicknames":[{"name":"아이디","reason":"이유"}]}`;
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] }),
      });
      const data = await res.json();
      const text = data.content.map((i) => i.text || "").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResults(parsed.nicknames || []);
    } catch { setError("오류가 났어요. 다시 시도해주세요! 😅"); }
    finally { setLoading(false); }
  };
  const copy = (n) => { navigator.clipboard.writeText(n); setCopied(n); setTimeout(() => setCopied(null), 2000); };
  const switchTab = (t) => { setTab(t); setResults([]); setError(""); };
  const S = { minHeight:"100vh",background:"linear-gradient(135deg,#0f0f1a,#1a0f2e,#0f1a1a)",fontFamily:"Georgia,serif",color:"#f0e6ff" };
  const W = { maxWidth:"680px",margin:"0 auto",padding:"40px 20px 80px" };
  return (
    <div style={S}><div style={W}>
      <div style={{textAlign:"center",marginBottom:"36px"}}>
        <div style={{fontSize:"48px",marginBottom:"12px"}}>✨</div>
        <h1 style={{fontSize:"clamp(28px,6vw,42px)",fontWeight:"800",background:"linear-gradient(135deg,#c084fc,#f472b6,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",margin:"0 0 8px"}}>닉네임 생성기</h1>
        <p style={{color:"#a78bfa",fontSize:"15px",margin:0}}>나만의 완벽한 닉네임을 AI가 만들어드려요</p>
      </div>
      <div style={{display:"flex",gap:"8px",marginBottom:"28px",background:"rgba(255,255,255,0.04)",borderRadius:"20px",padding:"6px",border:"1px solid rgba(192,132,252,0.15)"}}>
        {[["nickname","🏷️ 한글 닉네임"],["username","🔑 영어 아이디"]].map(([t,l])=>(
          <button key={t} onClick={()=>switchTab(t)} style={{flex:1,padding:"12px",borderRadius:"14px",border:"none",background:tab===t?"linear-gradient(135deg,#9333ea,#ec4899)":"transparent",color:tab===t?"#fff":"#a78bfa",cursor:"pointer",fontSize:"14px",fontWeight:"700"}}>{l}</button>
        ))}
      </div>
      {tab==="nickname"?(
        <>
          <Box title="📱 플랫폼 선택" sub="사용할 플랫폼을 골라주세요">
            <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
              {platforms.map((p)=>(<button key={p.id} onClick={()=>togglePlatform(p.id)} style={{padding:"10px 18px",borderRadius:"40px",border:selectedPlatforms.includes(p.id)?`2px solid ${p.color}`:"2px solid rgba(255,255,255,0.1)",background:selectedPlatforms.includes(p.id)?`${p.color}22`:"rgba(255,255,255,0.04)",color:selectedPlatforms.includes(p.id)?"#fff":"#a78bfa",cursor:"pointer",fontSize:"14px",fontWeight:"600",display:"flex",alignItems:"center",gap:"6px"}}><span>{p.emoji}</span>{p.label}</button>))}
            </div>
          </Box>
          <Box title="🎨 분위기 선택" sub="원하는 느낌을 골라주세요">
            <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
              {moods.map((m)=>(<button key={m.id} onClick={()=>toggleMood(m.id)} style={{padding:"10px 18px",borderRadius:"40px",border:selectedMoods.includes(m.id)?"2px solid #c084fc":"2px solid rgba(255,255,255,0.1)",background:selectedMoods.includes(m.id)?"rgba(192,132,252,0.2)":"rgba(255,255,255,0.04)",color:selectedMoods.includes(m.id)?"#e9d5ff":"#a78bfa",cursor:"pointer",fontSize:"14px",fontWeight:"600"}}>{m.label}</button>))}
            </div>
          </Box>
          <Box title="💭 키워드" sub="본인을 표현하는 단어 (선택사항)">
            <Input value={keyword} onChange={setKeyword} placeholder="예: 고양이, 달, 커피..." />
          </Box>
        </>
      ):(
        <>
          <div style={{background:"rgba(225,48,108,0.08)",border:"1px solid rgba(225,48,108,0.25)",borderRadius:"14px",padding:"14px 18px",marginBottom:"20px"}}>
            <div style={{fontSize:"13px",color:"#f472b6",fontWeight:"700",marginBottom:"4px"}}>🔑 영어 아이디 추천</div>
            <div style={{fontSize:"13px",color:"#a78bfa"}}>이름 넣어도 티 안나게 만들어줘요!<br/><span style={{opacity:0.7}}>예: vibe.log / _.moonlit / nxght.r</span></div>
          </div>
          <Box title="👤 힌트 이름" sub="영어로 입력 (선택사항)">
            <Input value={myName} onChange={setMyName} placeholder="예: gabin, luna..." />
          </Box>
          <Box title="🎨 분위기 선택" sub="원하는 느낌을 골라주세요">
            <div style={{display:"flex",flexWrap:"wrap",gap:"10px"}}>
              {moods.map((m)=>(<button key={m.id} onClick={()=>toggleIdMood(m.id)} style={{padding:"10px 18px",borderRadius:"40px",border:idMoods.includes(m.id)?"2px solid #c084fc":"2px solid rgba(255,255,255,0.1)",background:idMoods.includes(m.id)?"rgba(192,132,252,0.2)":"rgba(255,255,255,0.04)",color:idMoods.includes(m.id)?"#e9d5ff":"#a78bfa",cursor:"pointer",fontSize:"14px",fontWeight:"600"}}>{m.label}</button>))}
            </div>
          </Box>
          <Box title="💭 키워드" sub="관심사나 콘셉트 (선택사항)">
            <Input value={idKeyword} onChange={setIdKeyword} placeholder="예: 여행, 음악, 패션..." />
          </Box>
        </>
      )}
      {error&&<div style={{background:"rgba(239,68,68,0.15)",border:"1px solid rgba(239,68,68,0.4)",borderRadius:"12px",padding:"12px 16px",color:"#fca5a5",marginBottom:"20px",fontSize:"14px"}}>{error}</div>}
      <button onClick={generate} disabled={loading} style={{width:"100%",padding:"18px",borderRadius:"20px",border:"none",background:loading?"rgba(192,132,252,0.3)":"linear-gradient(135deg,#9333ea,#ec4899)",color:"#fff",fontSize:"17px",fontWeight:"800",cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":"0 8px 32px rgba(147,51,234,0.4)",marginBottom:"40px"}}>
        {loading?"✨ 생성 중...":tab==="nickname"?"✨ 한글 닉네임 생성":"🔑 영어 아이디 생성"}
      </button>
      {results.length>0&&(
        <div>
          <h2 style={{fontSize:"20px",fontWeight:"700",color:"#c084fc",marginBottom:"20px",textAlign:"center"}}>{tab==="nickname"?"🏷️ 추천 닉네임":"🔑 추천 아이디"} {results.length}개</h2>
          <div style={{display:"grid",gap:"10px"}}>
            {results.map((r,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.04)",border:"1px solid rgba(192,132,252,0.2)",borderRadius:"16px",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"12px"}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:"18px",fontWeight:"700",color:"#e9d5ff",marginBottom:"3px"}}>{tab==="username"?`@${r.name}`:r.name}</div>
                  <div style={{fontSize:"12px",color:"#9f7aea",opacity:0.85}}>{r.reason}</div>
                </div>
                <button onClick={()=>copy(r.name)} style={{padding:"8px 16px",borderRadius:"30px",border:"1px solid rgba(192,132,252,0.4)",background:copied===r.name?"rgba(52,211,153,0.2)":"rgba(192,132,252,0.1)",color:copied===r.name?"#6ee7b7":"#c084fc",cursor:"pointer",fontSize:"13px",fontWeight:"600",whiteSpace:"nowrap"}}>
                  {copied===r.name?"✓ 복사됨":"복사"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div></div>
  );
}
function Input({value,onChange,placeholder}){
  return <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:"14px 18px",borderRadius:"16px",border:"2px solid rgba(192,132,252,0.3)",background:"rgba(255,255,255,0.05)",color:"#f0e6ff",fontSize:"15px",outline:"none",boxSizing:"border-box"}} onFocus={(e)=>(e.target.style.border="2px solid rgba(192,132,252,0.8)")} onBlur={(e)=>(e.target.style.border="2px solid rgba(192,132,252,0.3)")} />;
}
function Box({title,sub,children}){
  return <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid rgba(192,132,252,0.15)",borderRadius:"20px",padding:"24px",marginBottom:"20px"}}><div style={{marginBottom:"16px"}}><div style={{fontSize:"15px",fontWeight:"700",color:"#e9d5ff",marginBottom:"4px"}}>{title}</div><div style={{fontSize:"13px",color:"#7c3aed",opacity:0.9}}>{sub}</div></div>{children}</div>;
}
