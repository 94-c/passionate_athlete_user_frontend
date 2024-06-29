import React, { useState, useEffect } from 'react';
import '../styles/Inbody.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer'; // Head 컴포넌트 import 추가

const Inbody = () => {
    const [data, setData] = useState({ weight: [], muscle: [], fat: [] });

    useEffect(() => {
        // 7일치 가짜 데이터
        const fakeData = {
            weight: [70, 71, 69, 72, 70, 68, 71],
            muscle: [30, 31, 30, 32, 31, 29, 32],
            fat: [15, 14, 15, 13, 14, 16, 15]
        };
        setData(fakeData);
    }, []);

    const chartData = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
        datasets: [
            {
                label: '체중(kg)',
                data: data.weight,
                borderColor: 'orange',
                fill: false,
            },
            {
                label: '근육량(kg)',
                data: data.muscle,
                borderColor: 'green',
                fill: false,
            },
            {
                label: '체지방(kg)',
                data: data.fat,
                borderColor: 'red',
                fill: false,
            }
        ]
    };

    return (
        <div className="inbody-page">
            <div className="inbody-container">
                <div className="button-container">
                    <button className="btn btn-register">
                        <FontAwesomeIcon icon={faPlus} className="button-icon" />
                        <span className="button-title">등록</span>
                    </button>
                    <button className="btn btn-details">
                        <FontAwesomeIcon icon={faCalendarAlt} className="button-icon" />
                        <span className="button-title">보기</span>
                    </button>
                    <button className="btn btn-stats">
                        <FontAwesomeIcon icon={faChartBar} className="button-icon" />
                        <span className="button-title">통계</span>
                    </button>
                </div>
                <div className="chart-label">변화그래프</div>
                <div className="chart-container">
                    <Line data={chartData} />
                </div>
            </div>
        </div>

    );
};

export default Inbody;
