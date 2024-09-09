import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../styles/Inbody.css';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTachometerAlt, faChartBar, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';

const Inbody = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ weight: [], muscle: [], fat: [], measureDate: [] });
    const { user: currentUser } = useContext(UserContext);

    const fetchInbodyData = useCallback(async () => {
        try {
            const response = await api.get('/physicals/all');
            const allData = response.data.content;

            // 날짜를 기준으로 가장 최신순으로 정렬
            const sortedData = allData.sort((a, b) => new Date(b.measureDate) - new Date(a.measureDate));

            // 최근 5일치 데이터만 가져오기
            const limitedData = sortedData.slice(0, 5);

            // 날짜를 오름차순으로 다시 정렬 (그래프에 날짜순으로 표시하기 위해)
            limitedData.sort((a, b) => new Date(a.measureDate) - new Date(b.measureDate));

            // 차트에 필요한 데이터 형식으로 변환
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
                backgroundColor: 'rgba(255, 165, 0, 0.2)',
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: 'orange',
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
                display: false
            }
        },
        plugins: {
            legend: {
                display: false
            },
            datalabels: {
                color: '#ff6600',
                anchor: 'end',
                align: 'start',
                offset: 4,
                font: {
                    size: 10,
                    weight: 'bold'
                },
                formatter: (value) => value.toFixed(1)
            }
        }
    };

    return (
        <div className="inbody-page">
            <div className="inbody-container">
                <div className="button-container">
                    <button className="btn btn-register" onClick={() => navigate('/inbody/register')}>
                        <FontAwesomeIcon icon={faPlus} className="button-icon" />
                        <span className="button-title">등록</span>
                    </button>
                    <button className="btn btn-details" onClick={() => navigate('/inbody/dashboard')}>
                        <FontAwesomeIcon icon={faTachometerAlt} className="button-icon" />
                        <span className="button-title">대시보드</span>
                    </button>
                    <button className="btn btn-stats" onClick={() => navigate('/inbody/status')}>
                        <FontAwesomeIcon icon={faChartBar} className="button-icon" />
                        <span className="button-title">통계</span>
                    </button>
                </div>
                <div className="chart-label">
                    변화그래프
                    <div className="inbody-tooltip-container">
                        <FontAwesomeIcon icon={faQuestionCircle} className="inbody-tooltip-icon" />
                        <span className="inbody-tooltip-text">최근 5일치 데이터만 나옵니다.</span>
                    </div>
                </div>
                <div className="inbody-chart-container">
                    <Line data={createChartData()} options={options} plugins={[ChartDataLabels]} />
                </div>
            </div>
        </div>
    );
};

export default Inbody;
