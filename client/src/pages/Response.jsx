import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { fetchFormByIdApi } from "../apis/Form";
import Navbar from '../components/Navbar';
import styles from '../assets/Response.module.css';
import {PieChart} from 'react-minimal-pie-chart';

function Response() {
    const token = useAuth();
    const [searchParams] = useSearchParams();

    const [formId, setFormId] = useState(searchParams.get('wid'));
    const [formStarts, setFormStarts] = useState(0);
    const [formCompletion, setFormCompletion] = useState(0);

    const [noResponse, setNoResponse] = useState(false);
    const [formData, setFormData] = useState({ formHits: 0, formSequence: [], formResponse: [] });

    const { formHits, formSequence, formResponse } = formData;
    const headers = formSequence.filter((data) => data.key.includes("user")).map(item => item.key);

    const getFromStats = () => {
        let starts = 0, completes = 0;
        const seqLength = formSequence.filter(item => item.data.role === 'user').length;

        formResponse.forEach((item) => {
            const resLength = Object.keys(item).length;
            seqLength == resLength - 2 ? completes++ : starts++;
        })

        setFormStarts(starts);
        setFormCompletion(completes);
    };

    const fetchFormById = async () => {
        const data = await fetchFormByIdApi(formId, token);
        setFormData(data);
        if (data.formResponse.length == 0) setNoResponse(true);
    };

    useEffect(() => {
        if (token && formId) {
            fetchFormById();
        }
    }, [token, formId]);

    useEffect(() => {
        if (token && formId) {
            getFromStats();
        }
    }, [formSequence, formResponse]);

    return (

            <div className={styles.response}>
                <Navbar />
                {noResponse ? (
                    <p className={styles.noResponse}>No response yet collected</p>
                ) : (
                    <section className={styles.content}>
                        <div className={styles.brief}>
                            <div className={styles.card}>
                                <p>Views</p>
                                <p>{formHits}</p>
                            </div>
                            <div className={styles.card}>
                                <p>Starts</p>
                                <p>{formStarts}</p>
                            </div>
                        </div>
                        {formResponse.length > 0 && (
                            <div className={styles.tableContainer}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>First Interaction Time</th>
                                            {headers.map((key) => (
                                                <th key={key}>{key.split("-")[1].split(":").join(" ")}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formResponse.map((valueRow, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{valueRow.startDate}</td>
                                                {headers.map((key) => (
                                                    <td key={key}>{valueRow[key]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <div className={styles.completion}>
                            <div className={styles.pieChart}>
                                <PieChart
                                    data={[
                                        { title: 'Completed', value: formCompletion, color: '#3B82F6' },
                                        { title: 'Incomplete', value: formHits - formCompletion, color: '#909090' },
                                    ]}
                                    totalValue={formHits}
                                    lineWidth={25}
                                    startAngle={-50}
                                    segmentsStyle={{ transition: 'stroke .3s', cursor: 'pointer' }}
                                    label={({ dataEntry }) =>
                                        dataEntry.title === 'Completed' ? `Completed ${parseInt(dataEntry.percentage)}%` : ''
                                    }
                                    labelPosition={130}
                                    labelStyle={{
                                        fontSize: '7px',
                                        fill: '#ffffff',
                                        textAnchor: 'middle',
                                        fontFamily: 'sans-serif',
                                    }}
                                    style={{ height: '300px', width: '580px' }}
                                />
                            </div>
                            <div className={styles.card}>
                                <p>Completion rate</p>
                                <p>{formHits ? parseInt((formCompletion / formHits) * 100) : 0} %</p>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        
        
    )
}

export default Response;


