import React, { useState } from "react";

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

export default function PrintableScienceCBT() {
  const [selectedUnit, setSelectedUnit] = useState("All Units");

  const units = ["All Units", ...Array.from(new Set(questionBank.map((q) => q.unit)))];
  
  const questions = selectedUnit === "All Units" 
    ? questionBank 
    : questionBank.filter((q) => q.unit === selectedUnit);

  return (
    <div className="min-h-screen bg-white p-8">
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none; }
          .page-break { page-break-after: always; }
          .question { page-break-inside: avoid; }
        }
      `}</style>

      {/* Header - No Print */}
      <div className="mb-8 no-print">
        <h1 className="text-4xl font-bold mb-4">5th Grade Science CBT Practice</h1>
        <p className="text-gray-600 mb-6">Printable Study Guide & Answer Key</p>
        
        <div className="mb-6">
          <label className="font-semibold mr-4">Select Unit:</label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="border border-gray-300 rounded px-4 py-2"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          🖨️ Print This Page
        </button>
      </div>

      {/* Printable Content */}
      <div className="printable-content max-w-4xl mx-auto">
        {/* Title Page */}
        <div className="text-center mb-12 page-break">
          <h1 className="text-5xl font-bold mb-4">5th Grade SOL Science</h1>
          <h2 className="text-3xl font-semibold text-blue-600 mb-4">
            Computer-Based Training Practice
          </h2>
          <p className="text-xl text-gray-600 mb-2">Study Guide & Answer Key</p>
          <p className="text-gray-600 mb-8">Unit: {selectedUnit}</p>
          <p className="text-gray-600 text-sm">Total Questions: {questions.length}</p>
          <p className="text-gray-600 text-sm mt-2">Date: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Table of Contents */}
        <div className="mb-12 page-break">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-gray-400 pb-2">Table of Contents</h2>
          <ol className="space-y-2">
            {questions.map((q, idx) => (
              <li key={idx} className="text-gray-700">
                {idx + 1}. {q.unit}: {q.question.substring(0, 50)}...
              </li>
            ))}
          </ol>
        </div>

        {/* Study Questions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 border-b-2 border-gray-400 pb-2">Study Questions</h2>
          
          {questions.map((q, idx) => (
            <div key={idx} className="question mb-8 page-break">
              <div className="flex items-start mb-4">
                <div className="text-lg font-bold text-blue-600 mr-4 min-w-[30px]">{idx + 1}.</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-2">Unit: {q.unit}</p>
                  <p className="text-lg font-semibold text-gray-800 mb-4">{q.question}</p>
                </div>
              </div>

              {/* Answer Choices */}
              <div className="ml-10 mb-6 bg-gray-50 p-4 rounded">
                <p className="font-semibold text-gray-700 mb-3">Choose the best answer:</p>
                {q.choices.map((choice, cidx) => (
                  <div key={cidx} className="mb-2 flex items-start">
                    <span className="font-bold text-gray-600 mr-3">
                      {String.fromCharCode(65 + cidx)}.
                    </span>
                    <span className="text-gray-700">{choice}</span>
                  </div>
                ))}
              </div>

              {/* Answer Lines */}
              <div className="ml-10 mb-4">
                <p className="text-sm text-gray-600 mb-2">Your Answer: ___________</p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 my-6"></div>
            </div>
          ))}
        </div>

        {/* Answer Key - Page Break */}
        <div className="page-break mt-12">
          <h2 className="text-2xl font-bold mb-8 border-b-2 border-red-400 pb-2 text-red-600">Answer Key</h2>
          
          {questions.map((q, idx) => (
            <div key={idx} className="mb-8 page-break">
              <div className="flex items-start mb-2">
                <div className="text-lg font-bold text-blue-600 mr-4 min-w-[30px]">{idx + 1}.</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 mb-1">{q.question}</p>
                  <p className="text-sm text-gray-600 mb-3">Unit: {q.unit}</p>
                </div>
              </div>

              {/* Correct Answer */}
              <div className="ml-10 bg-green-50 p-4 rounded mb-4 border-l-4 border-green-600">
                <p className="font-bold text-green-700">
                  Correct Answer: {String.fromCharCode(65 + q.answer)} - {q.choices[q.answer]}
                </p>
              </div>

              {/* Explanation */}
              <div className="ml-10 bg-blue-50 p-4 rounded border-l-4 border-blue-600">
                <p className="font-semibold text-blue-900 mb-1">Explanation:</p>
                <p className="text-gray-700">{q.explanation}</p>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-300 my-6"></div>
            </div>
          ))}
        </div>

        {/* Study Tips - Final Page */}
        <div className="page-break mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b-2 border-purple-400 pb-2">Study Tips</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-purple-600 mb-2">📚 How to Use This Study Guide</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Read each question carefully</li>
                <li>Try to answer without looking at the answer key</li>
                <li>Check your answers against the answer key</li>
                <li>Review the explanations for any questions you missed</li>
                <li>Use the practice app for unlimited quizzes</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-purple-600 mb-2">🎯 Key Topics to Master</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Scientific Investigation:</strong> Variables, tools, measurement</li>
                <li><strong>Light:</strong> Reflection and refraction</li>
                <li><strong>Sound:</strong> Vibrations and wave travel</li>
                <li><strong>Energy:</strong> Potential and kinetic energy</li>
                <li><strong>Matter:</strong> States and solutions</li>
                <li><strong>Motion:</strong> Forces and friction</li>
                <li><strong>Earth's Processes:</strong> Weathering and water cycle</li>
                <li><strong>Electricity:</strong> Conductors and circuits</li>
                <li><strong>Resources:</strong> Renewable and nonrenewable</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-purple-600 mb-2">✅ Test-Taking Strategies</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Read all answer choices before selecting</li>
                <li>Eliminate obviously wrong answers</li>
                <li>Look for key words in questions</li>
                <li>Don't second-guess yourself too much</li>
                <li>Manage your time effectively</li>
                <li>Use the keyboard shortcuts in the practice app</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded border-l-4 border-yellow-600">
              <p className="font-bold text-yellow-900 mb-1">💡 Pro Tip:</p>
              <p className="text-gray-700">Use the practice app's timer mode and randomization features to simulate the real test experience!</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-300 text-gray-600 text-sm">
          <p>5th Grade SOL Science CBT Practice | Generated: {new Date().toLocaleDateString()}</p>
          <p>For interactive practice, use the Science CBT Practice App</p>
        </div>
      </div>
    </div>
  );
}
