import React from 'react';
import '../styles/HistoryModal.css';

const HistoryModal = ({ show, handleClose, title, data, currentPage, totalPages, onPageChange }) => {
    if (!show) return null;

    // 이전 값과 비교하여 증차감을 계산
    const calculateChanges = (data) => {
        return data.map((item, index) => {
            if (index === 0) {
                return { ...item, change: 0 }; // 첫 번째 항목은 증차감이 없으므로 0으로 표시
            }
            const previousValue = data[index - 1].value;
            const change = (item.value - previousValue).toFixed(1); // 소수점 1자리로 계산
            return { ...item, change: parseFloat(change) };
        });
    };

    const processedData = calculateChanges(data);

    return (
        <div className="history-modal-overlay">
            <div className="history-modal-container">
                <div className="history-modal-header">
                    <h2>{title}</h2>
                    <button className="history-modal-close" onClick={handleClose}>×</button>
                </div>
                <div className="history-modal-content">
                    <ul className="history-list">
                        <li className="history-item header">
                            <span>날짜</span>
                            <span>수치</span>
                            <span>증차감</span>
                        </li>
                        {processedData.map((item, index) => (
                            <li key={index} className="history-item">
                                <span className="history-date">{new Date(item.measureDate).toLocaleDateString()}</span>
                                <span className="history-value">{item.value.toFixed(1)}</span> {/* 소수점 1자리로 표시 */}
                                <span className={`history-change ${item.change > 0 ? 'increase' : item.change < 0 ? 'decrease' : ''}`}>
                                    {item.change.toFixed(1)} {/* 소수점 1자리로 표시 */}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="history-modal-footer">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button 
                            key={index} 
                            className={`pagination-button ${currentPage === index ? 'active' : ''}`}
                            onClick={() => onPageChange(index)}
                            disabled={currentPage === index}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HistoryModal;
