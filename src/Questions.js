import React from 'react';

const Questions = () => {
  return (
    <div>
      <h1>Health Monitor Questions</h1>
      <form>
        <div>
          <label htmlFor="question1">How are you feeling today?</label>
          <input type="text" id="question1" name="question1" />
        </div>
        <div>
          <label htmlFor="question2">Did you exercise today?</label>
          <input type="text" id="question2" name="question2" />
        </div>
        <div>
          <label htmlFor="question3">How many hours did you sleep last night?</label>
          <input type="number" id="question3" name="question3" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Questions;