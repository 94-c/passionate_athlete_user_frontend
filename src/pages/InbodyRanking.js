// InbodyRanking.js
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMale, faFemale, faArrowLeft, faBell } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../contexts/UserContext';
import '../styles/InbodyRanking.css';
import { api } from '../api/Api.js';
import dayjs from 'dayjs'; // 날짜 처리 라이브러리

const InbodyRanking = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [gender, setGender] = useState('');
    const [rankingPeriod, setRankingPeriod] = useState('daily');
    const [title, setTitle] = useState('일간 인바디 랭킹');
    const [rankingData, setRankingData] = useState([]);

    useEffect(() => {
        if (user) {
            setGender(user.gender);
            fetchRankingData('daily', dayjs().toISOString());
        }
    }, [user]);

    const handleBackClick = () => {
        navigate('/inbody');
    };

    const handleGenderChange = (gender) => {
        setGender(gender);
    };

    const handlePeriodChange = (period) => {
        setRankingPeriod(period);
        switch (period) {
            case 'daily':
                setTitle('일간 인바디 랭킹');
                break;
            case 'weekly':
                setTitle('주간 인바디 랭킹');
                break;
            case 'monthly':
                setTitle('월간 인바디 랭킹');
                break;
            default:
                setTitle('인바디 랭킹');
        }
        fetchRankingData(period, dayjs().toISOString());
    };

    const fetchRankingData = async (type, date) => {
        try {
            const response = await api.get('/physicals/rankings', {
                params: {
                    type: type,
                    date: date
                }
            });
            console.log('Ranking Data:', response.data.rankings); 
            if (response.data && response.data.rankings) {
                setRankingData(response.data.rankings);
            } else {
                setRankingData([]); 
            }
        } catch (error) {
            console.error('Error fetching ranking data:', error);
            setRankingData([]); 
        }
    };

    const handleRefreshClick = () => {
        fetchRankingData(rankingPeriod, dayjs().toISOString());
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleRefreshClick();
        }, 30 * 60 * 1000); // 30분마다 자동 새로고침

        return () => clearInterval(interval);
    }, [rankingPeriod]);

    return (
        <div className="inbody-ranking-page">
            <div className="inbody-ranking-header">
                <button className="inbody-ranking-back-button" onClick={handleBackClick}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h1 className="inbody-ranking-title">인바디 랭킹</h1>
                <div className="inbody-ranking-gender-buttons">
                    <button 
                        className={gender === 'male' ? 'active' : ''} 
                        onClick={() => handleGenderChange('male')}
                        data-hover-text="남성"
                    >
                        <FontAwesomeIcon icon={faMale} />
                    </button>
                    <button 
                        className={gender === 'female' ? 'active' : ''} 
                        onClick={() => handleGenderChange('female')}
                        data-hover-text="여성"
                    >
                        <FontAwesomeIcon icon={faFemale} />
                    </button>
                </div>
            </div>
            <div className="inbody-ranking-highlight">
                <p><span className="user-name">[{user?.branchName}] {user?.name}</span>님의 한달 감소 체지방량</p>
                <h2>4.2 kg</h2>
            </div>
            <div className="inbody-ranking-highlight-bar" onClick={handleRefreshClick}>
                <FontAwesomeIcon icon={faBell} className="bell-icon" />
                <p>랭킹은 매 시간 <span className="orange-text">30분</span> 단위로 자동 업데이트 됩니다. 수동 새로고침을 하시려면 클릭하세요.</p>
            </div>
            <div className="inbody-ranking-section">
                <div className="inbody-ranking-section-header">
                    <h2>{title}</h2>
                    <div className="inbody-ranking-period-buttons">
                        <button 
                            className={rankingPeriod === 'daily' ? 'active' : ''} 
                            onClick={() => handlePeriodChange('daily')}
                            data-hover-text="일간"
                        >
                            일간
                        </button>
                        <button 
                            className={rankingPeriod === 'weekly' ? 'active' : ''} 
                            onClick={() => handlePeriodChange('weekly')}
                            data-hover-text="주간"
                        >
                            주간
                        </button>
                        <button 
                            className={rankingPeriod === 'monthly' ? 'active' : ''} 
                            onClick={() => handlePeriodChange('monthly')}
                            data-hover-text="월간"
                        >
                            월간
                        </button>
                    </div>
                </div>
                <ul className="inbody-ranking-list">
                    {rankingData.length > 0 ? (
                        rankingData.map((item, index) => (
                            <li key={index} className="inbody-ranking-item">
                                <span className="inbody-ranking-rank">{index + 1}</span>
                                <span className="inbody-ranking-username">{item.username}</span>
                                <span className="inbody-ranking-body-fat-change">{item.bodyFatMassChange} kg</span>
                            </li>
                        ))
                    ) : (
                        <li className="inbody-ranking-item no-data-item">
                            <span className="no-data">데이터가 없습니다.</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default InbodyRanking;
