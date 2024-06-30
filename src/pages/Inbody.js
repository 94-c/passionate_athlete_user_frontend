import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../styles/Inbody.css';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTachometerAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';

const Inbody = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };
    const [data, setData] = useState({ weight: [], muscle: [], fat: [], measureDate: [] });
    const { user: currentUser } = useContext(UserContext);

    const fetchInbodyData = useCallback(async () => {
        try {
            const response = await api.get('/physicals/all');
            const allData = response.data.content;
            const limitedData = allData.slice(-7); // 마지막 7일치 데이터로 제한

            // 날짜순으로 정렬
            limitedData.sort((a, b) => new Date(a.measureDate) - new Date(b.measureDate));

            const chartData = {
                weight: limitedData.map(item => item.weight),
                muscle: limitedData.map(item => item.muscleMass),
                fat: limitedData.map(item => item.bodyFatMass),
                measureDate: limitedData.map(item => item.measureDate)
            };
            setData(chartData);
        } catch (error) {
            console.error("Error fetching inbody data", error);
        }
    }, [currentUser]);

    useEffect(() => {
        fetchInbodyData();
    }, [fetchInbodyData]);

    const chartData = {
        labels: data.measureDate.map(date => new Date(date).toLocaleDateString()), // 날짜를 로컬 형식으로 변환
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

    const options = {
        scales: {
            y: {
                ticks: {
                    stepSize: 5 // Y축 눈금을 5단위로 설정
                },
                beginAtZero: true // 0부터 시작
            }
        },
        plugins: {
            legend: {
                display: false // 범례를 숨김
            }
        }
    };

    return (
        <div className="inbody-page">
            <div className="inbody-container">
                <div className="button-container">
                    <button className="btn btn-register">
                        <FontAwesomeIcon icon={faPlus} className="button-icon" onClick={() => handleNavigate('/inbody-register')} />
                        <span className="button-title">등록</span>
                    </button>
                    <button className="btn btn-details">
                        <FontAwesomeIcon icon={faTachometerAlt} className="button-icon" onClick={() => handleNavigate('/inbody-dashboard')} />
                        <span className="button-title">대시보드</span>
                    </button>
                    <button className="btn btn-stats">
                        <FontAwesomeIcon icon={faChartBar} className="button-icon" />
                        <span className="button-title">통계</span>
                    </button>
                </div>
                <div className="chart-label">변화그래프</div>
                <div className="chart-container">
                    <Line data={chartData} options={options} />
                </div>
            </div>
        </div>
    );
};

export default Inbody;
