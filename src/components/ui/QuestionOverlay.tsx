import React from 'react';

type QuestionOverlayProps = {
  // Props will be added later
};

const QuestionOverlay: React.FC<QuestionOverlayProps> = (props) => {
  return (
    <div className="fixed top-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500 text-white z-[1000] p-5">
      <h1 className="text-2xl">Tailwind Overlay Debug</h1>
      <p>If you see this blue box, Tailwind is applying basic classes.</p>
      <button className="mt-4 p-2 bg-green-500">Test Button</button>
    </div>
  );
};

export default QuestionOverlay; 