function Question({ q, index, selected, onSelect, locked }) {
  const showFeedback = Boolean(selected);

  return (
    <div className="card">
      <div className="question-header">
        <span className="question-chip">Question {index + 1}</span>
        <h3>{q.question}</h3>
      </div>

      {Object.entries(q.options).map(([key, value]) => {
        let className = "option";

        if (showFeedback) {
          if (key === q.answer) className += " correct";
          else if (key === selected) className += " wrong";
        }

        return (
          <button
            type="button"
            key={key}
            className={className}
            onClick={() => onSelect(key)}
            disabled={locked}
          >
            <span className="option-key">{key}</span>
            <span>{value}</span>
          </button>
        );
      })}

      {showFeedback && <p className="answer-text">Correct answer: {q.answer}</p>}
    </div>
  );
}

export default Question;
