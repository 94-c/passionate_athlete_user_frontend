import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../styles/Inbody.css';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
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

    const createChartData = () => ({
        labels: data.measureDate.map(date => new Date(date).toLocaleDateString()),
        datasets: [
            {
                label: '체중(kg)',
                data: data.weight,
                borderColor: 'orange',
                backgroundColor: 'rgba(255, 165, 0, 0.2)', // 배경 색상 추가
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: 'orange',
                tension: 0.3, // 곡선형 그래프를 위해 추가
                fill: true, // 그래프 아래 부분을 채움
                datalabels: {
                    anchor: 'end',
                    align: 'start',
                    offset: 4,
                    formatter: (value) => value.toFixed(1),
                    font: {
                        size: 10,
                        weight: 'bold'
                    },
                    color: '#ff6600',
                }
            },
            {
                label: '근육량(kg)',
                data: data.muscle,
                borderColor: 'green',
                backgroundColor: 'rgba(0, 128, 0, 0.2)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: 'green',
                tension: 0.3,
                fill: true,
                datalabels: {
                    anchor: 'end',
                    align: 'start',
                    offset: 4,
                    formatter: (value) => value.toFixed(1),
                    font: {
                        size: 10,
                        weight: 'bold'
                    },
                    color: '#ff6600',
                }
            },
            {
                label: '체지방(kg)',
                data: data.fat,
                borderColor: 'red',
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: 'red',
                tension: 0.3,
                fill: true,
                datalabels: {
                    anchor: 'end',
                    align: 'start',
                    offset: 4,
                    formatter: (value) => value.toFixed(1),
                    font: {
                        size: 10,
                        weight: 'bold'
                    },
                    color: '#ff6600',
                }
            }
        ]
    });

    const options = {
        scales: {
            y: {
                display: false // Y축을 숨김
            }
        },
        plugins: {
            legend: {
                display: false // 범례를 숨김
            },
            datalabels: {
                color: '#ff6600', // 오렌지색으로 변경
                anchor: 'end',
                align: 'start', // 모든 점에 숫자가 표시되도록 설정
                offset: 4,
                font: {
                    size: 10,
                    weight: 'bold'
                },
                formatter: (value) => value.toFixed(1) // 소수점 한자리로 표시
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
                        <FontAwesomeIcon icon={faChartBar} className="button-icon" onClick={() => handleNavigate('/inbody-status')} />
                        <span className="button-title">통계</span>
                    </button>
                </div>
                <div className="chart-label">변화그래프</div>
                <div className="chart-container">
                    <Line data={createChartData()} options={options} plugins={[ChartDataLabels]} />
                </div>
            </div>
        </div>
    );
};

export default Inbody;
