import React, { useState, useEffect, useContext } from 'react';
import '../styles/Inbody.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCalendarAlt, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/UserContext';
import axios from 'axios'; // axios를 사용하여 API 호출

const Inbody = () => {
    const [data, setData] = useState({ weight: [], muscle: [], fat: [], measureDate: [] });
    const { user: currentUser } = useContext(UserContext);

    useEffect(() => {
        const fetchInbodyData = async () => {
            try {
                const response = await axios.get('/physicals/all', {
                    headers: {
                        Authorization: `Bearer ${currentUser.token}`
                    }
                });
                const allData = response.data.content;
                const limitedData = allData.slice(-7); // 마지막 7일치 데이터로 제한
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
        };

        fetchInbodyData();
    }, [currentUser]);

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
