"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaPlay, FaSpinner, FaEdit, FaSave, FaTimes, FaRedo } from "react-icons/fa";

interface InteractiveJupyterCellProps {
    initialCode: string;
    compilerApiUrl?: string;
}

interface ExecutionResult {
    status: string;
    stdout: string;
    stderr: string;
    time_ms: number;
    memory_kb: number;
    session_id?: string;
    outputs?: Array<{
        type: string;
        name?: string;
        text?: string;
        data?: Record<string, string>;
        ename?: string;
        evalue?: string;
        traceback?: string[];
    }>;
}

const InteractiveJupyterCell = ({
    initialCode,
    compilerApiUrl = process.env.NEXT_PUBLIC_COMPILER_API_URL ||
    (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/v1$/, "")}/api/v1/lms/execute/` : "http://localhost:8000/api/v1/lms/execute/")
}: InteractiveJupyterCellProps) => {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [executionMemory, setExecutionMemory] = useState<number | null>(null);
    const [executionCount, setExecutionCount] = useState<number>(0);

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [richOutputs, setRichOutputs] = useState<NonNullable<ExecutionResult['outputs']>>([]);

    const runCode = async () => {
        setIsRunning(true);
        setError(null);
        setOutput("");
        setRichOutputs([]);
        setExecutionTime(null);
        setExecutionMemory(null);

        try {
            const response = await fetch(compilerApiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language_id: "jupyter", // Use jupyter for stateful execution
                    source_code: code,
                    session_id: sessionId,
                    input: "",
                    time_limit_ms: 30000, // Jupyter might take longer
                    memory_limit_mb: 512,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result: ExecutionResult = await response.json();

            if (result.session_id) {
                setSessionId(result.session_id);
            }

            if (result.status === "OK") {
                setExecutionCount(prev => prev + 1);
                if (result.outputs) {
                    setRichOutputs(result.outputs);
                } else {
                    setOutput(result.stdout || "(No output)");
                }
                setExecutionTime(result.time_ms);
                setExecutionMemory(result.memory_kb);
            } else if (result.status === "RTE") {
                if (result.outputs) {
                    setRichOutputs(result.outputs);
                } else {
                    setError(`Runtime Error:\n${result.stderr || "Unknown error"}`);
                }
            } else {
                setError(`Error (${result.status}):\n${result.stderr}`);
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? `Connection Error: ${err.message}\n\nMake sure the compiler server is running at ${compilerApiUrl}`
                    : "Unknown error occurred"
            );
        } finally {
            setIsRunning(false);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const restartKernel = () => {
        setSessionId(null);
        setExecutionCount(0);
        setRichOutputs([]);
        setOutput("");
        setError(null);
    };

    const resetCode = () => {
        setCode(initialCode);
        setIsEditing(false);
        setOutput("");
        setError(null);
    };

    return (
        <div className="my-8 rounded-xl overflow-hidden shadow-2xl border border-[#30363d] bg-[#0d1117]">
            {/* Header */}
            <div className="bg-[#161b22] px-4 py-2 flex items-center justify-between border-b border-[#30363d]">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#8b949e] tracking-widest uppercase">
                            Interactive Jupyter Notebook
                        </span>
                        <div className="h-3 w-[1px] bg-[#30363d]" />
                        <span className="text-[10px] font-mono text-[#58a6ff]">Python 3.11</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={restartKernel}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#58a6ff] transition-all border border-[#30363d]"
                        title="Restart Kernel (Clear Variables)"
                    >
                        <FaRedo className="w-2.5 h-2.5" />
                        <span className="text-[9px] font-bold uppercase">Restart</span>
                    </button>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#238636]/10 border border-[#238636]/30">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#238636] animate-pulse" />
                        <span className="text-[9px] font-bold text-[#238636]">Live</span>
                    </div>
                </div>
            </div>

            {/* Code Input Area */}
            <div className="relative group">
                <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col items-center pt-4 border-r border-[#30363d]/30 bg-[#161b22]/30 pointer-events-none z-10">
                    <span className="text-[11px] font-mono text-[#58a6ff] opacity-60">In [{isRunning ? '*' : executionCount || ' '}]:</span>
                </div>

                <div className="pl-12 relative">
                    {isEditing ? (
                        <textarea
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full min-h-[200px] p-4 bg-[#0d1117] text-[#c9d1d9] font-mono text-sm leading-relaxed border-none outline-none resize-y"
                            style={{ fontFamily: "monospace" }}
                        />
                    ) : (
                        <SyntaxHighlighter
                            language="python"
                            style={vscDarkPlus}
                            customStyle={{
                                margin: 0,
                                padding: "1.25rem 1rem",
                                background: "transparent",
                                fontSize: "0.9rem",
                                lineHeight: "1.5",
                            }}
                        >
                            {code}
                        </SyntaxHighlighter>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-2 right-2 flex gap-2 z-20">
                    {isEditing ? (
                        <>
                            <button
                                onClick={toggleEdit}
                                className="p-2 rounded bg-[#238636] hover:bg-[#2ea043] text-white transition-colors"
                                title="Save"
                            >
                                <FaSave className="w-3 h-3" />
                            </button>
                            <button
                                onClick={resetCode}
                                className="p-2 rounded bg-[#da3633] hover:bg-[#f85149] text-white transition-colors"
                                title="Cancel"
                            >
                                <FaTimes className="w-3 h-3" />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={toggleEdit}
                            className="p-2 rounded bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-white transition-colors"
                            title="Edit Code"
                        >
                            <FaEdit className="w-3 h-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Run Button */}
            <div className="border-t border-[#30363d]/50 bg-[#161b22] px-4 py-3">
                <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF1744] to-[#ff4569] hover:from-[#ff4569] hover:to-[#FF1744] text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                    {isRunning ? (
                        <>
                            <FaSpinner className="w-4 h-4 animate-spin" />
                            <span>Running...</span>
                        </>
                    ) : (
                        <>
                            <FaPlay className="w-4 h-4" />
                            <span>Run Code</span>
                        </>
                    )}
                </button>
            </div>

            {/* Output Area */}
            {(output || error || richOutputs.length > 0) && (
                <div className="border-t border-[#30363d]/50 bg-[#0d1117]">
                    <div className="flex">
                        <div className="w-12 flex-shrink-0 pt-4 flex flex-col items-center border-r border-[#30363d]/30 bg-[#161b22]/10">
                            <span className="text-[11px] font-mono text-[#d73a49] opacity-60">Out [{executionCount}]:</span>
                        </div>
                        <div className="flex-grow p-4 max-h-[500px] overflow-auto custom-scrollbar">
                            <div className="text-[10px] text-[#8b949e] mb-2 font-sans uppercase tracking-tight opacity-50 flex items-center justify-between sticky top-0 bg-[#0d1117] z-10 py-1">
                                <span>Execution Output</span>
                                {executionTime !== null && executionTime > 0 && (
                                    <span className="text-[#58a6ff]">
                                        ⏱️ {executionTime}ms {executionMemory ? `| 💾 ${Math.round(executionMemory / 1024)}MB` : ''}
                                    </span>
                                )}
                            </div>

                            {error && (
                                <pre className="text-[#f85149] font-mono text-sm whitespace-pre-wrap selection:bg-[#f85149]/30">
                                    {error}
                                </pre>
                            )}

                            {output && (
                                <pre className="text-[#d1d5db] font-mono text-sm whitespace-pre-wrap selection:bg-[#58a6ff]/30">
                                    {output}
                                </pre>
                            )}

                            {richOutputs.map((out, idx) => (
                                <div key={idx} className="mb-2 last:mb-0">
                                    {out.type === 'stream' && (
                                        <pre className={`font-mono text-sm whitespace-pre-wrap ${out.name === 'stderr' ? 'text-[#f85149]' : 'text-[#d1d5db]'}`}>
                                            {out.text}
                                        </pre>
                                    )}
                                    {out.type === 'execute_result' && out.data && (
                                        <div className="text-[#d1d5db]">
                                            {out.data['text/plain'] && <pre className="font-mono text-sm whitespace-pre-wrap">{out.data['text/plain']}</pre>}
                                            {out.data['image/png'] && (
                                                <img
                                                    src={`data:image/png;base64,${out.data['image/png']}`}
                                                    alt="Jupyter Output"
                                                    className="max-w-full h-auto bg-white rounded-md my-2"
                                                />
                                            )}
                                        </div>
                                    )}
                                    {out.type === 'display_data' && out.data && (
                                        <div className="text-[#d1d5db]">
                                            {out.data['text/plain'] && <pre className="font-mono text-sm">{out.data['text/plain']}</pre>}
                                            {out.data['image/png'] && (
                                                <img
                                                    src={`data:image/png;base64,${out.data['image/png']}`}
                                                    alt="Jupyter Display"
                                                    className="max-w-full h-auto bg-white rounded-md my-2"
                                                />
                                            )}
                                        </div>
                                    )}
                                    {out.type === 'error' && (
                                        <div className="text-[#f85149] font-mono text-sm whitespace-pre-wrap bg-[#f85149]/5 p-2 rounded border border-[#f85149]/20">
                                            <div className="font-bold mb-1">{out.ename}: {out.evalue}</div>
                                            {out.traceback && out.traceback.map((line, i) => (
                                                <div key={i} className="opacity-80">{line}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteractiveJupyterCell;
