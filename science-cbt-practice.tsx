import React, { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, ArrowLeft, BookOpen, Trophy, TimerReset, Download, Printer, Shuffle, Clock, Settings } from "lucide-react";

const questionBank = [
  {
    unit: "Scientific Investigation",
    question: "A scientist changes the amount of water a plant receives each day. What is the independent variable?",
    choices: ["Plant height", "Amount of water", "Type of soil", "Number of leaves"],
    answer: 1,
    explanation: "The independent variable is the factor the scientist changes.",
  },
  {
    unit: "Scientific Investigation",
    question: "Which tool would BEST measure the temperature of a liquid?",
    choices: ["Ruler", "Balance", "Thermometer", "Stopwatch"],
    answer: 2,
    explanation: "A thermometer measures temperature.",
  },
  {
    unit: "Light",
    question: "What happens when light reflects off a mirror?",
    choices: ["It bends", "It disappears", "It bounces back", "It slows down"],
    answer: 2,
    explanation: "Reflection is when light bounces off a surface.",
  },
  {
    unit: "Light",
    question: "A pencil appears bent in water because of:",
    choices: ["sound waves", "reflection", "refraction", "gravity"],
    answer: 2,
    explanation: "Refraction is the bending of light as it moves through different materials.",
  },
  {
    unit: "Sound",
    question: "Sound is produced by:",
    choices: ["gravity", "heat", "vibrations", "magnets"],
    answer: 2,
    explanation: "Sound is created when objects vibrate.",
  },
  {
    unit: "Sound",
    question: "Which material allows sound to travel the fastest?",
    choices: ["Air", "Water", "Empty space", "Metal"],
    answer: 3,
    explanation: "Sound travels fastest through solids like metal.",
  },
  {
    unit: "Energy",
    question: "A roller coaster at the top of a hill has mostly:",
    choices: ["sound energy", "kinetic energy", "electrical energy", "potential energy"],
    answer: 3,
    explanation: "Stored energy at the top of a hill is potential energy.",
  },
  {
    unit: "Energy",
    question: "Which object has kinetic energy?",
    choices: ["A parked car", "A sleeping dog", "A moving baseball", "A book on a shelf"],
    answer: 2,
    explanation: "Kinetic energy is the energy of motion.",
  },
  {
    unit: "Matter",
    question: "Which state of matter has a definite shape and volume?",
    choices: ["Liquid", "Gas", "Solid", "Plasma"],
    answer: 2,
    explanation: "Solids keep their shape and volume.",
  },
  {
    unit: "Matter",
    question: "Salt dissolved in water forms a:",
    choices: ["gas", "solution", "solid", "crystal"],
    answer: 1,
    explanation: "A solution is made when a substance dissolves in another substance.",
  },
  {
    unit: "Motion",
    question: "What force pulls objects toward Earth?",
    choices: ["Magnetism", "Friction", "Gravity", "Electricity"],
    answer: 2,
    explanation: "Gravity pulls objects toward Earth.",
  },
  {
    unit: "Motion",
    question: "A skateboard slows down because of:",
    choices: ["inertia", "gravity", "friction", "magnetism"],
    answer: 2,
    explanation: "Friction opposes motion and slows objects down.",
  },
  {
    unit: "Earth's Processes",
    question: "Which process breaks rocks into smaller pieces?",
    choices: ["Weathering", "Erosion", "Deposition", "Condensation"],
    answer: 0,
    explanation: "Weathering breaks rocks into smaller pieces.",
  },
  {
    unit: "Earth's Processes",
    question: "Water vapor cooling into clouds is called:",
    choices: ["evaporation", "precipitation", "condensation", "runoff"],
    answer: 2,
    explanation: "Condensation happens when water vapor cools and forms droplets.",
  },
  {
    unit: "Electricity",
    question: "Electricity flows best through:",
    choices: ["rubber", "plastic", "copper", "wood"],
    answer: 2,
    explanation: "Copper is a conductor, so electricity flows through it easily.",
  },
  {
    unit: "Electricity",
    question: "An open circuit will:",
    choices: ["allow electricity to flow", "stop electricity from flowing", "increase voltage", "create energy"],
    answer: 1,
    explanation: "An open circuit has a break, so electricity cannot flow.",
  },
  {
    unit: "Resources",
    question: "Which resource is renewable?",
    choices: ["Coal", "Oil", "Natural gas", "Sunlight"],
    answer: 3,
    explanation: "Sunlight is a renewable resource because it is naturally replaced.",
  },
  {
    unit: "Resources",
    question: "Which is a nonrenewable resource?",
    choices: ["Wind", "Water", "Solar energy", "Coal"],
    answer: 3,
    explanation: "Coal takes millions of years to form and cannot be replaced quickly.",
  },
];

const units = ["All Units", ...Array.from(new Set(questionBank.map((q) => q.unit)))];

// Shuffle function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function ScienceCbtPracticeApp() {
  const [selectedUnit, setSelectedUnit] = useState("All Units");
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [shuffledChoices, setShuffledChoices] = useState({});
  const [originalAnswerIndices, setOriginalAnswerIndices] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastChoice, setLastChoice] = useState(null);
  const [finished, setFinished] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [shuffleChoices, setShuffleChoicesOption] = useState(true);
  const [timerMode, setTimerMode] = useState(false);
  const [timeLimit, setTimeLimit] = useState(300); // 5 minutes default
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [questions, setQuestions] = useState([]);
  const timerIntervalRef = useRef(null);

  // Load saved progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("scienceCbtProgress");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSelectedUnit(data.selectedUnit);
        setRandomizeQuestions(data.randomizeQuestions);
        setShuffleChoicesOption(data.shuffleChoices);
        setTimerMode(data.timerMode);
        setTimeLimit(data.timeLimit);
      } catch (e) {
        console.error("Error loading saved progress:", e);
      }
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = () => {
    localStorage.setItem(
      "scienceCbtProgress",
      JSON.stringify({
        selectedUnit,
        randomizeQuestions,
        shuffleChoices,
        timerMode,
        timeLimit,
        currentIndex,
        answers,
        timestamp: new Date().toISOString(),
      })
    );
  };

  useEffect(() => {
    if (quizStarted) {
      saveProgress();
    }
  }, [currentIndex, answers, quizStarted]);

  // Initialize questions based on filters
  useMemo(() => {
    let filtered =
      selectedUnit === "All Units" ? questionBank : questionBank.filter((q) => q.unit === selectedUnit);

    if (randomizeQuestions) {
      filtered = shuffleArray(filtered);
    }

    setQuestions(filtered);
    initializeShuffledChoices(filtered);
  }, [selectedUnit, randomizeQuestions]);

  // Initialize shuffled choices for all questions
  const initializeShuffledChoices = (questionsToShuffle) => {
    const shuffled = {};
    const indices = {};

    questionsToShuffle.forEach((q, idx) => {
      if (shuffleChoices) {
        const choicesWithIndices = q.choices.map((choice, i) => ({ choice, originalIndex: i }));
        const shuffledChoicesWithIndices = shuffleArray(choicesWithIndices);
        shuffled[idx] = shuffledChoicesWithIndices.map((item) => item.choice);
        indices[idx] = shuffledChoicesWithIndices.map((item) => item.originalIndex);
      } else {
        shuffled[idx] = q.choices;
        indices[idx] = q.choices.map((_, i) => i);
      }
    });

    setShuffledChoices(shuffled);
    setOriginalAnswerIndices(indices);
  };

  // Timer logic
  useEffect(() => {
    if (quizStarted && timerMode && !finished) {
      if (timeRemaining <= 0) {
        setFinished(true);
        clearInterval(timerIntervalRef.current);
        return;
      }

      timerIntervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timerIntervalRef.current);
    }
  }, [quizStarted, timerMode, finished, timeRemaining]);

  const currentQuestion = questions[currentIndex];
  const score = questions.reduce((acc, q, idx) => {
    const userAnswer = answers[idx];
    if (userAnswer === undefined) return acc;
    const mappedAnswer = originalAnswerIndices[idx]?.[userAnswer];
    return acc + (mappedAnswer === q.answer ? 1 : 0);
  }, 0);

  const percent = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const correctCount = score;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentIndex(0);
    setAnswers({});
    setShowFeedback(false);
    setLastChoice(null);
    setFinished(false);
    setTimeRemaining(timeLimit);
    setShowSettings(false);
  };

  const selectChoice = (choiceIndex) => {
    if (showFeedback || finished) return;
    setLastChoice(choiceIndex);
    setAnswers((prev) => ({ ...prev, [currentIndex]: choiceIndex }));
    setShowFeedback(true);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowFeedback(false);
      setLastChoice(null);
    } else {
      setFinished(true);
      clearInterval(timerIntervalRef.current);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setShowFeedback(false);
      setLastChoice(null);
    }
  };

  const restartQuiz = () => startQuiz();

  // Export results as JSON
  const exportResults = () => {
    const exportData = {
      unit: selectedUnit,
      date: new Date().toISOString(),
      score: `${score}/${questions.length}`,
      percentage: `${percent}%`,
      answers: questions.map((q, idx) => {
        const userAnswer = answers[idx];
        const mappedAnswer = originalAnswerIndices[idx]?.[userAnswer];
        return {
          question: q.question,
          unit: q.unit,
          yourAnswer: userAnswer !== undefined ? q.choices[mappedAnswer] : "No answer",
          correctAnswer: q.choices[q.answer],
          correct: mappedAnswer === q.answer,
          explanation: q.explanation,
        };
      }),
    };

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2)));
    element.setAttribute("download", `science-cbt-results-${new Date().toISOString().split("T")[0]}.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Print results
  const printResults = () => {
    const printWindow = window.open("", "", "height=600,width=800");
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Science CBT Practice Results</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; color: #333; }
          .summary { background: #f0f0f0; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .summary-item { margin: 10px 0; }
          .question { margin: 20px 0; padding: 15px; border-left: 4px solid #007bff; background: #f9f9f9; }
          .correct { border-left-color: #28a745; }
          .incorrect { border-left-color: #dc3545; }
          .explanation { margin-top: 10px; font-style: italic; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <h1>Science CBT Practice Results</h1>
        <div class="summary">
          <div class="summary-item"><strong>Unit:</strong> ${selectedUnit}</div>
          <div class="summary-item"><strong>Score:</strong> ${score}/${questions.length} (${percent}%)</div>
          <div class="summary-item"><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
        </div>
        ${questions
          .map((q, idx) => {
            const userAnswer = answers[idx];
            const mappedAnswer = originalAnswerIndices[idx]?.[userAnswer];
            const correct = mappedAnswer === q.answer;
            return `
          <div class="question ${correct ? "correct" : "incorrect"}">
            <strong>${idx + 1}. ${q.question}</strong>
            <p><strong>Unit:</strong> ${q.unit}</p>
            <p><strong>Your answer:</strong> ${userAnswer !== undefined ? q.choices[mappedAnswer] : "No answer"}</p>
            <p><strong>Correct answer:</strong> ${q.choices[q.answer]}</p>
            <div class="explanation">${q.explanation}</div>
          </div>
            `;
          })
          .join("")}
      </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!quizStarted || finished || !showFeedback) return;

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        prevQuestion();
      } else if (e.key === "ArrowRight" && currentIndex < questions.length - 1) {
        nextQuestion();
      } else if (e.key === "Enter") {
        nextQuestion();
      }
    };

    if (quizStarted) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [quizStarted, currentIndex, finished, showFeedback, questions.length]);

  // Keyboard for answer selection (1-4 or A-D)
  useEffect(() => {
    const handleAnswerKeyDown = (e) => {
      if (!quizStarted || finished || showFeedback) return;

      const key = e.key.toLowerCase();
      if (["1", "2", "3", "4"].includes(key)) {
        selectChoice(parseInt(key) - 1);
      } else if (["a", "b", "c", "d"].includes(key)) {
        selectChoice(key.charCodeAt(0) - 97);
      }
    };

    if (quizStarted) {
      window.addEventListener("keydown", handleAnswerKeyDown);
      return () => window.removeEventListener("keydown", handleAnswerKeyDown);
    }
  }, [quizStarted, finished, showFeedback, currentIndex]);

  const selectedAnswer = answers[currentIndex];
  const mappedSelectedAnswer = selectedAnswer !== undefined ? originalAnswerIndices[currentIndex]?.[selectedAnswer] : undefined;
  const isCorrect = mappedSelectedAnswer === currentQuestion?.answer;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow-sm">
              <BookOpen className="h-4 w-4" />
              5th Grade SOL Science CBT Practice
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Interactive Computer-Based Training
            </h1>
            <p className="mt-2 max-w-2xl text-slate-600">
              Practice all major science units with instant feedback, scoring, and review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {units.map((unit) => (
              <Button
                key={unit}
                variant={selectedUnit === unit ? "default" : "outline"}
                onClick={() => {
                  setSelectedUnit(unit);
                  if (!quizStarted) {
                    setCurrentIndex(0);
                    setAnswers({});
                    setShowFeedback(false);
                    setLastChoice(null);
                    setFinished(false);
                  }
                }}
                disabled={quizStarted}
                size="sm"
              >
                {unit}
              </Button>
            ))}
          </div>
        </div>

        <Card className="rounded-2xl shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-2xl">
                  {quizStarted ? (finished ? "Review Your Score" : `Question ${currentIndex + 1} of ${questions.length}`) : "Start Practice"}
                </CardTitle>
                <p className="text-sm text-slate-500">
                  {selectedUnit === "All Units" ? "Mixed review from all units" : `Focused practice: ${selectedUnit}`}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1.5">
                    <Trophy className="h-3.5 w-3.5" />
                    Score: {score}/{questions.length}
                  </Badge>
                  <Badge variant="secondary">Answered: {answeredCount}</Badge>
                  <Badge variant="secondary">Accuracy: {percent}%</Badge>
                  {timerMode && quizStarted && !finished && (
                    <Badge variant={timeRemaining < 60 ? "destructive" : "secondary"} className="gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {formatTime(timeRemaining)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Progress value={questions.length ? (answeredCount / questions.length) * 100 : 0} />
          </CardHeader>

          <CardContent className="space-y-6">
            {!quizStarted ? (
              <div className="space-y-6">
                {!showSettings ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-2xl border bg-white p-5">
                        <h2 className="text-lg font-semibold text-slate-900">How the practice works</h2>
                        <ul className="mt-3 space-y-2 text-sm text-slate-600">
                          <li>• Choose a unit or practice all units.</li>
                          <li>• Answer each question one at a time.</li>
                          <li>• Get immediate feedback after each response.</li>
                          <li>• Review the score at the end.</li>
                          <li>• Use arrow keys to navigate, number keys (1-4) or letters (A-D) to select answers.</li>
                        </ul>
                      </div>
                      <div className="rounded-2xl border bg-white p-5">
                        <h2 className="text-lg font-semibold text-slate-900">Skills covered</h2>
                        <ul className="mt-3 grid grid-cols-1 gap-2 text-sm text-slate-600 md:grid-cols-2">
                          {units.slice(1).map((u) => (
                            <li key={u}>• {u}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={startQuiz} className="gap-2 flex-1">
                        <BookOpen className="h-4 w-4" />
                        Start Practice
                      </Button>
                      <Button onClick={() => setShowSettings(true)} variant="outline" className="gap-2">
                        <Settings className="h-4 w-4" />
                        Options
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-slate-900">Quiz Options</h2>

                    <div className="space-y-4 rounded-2xl border bg-white p-5">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={randomizeQuestions}
                            onChange={(e) => setRandomizeQuestions(e.target.checked)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium text-slate-700">Randomize Questions</span>
                        </label>
                        <Shuffle className="h-4 w-4 text-slate-400" />
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shuffleChoices}
                            onChange={(e) => setShuffleChoicesOption(e.target.checked)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium text-slate-700">Shuffle Answer Choices</span>
                        </label>
                        <Shuffle className="h-4 w-4 text-slate-400" />
                      </div>

                      <div className="border-t pt-4">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={timerMode}
                            onChange={(e) => setTimerMode(e.target.checked)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium text-slate-700">Timed Mode</span>
                        </label>
                        {timerMode && (
                          <div className="mt-3 ml-7 flex items-center gap-3">
                            <label className="text-sm font-medium text-slate-600">Time Limit (seconds):</label>
                            <input
                              type="number"
                              min="30"
                              max="3600"
                              value={timeLimit}
                              onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                              className="w-20 rounded border border-slate-300 px-2 py-1 text-sm"
                            />
                            <span className="text-sm text-slate-500">({formatTime(timeLimit)})</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button onClick={startQuiz} className="gap-2 flex-1">
                        <BookOpen className="h-4 w-4" />
                        Start Quiz
                      </Button>
                      <Button onClick={() => setShowSettings(false)} variant="outline">
                        Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : finished ? (
              <div className="space-y-6">
                <div className="rounded-2xl border bg-white p-6">
                  <div className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                    <Trophy className="h-5 w-5" />
                    Final Score: {score}/{questions.length} ({percent}%)
                  </div>
                  <p className="mt-2 text-slate-600">You answered {correctCount} questions correctly.</p>
                  {timerMode && (
                    <p className="mt-1 text-sm text-slate-500">
                      Time used: {formatTime(timeLimit - timeRemaining)}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button onClick={restartQuiz} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={exportResults} variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export JSON
                    </Button>
                    <Button onClick={printResults} variant="outline" className="gap-2">
                      <Printer className="h-4 w-4" />
                      Print
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3">
                  {questions.map((q, idx) => {
                    const userAnswer = answers[idx];
                    const mappedAnswer = originalAnswerIndices[idx]?.[userAnswer];
                    const correct = mappedAnswer === q.answer;
                    return (
                      <div key={idx} className="rounded-2xl border bg-white p-4">
                        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">{q.unit}</p>
                            <p className="mt-1 font-medium text-slate-900">
                              {idx + 1}. {q.question}
                            </p>
                          </div>
                          <Badge variant={correct ? "default" : "destructive"} className="gap-1 self-start">
                            {correct ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                            {correct ? "Correct" : "Review"}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm text-slate-600">
                          Your answer: {userAnswer !== undefined ? q.choices[mappedAnswer] : "No answer"}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">Correct answer: {q.choices[q.answer]}</p>
                        <p className="mt-2 text-sm text-slate-500">{q.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <TimerReset className="h-4 w-4" />
                    Practice Mode
                  </div>
                  <div>{currentQuestion?.unit}</div>
                </div>

                {currentQuestion && (
                  <div className="space-y-4 rounded-2xl border bg-white p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-500">Unit Topic</p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">{currentQuestion.unit}</h2>
                      </div>
                      <Badge variant="outline">Question {currentIndex + 1}</Badge>
                    </div>

                    <p className="text-lg font-medium text-slate-900">{currentQuestion.question}</p>

                    <div className="grid gap-3">
                      {shuffledChoices[currentIndex]?.map((choice, idx) => {
                        const selected = selectedAnswer === idx;
                        const correct = currentQuestion.answer === originalAnswerIndices[currentIndex]?.[idx];
                        let classes = "border-slate-200 hover:border-slate-400";
                        if (showFeedback) {
                          if (correct) classes = "border-green-500 bg-green-50";
                          else if (selected) classes = "border-red-500 bg-red-50";
                        } else if (selected) {
                          classes = "border-slate-900 bg-slate-50";
                        }

                        return (
                          <button
                            key={choice}
                            onClick={() => selectChoice(idx)}
                            className={`w-full rounded-2xl border p-4 text-left transition ${classes}`}
                            disabled={showFeedback}
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-700">
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="text-slate-900">{choice}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                      <p>💡 <strong>Keyboard shortcuts:</strong> Use 1-4 or A-D to select, arrow keys to navigate, Enter to continue</p>
                    </div>

                    {showFeedback && (
                      <div className={`rounded-2xl p-4 ${isCorrect ? "bg-green-50" : "bg-rose-50"}`}>
                        <div className="flex items-center gap-2 font-semibold text-slate-900">
                          {isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-rose-600" />
                          )}
                          {isCorrect ? "Correct!" : "Not quite."}
                        </div>
                        <p className="mt-2 text-sm text-slate-700">{currentQuestion.explanation}</p>
                      </div>
                    )}

                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={prevQuestion}
                          disabled={currentIndex === 0}
                          className="gap-2"
                        >
                          <ArrowLeft className="h-4 w-4" />
                          Back
                        </Button>
                        <Button variant="outline" onClick={restartQuiz} className="gap-2">
                          <RotateCcw className="h-4 w-4" />
                          Restart
                        </Button>
                      </div>
                      <Button onClick={nextQuestion} disabled={!showFeedback} className="gap-2">
                        {currentIndex === questions.length - 1 ? "Finish" : "Next"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}