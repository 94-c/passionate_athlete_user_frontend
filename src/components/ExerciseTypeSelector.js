import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faSyncAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import '../styles/ExerciseTypeSelector.css';

const ExerciseTypeSelector = ({ onSelectType }) => {
  return (
    <div className="exercise-type-selector">
      <button onClick={() => onSelectType('main')}>
        <FontAwesomeIcon icon={faDumbbell} className="exercise-type-icon" /> 본운동
      </button>
      <button onClick={() => onSelectType('modified')}>
        <FontAwesomeIcon icon={faSyncAlt} className="exercise-type-icon" /> 변형
      </button>
      <button onClick={() => onSelectType('additional')}>
        <FontAwesomeIcon icon={faPlus} className="exercise-type-icon" /> 추가 운동
      </button>
    </div>
  );
};

export default ExerciseTypeSelector;
