import React, { useState, useEffect, useContext, useCallback } from 'react';
import '../styles/InbodyStats.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { UserContext } from '../contexts/UserContext';
import { api } from '../api/Api.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const InbodyStats = () => {
    const { user: currentUser } = useContext(UserContext);
    const [data, setData] = useState({
        weight: [],
        muscle: [],
        fat: [],
        bmi: [],
        bodyFatPercentage: [],
        measureDate: []
    });

    const fetchInbodyData = useCallback(async () => {
        try {
            const response = await api.get('/physicals/all');
            const allData = response.data.content;
            const limitedData = allData.slice(-10); // 마지막 10일치 데이터로 제한

            // 날짜순으로 정렬
            limitedData.sort((a, b) => new Date(a.measureDate) - new Date(b.measureDate));

            const chartData = {
                weight: limitedData.map(item => item.weight),
                muscle: limitedData.map(item => item.muscleMass),
                fat: limitedData.map(item => item.bodyFatMass),
                bmi: limitedData.map(item => item.bmi),
                bodyFatPercentage: limitedData.map(item => item.bodyFatPercentage),
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

    const createChartData = (label, dataKey, borderColor) => ({
        labels: data.measureDate.map(date => new Date(date).toLocaleDateString()),
        datasets: [
            {
                label,
                data: data[dataKey],
                borderColor,
                backgroundColor: 'rgba(255, 99, 132, 0.2)', // 배경 색상 추가
                borderWidth: 2,
                pointRadius: 3,
                pointBackgroundColor: borderColor,
                tension: 0.3, // 곡선형 그래프를 위해 추가
                fill: true, // 그래프 아래 부분을 채움
                datalabels: {
                    anchor: 'end',
                    align: 'start', // 모든 점에 숫자가 표시되도록 설정
                    offset: 4,
                    formatter: (value) => value.toFixed(1), // 소수점 한자리로 표기
                    font: {
                        size: 10,
                        weight: 'bold'
                    },
                    color: '#ff6600', // 오렌지색으로 변경
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
        <div className="inbody-stats-page">
            <div className="inbody-stats-container">
                <h3 className="chart-title">체중 (kg)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('체중', 'weight', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
                <h3 className="chart-title">골격근량 (kg)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('골격근량', 'muscle', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
                <h3 className="chart-title">체지방량 (kg)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('체지방량', 'fat', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
                <h3 className="chart-title">BMI (kg/m²)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('BMI', 'bmi', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
                <h3 className="chart-title">체지방률 (%)</h3>
                <div className="chart-card">
                    <div className="chart-item">
                        <Line data={createChartData('체지방률', 'bodyFatPercentage', '#ff6600')} options={options} plugins={[ChartDataLabels]} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InbodyStats;
