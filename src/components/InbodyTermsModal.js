// components/InbodyTermsModal.js
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { api } from '../api/Api';
import '../styles/InbodyTermsModal.css';

const InbodyTermsModal = ({ show, handleClose }) => {
    const [terms, setTerms] = useState([]);

    useEffect(() => {
        if (show) {
            fetchTerms();
        }
    }, [show]);

    const fetchTerms = async () => {
        try {
            const response = await api.get('/physical-info');
            console.info('Failed to fetch terms', response);
            setTerms(response.data);
        } catch (error) {
            console.error('Failed to fetch terms', error);
        }
    };

    return (
        <Modal show={show} handleClose={handleClose}>
            <h2>인바디 용어 설명</h2>
            <div className="terms-list">
                {terms.map((term) => (
                    <div className="term-item" key={term.term}>
                        <div className="term-title">{term.term}</div>
                        <div className="term-description">{term.description}</div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

export default InbodyTermsModal;
