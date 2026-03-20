import Question from "./Question";

function Quiz({ quiz }) {
  return (
    <div>
      {quiz.map((q, index) => (
        <Question key={index} q={q} index={index} />
      ))}
    </div>
  );
}

export default Quiz;
