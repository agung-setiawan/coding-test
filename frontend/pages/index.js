import { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import askAI from "../services/askai";
import { parseMarkdown } from '../utils/markdownParser';

export default function Dashboard() {
    const [question, setQuestion] = useState('');
    const [fullAnswer, setFullAnswer] = useState('');
    const [displayedAnswer, setDisplayedAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [typingDone, setTypingDone] = useState(false);
    const [buttonTitle, setButtonTitle] = useState("Ask");
    const [disabledTextBox, setDisabledTextBox] = useState(false);
    const [disabledButton, setDisabledButton] = useState(false);
    const outputRef = useRef(null);
    const [spinner, setSpinner] = useState(false);

    const handleAsk = async (e) => {
        e.preventDefault();
        let parsedText = null;
        setLoading(true);
        setTypingDone(false);
        setDisplayedAnswer('');
        setFullAnswer('');
        setDisabledTextBox(true);
        setDisabledButton(true);
        setSpinner(true);

        try {
            const res = await askAI({'question' : question})
            parsedText = parseMarkdown(res.answer)
            setFullAnswer(parsedText);
        } catch (err) {
            setFullAnswer('Error getting response from server.');
        }
    };

    useEffect(() => {
        if (!fullAnswer) return;

        let index = -1;
        const interval = setInterval(() => {
            setButtonTitle("Answering...");
            setDisabledTextBox(true);
            setDisabledButton(true);
            setDisplayedAnswer((prev) => prev + fullAnswer.charAt(index));
            setSpinner(true);
            setLoading(false);

            index++;

            if (outputRef.current) {
                const el = outputRef.current;
                if (el.scrollHeight > el.clientHeight) {
                    el.scrollTop = el.scrollHeight;
                }
            }

            if (index >= fullAnswer.length) {
                clearInterval(interval);
                setTypingDone(true);
                onTypingComplete();
            }

        }, 30); // Typing speed (ms per char)

        return () => clearInterval(interval);
    }, [fullAnswer]);

    const onTypingComplete = () => {
        setSpinner(false);
        setDisabledTextBox(false);
        setButtonTitle("Ask");
        setDisabledButton(false);
    };

    const onClear = () => {
        setDisplayedAnswer('');
        setFullAnswer('');
        setQuestion('');
        setTypingDone(false);
    }

    return (
        <Layout>
            {loading && (
                <div className="loading-mask">
                    <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            <div className="container mt-5">
                <h2 className="mb-4">Ask AI a Question</h2>
                <form onSubmit={handleAsk}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Type your question..."
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            required
                            disabled={disabledTextBox}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={disabledButton} >
                        {spinner ? (<span className="spinner-border spinner-border-sm"></span>) : (<span className="bi bi-robot"></span>)}
                        &nbsp;{buttonTitle}
                    </button>
                </form>

                <div
                    ref={outputRef}
                    className="alert alert-light border p-2 mt-4"
                    style={{
                        overflowY: 'scroll',
                        minHeight: '400px',
                        maxHeight: '400px'
                    }}
                >
                    {displayedAnswer && (
                        <div dangerouslySetInnerHTML={{ __html: displayedAnswer }}></div>
                    )}
                </div>

                {typingDone && (
                    <div className="col-md-12 text-right">
                        <button className="btn btn-success" onClick={onClear}>Clear...</button>
                    </div>
                )}
            </div>
        </Layout>
    );
}