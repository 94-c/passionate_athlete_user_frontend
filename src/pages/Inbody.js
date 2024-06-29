import React, { useState, useEffect } from 'react';
import '../styles/Inbody.css';
import { api } from '../api/Api.js';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';

const Inbody = () => {
    const [data, setData] = useState({ weight: [], muscle: [], fat: [] });

    useEffect(() => {
        // Fetch data from the API and set it in state
        api.get('/inbody-data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Error fetching inbody data", error);
            });
    }, []);

    const chartData = {
        labels: data.weight.map((_, index) => `Day ${index + 1}`),
        datasets: [
            {
                label: 'Weight',
                data: data.weight,
                borderColor: 'orange',
                fill: false,
            },
            {
                label: 'Muscle Mass',
                data: data.muscle,
                borderColor: 'green',
                fill: false,
            },
            {
                label: 'Body Fat',
                data: data.fat,
                borderColor: 'red',
                fill: false,
            }
        ]
    };

    return (
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
    );
};

export default Inbody;
