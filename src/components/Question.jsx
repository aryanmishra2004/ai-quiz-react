import { useState } from "react";

function Question({ q, index }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="card">
      <h3>Q{index + 1}. {q.question}</h3>

      {Object.entries(q.options).map(([key, value]) => {
        let className = "option";

        if (selected) {
          if (key === q.answer) className += " correct";
          else if (key === selected) className += " wrong";
        }

        return (
          <div
            key={key}
            className={className}
            onClick={() => setSelected(key)}
          >
            {key}. {value}
          </div>
        );
      })}

      {selected && (
        <p>Correct Answer: {q.answer}</p>
      )}
    </div>
  );
}

export default Question;
